import Class from "../models/class.model.js";
import Examination from "../models/examination.model.js";
import Student from "../models/student.model.js";
import Subject from "../models/subject.model.js";
import Schedule from "../models/schedule.model.js";

export const getClasses = async (req, res) => {
  try {
    const classes = await Class.find({ school: req.user.school_id });
    res.status(200).json({ success: true, data: classes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi lấy lớp học" });
  }
};

export const createClass = async (req, res) => {
  try {
    const { class_text, class_num, attendee } = req.body;
    const newClass = new Class({
      class_text,
      class_num,
      attendee,
      school: req.user.school_id,
    });
    await newClass.save();
    res.status(201).json({
      success: true,
      message: "Lớp học được tạo thành công",
      data: newClass,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi tạo lớp học" });
  }
};

export const updateClass = async (req, res) => {
  try {
    const { class_text, class_num, attendee } = req.body;
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      { class_text, class_num, attendee },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Lớp học được cập nhật thành công",
      data: updatedClass,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi khi cập nhật lớp học" });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const classStudentCount = await Student.find({
      student_class: req.params.id,
      school: req.user.school_id,
    }).countDocuments();

    const classExaminationCount = await Examination.find({
      class: req.params.id,
      school: req.user.school_id,
    }).countDocuments();

    const classScheduleCount = await Schedule.find({
      class: req.params.id,
      school: req.user.school_id,
    }).countDocuments();

    if (
      classStudentCount > 0 ||
      classExaminationCount > 0 ||
      classScheduleCount > 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Không thể xóa lớp học vì lớp học đã có học sinh hoặc lịch thi hoặc thời khóa biểu",
      });
    }

    await Class.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Lớp học được xóa thành công",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi xóa lớp học" });
  }
};
