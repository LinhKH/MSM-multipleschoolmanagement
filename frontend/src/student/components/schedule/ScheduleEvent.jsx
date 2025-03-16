import React, { useState, useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import dayjs from "dayjs";

import Modal from "@mui/material/Modal";
import { useFormik } from "formik";
import periodSchema from "../../../yupSchema/periodSchema";

import moment from "moment-timezone";
import DialogConfirm from "../../../basic_utility_components/model_confirm/DialogConfirm";

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { toast } from "sonner";

const ScheduleEvent = ({
  open,
  handleClose,
  isEdit,
  setIsEdit,
  classId,
  setClassId,
  fetchScheduleByClass,
  eventId,
}) => {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const periods = [
    {
      id: 1,
      label: "Tiết 1 (7h sáng - 8h sáng)",
      startTime: "07:00",
      endTime: "08:00",
    },
    {
      id: 2,
      label: "Tiết 2 (8h sáng - 9h sáng)",
      startTime: "08:00",
      endTime: "09:00",
    },
    {
      id: 3,
      label: "Tiết 3 (9h sáng - 10h sáng)",
      startTime: "09:00",
      endTime: "10:00",
    },
    {
      id: 4,
      label: "Tiết 4 (10h sáng - 11h sáng)",
      startTime: "10:00",
      endTime: "11:00",
    },

    {
      id: 5,
      label: "Nghỉ trưa (11h sáng - 13h trưa)",
      startTime: "11:00",
      endTime: "13:00",
    },

    {
      id: 6,
      label: "Tiết 6 (1h chiều - 2h chiều)",
      startTime: "13:00",
      endTime: "14:00",
    },
    {
      id: 7,
      label: "Tiết 7 (2h chiều - 3h chiều)",
      startTime: "14:00",
      endTime: "15:00",
    },
    {
      id: 8,
      label: "Tiết 8 (3h chiều - 4h chiều)",
      startTime: "15:00",
      endTime: "16:00",
    },
    {
      id: 9,
      label: "Tiết 9 (4h chiều - 5h chiều)",
      startTime: "16:00",
      endTime: "17:00",
    },
  ];
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  const fetchTeachers = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/teacher/all`);
      if (data.success) {
        setTeachers(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/subject/all`);
      if (data.success) {
        setSubjects(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchScheduleById = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/schedule/single-fetch/${eventId}`
      );
      if (data.success) {
        formik.setValues({
          teacher: data.data.teacher._id,
          subject: data.data.subject._id,
          period: `${moment(data.data.startTime).format("HH:mm")},${moment(
            data.data.endTime
          ).format("HH:mm")}`,
          date: dayjs(data.data.day),
        });
        setClassId(data.data.class._id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const initialValues = {
    teacher: "",
    subject: "",
    period: "",
    date: null,
  };

  const formik = useFormik({
    initialValues,
    validationSchema: periodSchema,
    onSubmit: async (values) => {
      const date = values.date;
      const [startTime, endTime] = values.period.split(",");

      const startDateTime = moment.tz(
        `${date.format("YYYY-MM-DD")} ${startTime}`,
        "Asia/Ho_Chi_Minh"
      );
      const endDateTime = moment.tz(
        `${date.format("YYYY-MM-DD")} ${endTime}`,
        "Asia/Ho_Chi_Minh"
      );

      const params = {
        ...values,
        day: date.format("YYYY-MM-DD"),
        startTime: startDateTime.toDate(),
        endTime: endDateTime.toDate(),
        classId,
      };

      if (isEdit) {
        await updateSchedule(params);
      } else {
        await createSchedule(params);
      }
    },
  });

  const handleModalClose = () => {
    handleClose();
    setIsEdit(false);
    formik.resetForm();
  };
  const handleCloseConfirm = () => {
    setConfirm(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/schedule/delete/${eventId}`
      );
      if (data.success) {
        handleModalClose();
        setClassId("");
        toast.success(data.message);
        fetchScheduleByClass();
      }
    } catch (error) {
      console.log(error);
      toast.error("Xóa trường học thất bại!");
    }
  };

  const removeEvent = async () => {
    setConfirm(true);
  };

  const updateSchedule = async (params) => {
    try {
      const { data } = await axios.patch(
        `${backendUrl}/schedule/update/${eventId}`,
        params
      );
      if (data.success) {
        handleClose();
        formik.resetForm();
        setClassId("");
        toast.success(data.message);
        fetchScheduleByClass();
      }
    } catch (error) {
      console.log(error);
      toast.error("Cập nhật trường học thất bại!");
    }
  };

  const createSchedule = async (params) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/schedule/create`,
        params
      );
      if (data.success) {
        handleClose();
        formik.resetForm();
        setClassId("");
        toast.success(data.message);
        fetchScheduleByClass();
      }
    } catch (error) {
      console.log(error);
      toast.error("Đăng ký trường học thất bại!");
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (isEdit) {
      fetchScheduleById();
    }
  }, [isEdit]);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            GIAO TIẾT HỌC CHO GIÁO VIÊN
          </Typography>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column" }}
            onSubmit={formik.handleSubmit}
          >
            <FormControl
              sx={{ m: 1, minWidth: 120 }}
              error={formik.touched.teacher && Boolean(formik.errors.teacher)}
            >
              <InputLabel id="teacher-label">Giáo viên</InputLabel>
              <Select
                labelId="teacher-label"
                id="teacher"
                name="teacher"
                value={formik.values.teacher}
                label="Giáo viên"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <MenuItem value="">
                  <em>Vui lòng chọn</em>
                </MenuItem>
                {teachers.map((teacher) => (
                  <MenuItem key={teacher._id} value={teacher._id}>
                    {teacher.name}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.teacher && formik.errors.teacher ? (
                <FormHelperText>{formik.errors.teacher}</FormHelperText>
              ) : null}
            </FormControl>

            <FormControl
              sx={{ m: 1, minWidth: 120 }}
              error={formik.touched.subject && Boolean(formik.errors.subject)}
            >
              <InputLabel id="subject-label">Môn học</InputLabel>
              <Select
                labelId="subject-label"
                id="subject"
                name="subject"
                value={formik.values.subject}
                label="Môn học"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <MenuItem value="">
                  <em>Vui lòng chọn</em>
                </MenuItem>
                {subjects.map((subject) => (
                  <MenuItem key={subject._id} value={subject._id}>
                    {subject.subject_name}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.subject && formik.errors.subject ? (
                <FormHelperText>{formik.errors.subject}</FormHelperText>
              ) : null}
            </FormControl>

            <FormControl
              sx={{ m: 1, minWidth: 120 }}
              error={formik.touched.period && Boolean(formik.errors.period)}
            >
              <InputLabel id="period-label">Tiết học</InputLabel>
              <Select
                labelId="period-label"
                id="period"
                name="period"
                value={formik.values.period}
                label="Tiết học"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <MenuItem value="">
                  <em>Vui lòng chọn</em>
                </MenuItem>
                {periods.map((period) => (
                  <MenuItem
                    key={period.id}
                    value={`${period.startTime},${period.endTime}`}
                  >
                    {period.label}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.period && formik.errors.period ? (
                <FormHelperText>{formik.errors.period}</FormHelperText>
              ) : null}
            </FormControl>

            <FormControl
              sx={{ m: 1, width: 220 }}
              error={formik.touched.date && Boolean(formik.errors.date)}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Ngày"
                  value={formik.values.date}
                  onChange={(value) => formik.setFieldValue("date", value)}
                  slotProps={{ textField: { variant: "outlined" } }}
                />
              </LocalizationProvider>
              {formik.touched.date && formik.errors.date ? (
                <FormHelperText>{formik.errors.date}</FormHelperText>
              ) : null}
            </FormControl>

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                {isEdit ? "Cập nhật" : "Tạo"}
              </Button>
              {isEdit && (
                <Button
                  onClick={removeEvent}
                  variant="contained"
                  sx={{ mt: 2, backgroundColor: "tomato", color: "white" }}
                >
                  {"Xóa"}
                </Button>
              )}
              <Button
                onClick={handleModalClose}
                variant="outlined"
                sx={{ mt: 2 }}
              >
                {"Hủy"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {confirm && (
        <DialogConfirm
          open={confirm}
          handleClose={handleCloseConfirm}
          handleConfirmDelete={handleConfirmDelete}
          whatDelete="Lịch học"
        />
      )}
    </div>
  );
};

export default ScheduleEvent;
