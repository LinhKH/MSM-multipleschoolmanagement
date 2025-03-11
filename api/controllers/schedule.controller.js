import Schedule from "../models/schedule.model.js";

export const getScheduleWithClass = async (req, res) => {
  try {
    const class_id = req.params.class_id;
    const schedules = await Schedule.find({
      class: class_id,
      school: req.user.school_id,
    })
      .populate("subject")
      .populate("teacher");
    res.status(200).json({ success: true, data: schedules });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi lấy lịch học" });
  }
};
export const getScheduleWithId = async (req, res) => {
  try {
    const id = req.params.id;
    const schedule = await Schedule.findById(id)
      .populate("subject")
      .populate("class")
      .populate("teacher");
    res.status(200).json({ success: true, data: schedule });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi lấy lịch học" });
  }
};
export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find({
      school: req.user.school_id,
    })
      .populate("subject")
      .populate("teacher");
    res.status(200).json({ success: true, data: schedules });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi lấy lịch học" });
  }
};

export const createSchedule = async (req, res) => {
  try {
    console.log(req.body);
    const newSchedule = new Schedule({
      school: req.user.school_id,
      class: req.body.classId,
      teacher: req.body.teacher,
      subject: req.body.subject,
      day: req.body.day,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
    });

    await newSchedule.save();

    res.status(201).json({
      success: true,
      message: "Lịch học được tạo thành công",
      data: newSchedule,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi khi tạo Lịch học" });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      {
        class: req.body.classId,
        teacher: req.body.teacher,
        subject: req.body.subject,
        day: req.body.day,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Lịch học được cập nhật thành công",
      data: updatedSchedule,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi khi cập nhật Lịch học" });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Lịch học được xóa thành công",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi xóa Lịch học" });
  }
};
