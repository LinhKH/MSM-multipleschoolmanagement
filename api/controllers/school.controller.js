import formidable from "formidable";
import School from "../models/school.model.js";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerSchool = (req, res) => {
  try {
    // let form = new formidable.IncomingForm();
    const form = formidable({});
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: "Image could not be uploaded",
        });
      }

      const shool = await School.findOne({ email: fields.email[0] });
      if (shool) {
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
        process.env.SCHOOL_IMAGE_PATH,
        fileName
      );

      console.log(path.resolve());
      console.log(newFilePath);

      let photoData = fs.readFileSync(filePath);
      fs.writeFileSync(newFilePath, photoData);

      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(fields.password[0], salt);

      let school = new School({
        school_name: fields.school_name[0],
        email: fields.email[0],
        owner_name: fields.owner_name[0],
        school_image: fileName,
        password: hashPassword,
      });

      let newSchool = await school.save();
      res.status(200).json({
        success: true,
        message: "Trường học đã được đăng ký thành công!",
        school: newSchool,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Đăng ký trường học thất bại!",
    });
  }
};

export const loginSchool = async (req, res) => {
  try {
    const form = formidable({});
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
      const school = await School.findOne({ email: fields.email[0] });
      if (!school) {
        return res.status(400).json({
          message: "Trường học không tồn tại!",
        });
      }

      if (!bcrypt.compareSync(fields.password[0], school.password)) {
        return res.status(400).json({
          message: "Thư hoặc mât khẩu không chính xác!",
        });
      }

      const jwtSecret = process.env.SECRET_KEY;
      const token = jwt.sign(
        {
          id: school._id,
          school_id: school._id,
          role: "SCHOOL",
          owner_name: school.owner_name,
          school_name: school.school_name,
          image_url: school.school_image,
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
          _id: school._id,
          owner_name: school.owner_name,
          school_name: school.school_name,
          image_url: school.school_image,
          role: "SCHOOL",
        },
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed!",
    });
  }
};

export const getAllSchools = async (req, res) => {
  try {
    const schools = await School.find();
    // .select(["-password", "-createdAt", "-updatedAt", "-_id", "-email", "-owner_name"]);
    res.status(200).json({
      success: true,
      message: "Get all schools successfully!",
      schools,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Get all schools failed!",
    });
  }
};

// getSchoolOwnData
export const getSchoolById = async (req, res) => {
  try {
    const school = await School.findById(req.user.id).select("-password");
    // .select(["-password", "-createdAt", "-updatedAt", "-_id", "-email", "-owner_name"]);
    res.status(200).json({
      success: true,
      message: "Get school by id successfully!",
      school,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Get school by id failed!",
    });
  }
};

export const updateSchoolById = async (req, res) => {
  try {
    // let form = new formidable.IncomingForm();
    const form = formidable({});

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          message: "Image could not be uploaded",
        });
      }

      const school = await School.findById(req.user.id);

      if (!school) {
        return res.status(400).json({
          message: "Trường học không tồn tại!",
        });
      }

      Object.keys(fields).forEach((key) => {
        school[key] = fields[key][0];
      });

      if (files.image) {
        if (school.school_image) {
          let oldFilePath = path.join(
            path.resolve(),
            process.env.SCHOOL_IMAGE_PATH,
            school.school_image
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
          process.env.SCHOOL_IMAGE_PATH,
          fileName
        );

        let photoData = fs.readFileSync(filePath);
        fs.writeFileSync(newFilePath, photoData);
        school.school_image = fileName;
      }
      await school.save();
      res.status(200).json({
        success: true,
        message: "Cập nhật trường học thành công!",
        school,
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Cập nhật trường học thất bại!",
    });
  }
};
