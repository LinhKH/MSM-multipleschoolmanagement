import formidable from "formidable";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Class from "../models/class.model.js";
import Examination from "../models/examination.model.js";
import Schedule from "../models/schedule.model.js";
import Student from "../models/student.model.js";
import Subject from "../models/subject.model.js";
import Attendance from "../models/attendance.model.js";

export const getStudents = async (req, res) => {
  try {
    const students = await Student.find({
      school: req.user.school_id,
    }).populate("student_class");
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi khi lấy danh sách học sinh" });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.param.id,
      school: req.user.school_id,
    }).select("-password");
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi lấy học sinh" });
  }
};

export const getStudentOwnData = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.user.id,
      school: req.user.school_id,
    })
      .select("-password")
      .populate("student_class");
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi lấy học sinh" });
  }
};

export const getStudentWithQuery = async (req, res) => {
  try {
    const filterQuery = { school: req.user.school_id };

    if (req.query.hasOwnProperty("search") && req.query.search) {
      filterQuery.name = { $regex: req.query.search, $options: "i" };
    }
    if (req.query.hasOwnProperty("student_class") && req.query.student_class) {
      const studentClasses = Array.isArray(req.query.student_class)
        ? req.query.student_class
        : [req.query.student_class];
      filterQuery.student_class = { $in: studentClasses };
    }

    const students = await Student.find(filterQuery)
      .select("-password")
      .populate("student_class");
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi khi lấy danh sách học sinh" });
  }
};

export const createStudent = async (req, res) => {
  try {
    const form = formidable({});
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: "Image could not be uploaded",
        });
      }

      const objstudent = await Student.findOne({ email: fields.email[0] });
      if (objstudent) {
        return res.status(400).json({
          success: false,
          message: "Thư điện tử đã được đăng ký rồi!",
        });
      }

      const photo = files.image[0];
      let filePath = photo.filepath;
      let fileName = photo.originalFilename.replace(/ /g, "_");
      let newFilePath = path.join(
        path.resolve(),
        process.env.STUDENT_IMAGE_PATH,
        fileName
      );

      console.log(path.resolve());
      console.log(newFilePath);

      let photoData = fs.readFileSync(filePath);
      fs.writeFileSync(newFilePath, photoData);

      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(fields.password[0], salt);

      let student = new Student({
        email: fields.email[0],
        name: fields.name[0],
        age: fields.age[0],
        gender: fields.gender[0],
        guardian: fields.guardian[0],
        guardian_phone: fields.guardian_phone[0],
        student_image: fileName,
        password: hashPassword,
        school: req.user.school_id,
        student_class: fields.student_class,
      });

      let newStudent = await student.save();
      res.status(200).json({
        success: true,
        message: "Học sinh đã được đăng ký thành công!",
        data: newStudent,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Đăng ký học sinh thất bại!",
    });
  }
};

export const loginStudent = async (req, res) => {
  try {
    const form = formidable({});
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
      const student = await Student.findOne({ email: fields.email[0] });
      if (!student) {
        return res.status(400).json({
          message: "Học sinh không tồn tại!",
        });
      }

      if (!bcrypt.compareSync(fields.password[0], student.password)) {
        return res.status(400).json({
          message: "Thư hoặc mât khẩu không chính xác!",
        });
      }

      const jwtSecret = process.env.SECRET_KEY;
      const token = jwt.sign(
        {
          id: student._id,
          school_id: student.school,
          role: "STUDENT",
          name: student.name,
        },
        jwtSecret,
        {
          expiresIn: "1d",
        }
      );

      res.header("Authorization", token);

      res.status(200).json({
        success: true,
        message: "Đăng nhập thành công!",
        user: {
          id: student._id,
          name: student.name,
          role: "STUDENT",
        },
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login student failed!",
    });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const form = formidable({});

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          message: "Image could not be uploaded",
        });
      }

      const student = await Student.findById(req.params.id);

      if (!student) {
        return res.status(400).json({
          message: "Học sinh không tồn tại!",
        });
      }

      Object.keys(fields).forEach((key) => {
        student[key] = fields[key][0];
      });

      if (files.image) {
        if (student.student_image) {
          let oldFilePath = path.join(
            path.resolve(),
            process.env.STUDENT_IMAGE_PATH,
            student.student_image
          );
          if (fs.existsSync(oldFilePath)) {
            fs.unlink(oldFilePath, (err) => {
              if (err) {
                return res.status(400).json({
                  error: "Image could not be deleted",
                });
              }
            });
          }
        }

        let filePath = files.image[0].filepath;
        let fileName = files.image[0].originalFilename.replace(/ /g, "_");

        let newFilePath = path.join(
          path.resolve(),
          process.env.STUDENT_IMAGE_PATH,
          fileName
        );

        let photoData = fs.readFileSync(filePath);
        fs.writeFileSync(newFilePath, photoData);
        student.student_image = fileName;
      }
      if (fields.password) {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(fields.password[0], salt);
        student.password = hashPassword;
      }

      await student.save();
      res.status(200).json({
        success: true,
        message: "Cập nhật học sinh thành công!",
        student,
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Cập nhật học sinh thất bại!",
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const studentAttendaceCunt = await Attendance.find({
      student: req.params.id,
      school: req.user.school_id,
    }).countDocuments();

    if (studentAttendaceCunt > 0) {
      return res.status(400).json({
        success: false,
        message: "Không thể xóa học sinh vì học sinh đã có điểm danh",
      });
    }

    await Student.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Học sinh được xóa thành công!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi xóa Học sinh!" });
  }
};
