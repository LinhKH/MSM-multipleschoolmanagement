import Notice from "../models/notice.model.js";
import moment from "moment";

export const newNotice = async (req, res) => {
  try {
    const { title, message, audience } = req.body;
    const schoolId = req.user.school_id;

    const notice = new Notice({
      school: schoolId,
      title,
      message,
      audience,
    });

    const newNotice = await notice.save();
    res.status(201).json({
      success: true,
      message: "Thông báo đã được tạo thành công",
      data: newNotice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Bài kiểm tra không thể tạo",
      error: error.message,
    });
  }
};

export const getAllNotices = async (req, res) => {
  try {
    const schoolId = req.user.school_id;

    const notices = await Notice.find({
      school: schoolId,
    });
    res.status(200).json({
      success: true,
      message: "Get all notices successfully!",
      data: notices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Get all notices failed!",
      error: error.message,
    });
  }
};

export const getNoticenByAudience = async (req, res) => {
  try {
    const schoolId = req.user.school_id;

    console.log(req.body);
    const { audience } = req.body;

    const notice = await Notice.find({
      school: schoolId,
      audience: audience,
    });
    res.status(200).json({
      success: true,
      message: "Get all notice successfully!",
      data: notice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Get all notice failed!",
      error: error.message,
    });
  }
};

export const updateNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;
    const { title, message, audience } = req.body;
    const schoolId = req.user.school_id;

    const notice = await Notice.findByIdAndUpdate(
      noticeId,
      {
        title,
        message,
        audience,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Thông báo đã được cập nhật thành công",
      data: notice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Thông báo không thể cập nhật",
      error: error.message,
    });
  }
};

export const deleteNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;

    await Notice.findByIdAndDelete(noticeId);
    res.status(200).json({
      success: true,
      message: "Thông báo đã được xóa thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Thông báo không thể xóa",
      error: error.message,
    });
  }
};
