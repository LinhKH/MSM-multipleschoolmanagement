import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import axios from "axios";
import React, { useEffect, useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { useFormik } from "formik";
import noticeSchema from "../../../yupSchema/noticeSchema";
import { toast } from "sonner";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DialogConfirm from "../../../basic_utility_components/model_confirm/DialogConfirm";

const Notice = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [notices, setNotices] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [noticeId, setNoticeId] = useState(null);

  const initialValues = {
    title: "",
    message: "",
    audience: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: noticeSchema,
    onSubmit: async (values) => {
      if (isEdit) {
        updateNotice(values);
      } else {
        createNotice(values);
      }
    },
  });

  const updateNotice = async (params) => {
    try {
      const { data } = await axios.patch(
        `${backendUrl}/notice/update/${noticeId}`,
        params
      );
      if (data.success) {
        toast.success(data.message);
        fetchNotices();
        setIsEdit(false);
        formik.resetForm();
      }
    } catch (error) {
      console.log(error);
      toast.error("Cập nhật thông báo thất bại!");
    }
  };

  const createNotice = async (params) => {
    try {
      const { data } = await axios.post(`${backendUrl}/notice/create`, params);
      if (data.success) {
        toast.success(data.message);
        fetchNotices();
        formik.resetForm();
      }
    } catch (error) {
      console.log(error);
      toast.error("Đăng ký thông báo thất bại!");
    }
  };

  const fetchNotices = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/notice/all`);
      if (data.success) {
        setNotices(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [confirm, setConfirm] = useState(false);
  const editNotice = (id) => {
    setNoticeId(id);
    setIsEdit(true);
    const notice = notices.find((item) => item._id === id);
    formik.setValues({
      title: notice.title,
      message: notice.message,
      audience: notice.audience,
    });
  };
  const deleteNotice = (id) => {
    setNoticeId(id);
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
        `${backendUrl}/notice/delete/${noticeId}`
      );
      if (data.success) {
        handleCloseConfirm();
        toast.success(data.message);
        fetchNotices();
      }
    } catch (error) {
      console.log(error);
      toast.error("Xóa thông báo thất bại!");
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <>
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
          Tạo thông báo
        </Typography>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            mt: 2,
            gap: 2,
          }}
        >
          <TextField
            id="outlined-basic"
            name="title"
            label="Tiêu đề"
            variant="outlined"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
          <TextField
            id="outlined-multiline-static"
            label="Nội dung"
            name="message"
            multiline
            rows={4}
            value={formik.values.message}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.message && Boolean(formik.errors.message)}
            helperText={formik.touched.message && formik.errors.message}
          />
          <FormControl
            sx={{ minWidth: 120 }}
            error={formik.touched.audience && Boolean(formik.errors.audience)}
          >
            <InputLabel id="audience-label">Thông báo đến</InputLabel>
            <Select
              labelId="audience-label"
              id="audience"
              name="audience"
              value={formik.values.audience}
              label="Người xem"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <MenuItem value="">
                <em>Vui lòng chọn</em>
              </MenuItem>
              <MenuItem value={"student"}>Học sinh</MenuItem>
              <MenuItem value={"teacher"}>Giáo viên</MenuItem>
            </Select>
            {formik.touched.audience && formik.errors.audience ? (
              <FormHelperText>{formik.errors.audience}</FormHelperText>
            ) : null}
          </FormControl>

          <Box>
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
          Danh sách thông báo
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Tiêu đề</TableCell>
                <TableCell align="right">Nội dung</TableCell>
                <TableCell align="right">Thông báo đến</TableCell>
                <TableCell align="right">Chức năng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notices.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.title}
                  </TableCell>
                  <TableCell align="right">{row.message}</TableCell>
                  <TableCell align="right">{row.audience}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="text"
                      onClick={() => editNotice(row._id)}
                      color="primary"
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      variant="text"
                      onClick={() => deleteNotice(row._id)}
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
          whatDelete="thông báo"
        />
      )}
    </>
  );
};

export default Notice;
