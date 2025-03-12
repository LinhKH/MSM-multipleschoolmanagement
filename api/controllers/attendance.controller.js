import Attendance from "../models/attendance.model.js";
import moment from "moment";

export const markAttendance = async (req, res) => {
  try {
    const { student: studentId, class: classId, date, status } = req.body;
    const schoolId = req.user.school_id;

    const attendance = new Attendance({
      school: schoolId,
      student: studentId,
      class: classId,
      date,
      status,
    });

    const newAttendance = await attendance.save();
    res.status(201).json({
      success: true,
      message: "Điểm danh đã được tạo thành công",
      data: newAttendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Điểm danh không thể tạo",
      error: error.message,
    });
  }
};

export const getAttendanceByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const schoolId = req.user.school_id;

    const attendances = await Attendance.find({
      school: schoolId,
      student: studentId,
    })
      .populate("student")
      .populate("class");
    res.status(200).json({
      success: true,
      message: "Get all attendances successfully!",
      data: attendances,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Get all attendances failed!",
      error: error.message,
    });
  }
};

export const checkAttendance = async (req, res) => {
  try {
    const { classId } = req.params;
    const schoolId = req.user.school_id;
    const today = moment().startOf("day");

    const attendanceForToday = await Attendance.findOne({
      school: schoolId,
      class: classId,
      date: {
        // 00:00:00 to 23:59:59
        $gte: today.toDate(),
        $lte: moment(today).endOf("day").toDate(),
      },
    });

    if (attendanceForToday) {
      return res.status(200).json({
        attendanceTaken: true,
        message: "Attendance for today already taken!",
        data: attendanceForToday,
      });
    } else {
      return res.status(200).json({
        attendanceTaken: false,
        message: "Attendance for today not taken yet!",
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Get attendance failed!",
      error: error.message,
    });
  }
};
