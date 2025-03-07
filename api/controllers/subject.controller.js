import Class from "../models/class.model.js";
import Examination from "../models/examination.model.js";
import Schedule from "../models/schedule.model.js";
import Subject from "../models/subject.model.js";

export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ school: req.user.school_id });
    res.status(200).json({ success: true, data: subjects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi lấy Môn học" });
  }
};

export const createSubject = async (req, res) => {
  try {
    const { subject_name, subject_code } = req.body;
    const newSubject = new Subject({
      subject_name,
      subject_code,
      school: req.user.school_id,
    });
    await newSubject.save();
    res.status(201).json({
      success: true,
      message: "Môn học được tạo thành công",
      data: newSubject,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi tạo môn học" });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const { subject_name, subject_code } = req.body;
    const updatedSubject = await Class.findByIdAndUpdate(
      req.params.id,
      { subject_name, subject_code },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Môn học được cập nhật thành công",
      data: updatedSubject,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi khi cập nhật Môn học" });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const subjectExaminationCount = await Examination.find({
      subject: req.params.id,
      school: req.user.school_id,
    }).countDocuments();

    const ScheduleScheduleCount = await Schedule.find({
      subject: req.params.id,
      school: req.user.school_id,
    }).countDocuments();

    if (subjectExaminationCount > 0 || ScheduleScheduleCount > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Không thể xóa môn học vì đã có lịch thi hoặc lịch học liên quan",
      });
    }

    await Subject.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Môn học được xóa thành công",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi xóa Môn học" });
  }
};
