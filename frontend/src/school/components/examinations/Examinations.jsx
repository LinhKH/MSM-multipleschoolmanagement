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
import axios from "axios";
import { useEffect, useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useFormik } from "formik";
import examinationSchema from "../../../yupSchema/examinationSchema";
import { toast } from "sonner";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DialogConfirm from "../../../basic_utility_components/model_confirm/DialogConfirm";
import dayjs from "dayjs";

const Examinations = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [classes, setClasses] = useState([]);
  const [params, setParams] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [examinations, setExaminations] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [examinationId, setExaminationId] = useState(null);

  const handleSearch = (e) => {
    setParams({ ...params, [e.target.name]: e.target.value });
  };

  const initialValues = {
    class_exam: "",
    subject: "",
    examDate: null,
    examType: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: examinationSchema,
    onSubmit: async (values) => {
      console.log(values);
      if (isEdit) {
        updateExamination(values);
      } else {
        createExamination(values);
      }
    },
  });

  const updateExamination = async (params) => {
    try {
      const { data } = await axios.patch(
        `${backendUrl}/examination/update/${examinationId}`,
        params
      );
      if (data.success) {
        toast.success(data.message);
        fetchExaminations();
        setIsEdit(false);
        formik.resetForm();
      }
    } catch (error) {
      console.log(error);
      toast.error("Cập nhật trường học thất bại!");
    }
  };

  const createExamination = async (params) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/examination/create`,
        params
      );
      if (data.success) {
        toast.success(data.message);
        fetchExaminations();
        formik.resetForm();
      }
    } catch (error) {
      console.log(error);
      toast.error("Đăng ký trường học thất bại!");
    }
  };

  const fetchClasses = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/class/all`);
      if (data.success) {
        setClasses(data.data);
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

  const fetchExaminations = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/examination/all`);
      if (data.success) {
        setExaminations(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [confirm, setConfirm] = useState(false);
  const editExamination = (id) => {
    setExaminationId(id);
    setIsEdit(true);
    const examination = examinations.find((item) => item._id === id);
    formik.setValues({
      class_exam: examination.class?._id,
      subject: examination.subject?._id,
      examDate: dayjs(examination.examDate),
      examType: examination.examType,
    });
  };
  const deleteExamination = (id) => {
    setExaminationId(id);
    setConfirm(true);
  };
  const handleModalClose = () => {
    setIsEdit(false);
    formik.resetForm();
  };
  const handleCloseConfirm = () => {
    setConfirm(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/examination/delete/${examinationId}`
      );
      if (data.success) {
        handleCloseConfirm();
        toast.success(data.message);
        fetchExaminations();
      }
    } catch (error) {
      console.log(error);
      toast.error("Xóa bài kiểm tra thất bại!");
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchSubjects();
  }, []);

  useEffect(() => {
    const fetchExaminationsByClass = async () => {
      try {
        if (params?.search) {
          const { data } = await axios.get(
            `${backendUrl}/examination/class/${params?.search}`
          );
          if (data.success) {
            setExaminations(data.data);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (params?.search) {
      fetchExaminationsByClass();
    } else {
      fetchExaminations();
    }
  }, [params]);
  return (
    <>
      <Typography variant="h4" sx={{ textAlign: "center" }}>
        Bài kiểm tra
      </Typography>
      <Box
        sx={{
          width: "100%",
          height: "auto",
          borderRadius: 1,
          border: 1,
          // bgcolor: "gray",
          p: 2,
        }}
      >
        <Typography variant="body1" sx={{ marginBottom: "10px" }}>
          Tìm kiếm bài kiểm tra
        </Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="demo-simple-select-helper-label">Lớp</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="search"
            name="search"
            value={params.search || ""}
            label="Lớp học"
            onChange={handleSearch}
          >
            <MenuItem value="">
              <em>Vui lòng chọn</em>
            </MenuItem>
            {classes &&
              classes.map((classItem, index) => (
                <MenuItem key={index} value={classItem._id}>
                  {classItem.class_text}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "auto",
          borderRadius: 1,
          border: 1,
          p: 2,
          mt: 2,
        }}
      >
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          Tạo bài kiểm tra
        </Typography>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <FormControl
            sx={{ minWidth: 120 }}
            error={
              formik.touched.class_exam && Boolean(formik.errors.class_exam)
            }
          >
            <InputLabel id="demo-simple-select-helper-label">Lớp</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="class_exam"
              name="class_exam"
              value={formik.values.class_exam}
              label="Lớp học"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <MenuItem value="">
                <em>Vui lòng chọn</em>
              </MenuItem>
              {classes &&
                classes.map((classItem, index) => (
                  <MenuItem key={index} value={classItem._id}>
                    {classItem.class_text}
                  </MenuItem>
                ))}
            </Select>
            {formik.touched.class_exam && formik.errors.class_exam ? (
              <FormHelperText>{formik.errors.class_exam}</FormHelperText>
            ) : null}
          </FormControl>
          <FormControl
            sx={{ m: 1, width: 220 }}
            error={formik.touched.examDate && Boolean(formik.errors.examDate)}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Ngày"
                value={formik.values.examDate || null}
                onChange={(value) => formik.setFieldValue("examDate", value)}
                slotProps={{ textField: { variant: "outlined" } }}
              />
            </LocalizationProvider>
            {formik.touched.examDate && formik.errors.examDate ? (
              <FormHelperText>{formik.errors.examDate}</FormHelperText>
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
            sx={{ m: 1, minWidth: 220 }}
            error={formik.touched.examType && Boolean(formik.errors.examType)}
          >
            <InputLabel id="subject-label">Loại kiểm tra</InputLabel>
            <Select
              labelId="subject-label"
              id="examType"
              name="examType"
              value={formik.values.examType}
              label="Môn học"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <MenuItem value="">
                <em>Vui lòng chọn</em>
              </MenuItem>

              <MenuItem value={"15p"}>15 phút</MenuItem>
              <MenuItem value={"1t"}>1 tiết</MenuItem>
              <MenuItem value={"gk"}>Giữa kỳ</MenuItem>
              <MenuItem value={"ck"}>Cuối kỳ</MenuItem>
            </Select>
            {formik.touched.examType && formik.errors.examType ? (
              <FormHelperText>{formik.errors.examType}</FormHelperText>
            ) : null}
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ m: 1 }}
          >
            {isEdit ? "Cập nhật" : "Tạo"}
          </Button>
          <Button onClick={handleModalClose} variant="outlined" sx={{ m: 1 }}>
            {"Hủy"}
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "auto",
          borderRadius: 1,
          border: 1,
          p: 2,
          mt: 2,
        }}
      >
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          Danh sách bài kiểm tra
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Ngày</TableCell>
                <TableCell align="right">Lớp học</TableCell>
                <TableCell align="right">Môn học</TableCell>
                <TableCell align="right">Loại</TableCell>
                <TableCell align="right">Chức năng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {examinations.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {dayjs(row.examDate).format("MM/DD/YYYY")}
                  </TableCell>
                  <TableCell align="right">
                    {row.class?.class_text} - {row.class?.class_num}
                  </TableCell>
                  <TableCell align="right">
                    {row.subject?.subject_name}
                  </TableCell>
                  <TableCell align="right">{row.examType}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="text"
                      onClick={() => editExamination(row._id)}
                      color="primary"
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      variant="text"
                      onClick={() => deleteExamination(row._id)}
                      color="warning"
                    >
                      <DeleteIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {confirm && (
        <DialogConfirm
          open={confirm}
          handleClose={handleCloseConfirm}
          handleConfirmDelete={handleConfirmDelete}
          whatDelete="bài kiểm tra"
        />
      )}
    </>
  );
};

export default Examinations;
