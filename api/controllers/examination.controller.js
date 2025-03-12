import Examination from "../models/examination.model.js";
import moment from "moment";

export const newExamination = async (req, res) => {
  try {
    const { class_exam, subject: subjectId, examDate, examType } = req.body;
    const schoolId = req.user.school_id;

    const examination = new Examination({
      school: schoolId,
      class: class_exam,
      subject: subjectId,
      examDate,
      examType,
    });

    const newAttendance = await examination.save();
    res.status(201).json({
      success: true,
      message: "Bài kiểm tra đã được tạo thành công",
      data: newAttendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Bài kiểm tra không thể tạo",
      error: error.message,
    });
  }
};

export const getAllExaminations = async (req, res) => {
  try {
    const schoolId = req.user.school_id;

    const examinations = await Examination.find({
      school: schoolId,
    })
      .populate("class")
      .populate("subject");
    res.status(200).json({
      success: true,
      message: "Get all examinations successfully!",
      data: examinations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Get all examinations failed!",
      error: error.message,
    });
  }
};

export const getExaminationByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const schoolId = req.user.school_id;
    
    const examinations = await Examination.find({
      school: schoolId,
      class: classId,
    })
      .populate("class")
      .populate("subject");
    res.status(200).json({
      success: true,
      message: "Get all examinations successfully!",
      data: examinations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Get all examinations failed!",
      error: error.message,
    });
  }
};

export const updateExamination = async (req, res) => {
  try {
    const { examinationId } = req.params;
    const { class_exam, subject: subjectId, examDate, examType } = req.body;
    const schoolId = req.user.school_id;

    const examination = await Examination.findByIdAndUpdate(
      examinationId,
      {
        school: schoolId,
        class: class_exam,
        subject: subjectId,
        examDate,
        examType,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Bài kiểm tra đã được cập nhật thành công",
      data: examination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Bài kiểm tra không thể cập nhật",
      error: error.message,
    });
  }
};

export const deleteExamination = async (req, res) => {
  try {
    const { examinationId } = req.params;

    await Examination.findByIdAndDelete(examinationId);
    res.status(200).json({
      success: true,
      message: "Bài kiểm tra đã được xóa thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Bài kiểm tra không thể xóa",
      error: error.message,
    });
  }
};
