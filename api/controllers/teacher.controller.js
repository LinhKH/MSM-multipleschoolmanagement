import formidable from "formidable";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Student from "../models/student.model.js";
import Teacher from "../models/teacher.model.js";

export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({ school: req.user.school_id });
    res.status(200).json({ success: true, data: teachers });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi khi lấy danh sách giáo viên" });
  }
};

export const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({
      _id: req.param.id,
      school: req.user.school_id,
    }).select("-password");
    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi lấy giáo viên" });
  }
};

export const getTeacherOwnData = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({
      _id: req.user.id,
      school: req.user.school_id,
    }).select("-password");
    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi lấy giáo viên" });
  }
};

export const getTeacherWithQuery = async (req, res) => {
  try {
    const filterQuery = { school: req.user.school_id };

    if (req.query.hasOwnProperty("search")) {
      filterQuery.name = { $regex: req.query.search, $options: "i" };
    }
    if (req.query.hasOwnProperty("student_class")) {
      filterQuery.student_class = { $in: req.query.student_class };
    }

    const teachers = await Teacher.find(filterQuery).select("-password");
    res.status(200).json({ success: true, data: teachers });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi khi lấy danh sách giáo viên" });
  }
};

export const createTeacher = async (req, res) => {
  try {
    const form = formidable({});
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: "Image could not be uploaded",
        });
      }

      const objTeacher = await Teacher.findOne({ email: fields.email[0] });
      if (objTeacher) {
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
        process.env.TEACHER_IMAGE_PATH,
        fileName
      );

      console.log(path.resolve());
      console.log(newFilePath);

      let photoData = fs.readFileSync(filePath);
      fs.writeFileSync(newFilePath, photoData);

      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(fields.password[0], salt);

      let teacher = new Teacher({
        email: fields.email[0],
        name: fields.name[0],
        qualification: fields.qualification[0],
        age: fields.age[0],
        gender: fields.gender[0],
        teacher_image: fileName,
        password: hashPassword,
        school: req.user.school_id,
      });

      let newTeacher = await teacher.save();
      res.status(200).json({
        success: true,
        message: "Giáo viên đã được đăng ký thành công!",
        data: newTeacher,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Đăng ký giáo viên thất bại!",
    });
  }
};

export const loginTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ email: req.body.email });
    if (!teacher) {
      return res.status(400).json({
        message: "Giáo viên không tồn tại!",
      });
    }

    if (!bcrypt.compareSync(req.body.password, teacher.password)) {
      return res.status(400).json({
        message: "Thư hoặc mât khẩu không chính xác!",
      });
    }

    const jwtSecret = process.env.SECRET_KEY;
    const token = jwt.sign(
      {
        id: teacher._id,
        school_id: teacher.school,
        role: "TEACHER",
        name: teacher.name,
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
        id: teacher._id,
        school_id: req.user.school_id,
        name: teacher.name,
        role: "TEACHER",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "giáo viên đăng nhập thất bại!",
    });
  }
};

export const updateTeacher = async (req, res) => {
  try {
    const form = formidable({});

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          message: "Image could not be uploaded",
        });
      }

      const teacher = await Teacher.findById(req.params.id);

      if (!teacher) {
        return res.status(400).json({
          message: "giáo viên không tồn tại!",
        });
      }

      Object.keys(fields).forEach((key) => {
        teacher[key] = fields[key][0];
      });

      if (files.image) {
        if (teacher.teacher_image) {
          let oldFilePath = path.join(
            path.resolve(),
            process.env.TEACHER_IMAGE_PATH,
            teacher.teacher_image
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
          process.env.TEACHER_IMAGE_PATH,
          fileName
        );

        let photoData = fs.readFileSync(filePath);
        fs.writeFileSync(newFilePath, photoData);
        teacher.teacher_image = fileName;
      }
      if (fields.password) {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(fields.password[0], salt);
        teacher.password = hashPassword;
      }
      
      await teacher.save();
      res.status(200).json({
        success: true,
        message: "Cập nhật giáo viên thành công!",
        teacher,
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Cập nhật giáo viên thất bại!",
    });
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    
    await Teacher.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "giáo viên được xóa thành công!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi xóa giáo viên!" });
  }
};
