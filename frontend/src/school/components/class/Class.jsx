import React, { useState } from "react";
import { useFormik } from "formik";

import { toast } from "sonner";

import classSchema from "../../../yupSchema/classSchema";
import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  CardContent,
  CardActions,
} from "@mui/material";
import { useEffect } from "react";
import axios from "axios";

import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import DialogConfirm from "../../../basic_utility_components/model_confirm/DialogConfirm";

const Class = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [classes, setClasses] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const initialValues = {
    class_text: "",
    class_num: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: classSchema,
    onSubmit: async (values) => {
      if (isEdit) {
        updateClass(values);
      } else {
        createClass(values);
      }
    },
  });

  const updateClass = async (values) => {
    try {
      const { data } = await axios.patch(
        `${backendUrl}/class/update/${editId}`,
        values
      );
      if (data.success) {
        toast.success(data.message);
        fetchClasses();
        setIsEdit(false);
        formik.resetForm();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const createClass = async (values) => {
    try {
      const { data } = await axios.post(`${backendUrl}/class/create`, values);
      if (data.success) {
        toast.success(data.message);
        fetchClasses();
        formik.resetForm();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleCancel = () => {
    setIsEdit(false);
    formik.resetForm();
  };

  const handleEdit = async (classItem) => {
    setIsEdit(true);
    formik.setValues({
      class_text: classItem.class_text,
      class_num: classItem.class_num,
    });
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/class/delete/${id}`);
      if (data.success) {
        toast.success(data.message);
        fetchClasses();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleClickOpen = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDeleteId(null);
  };

  const handleConfirmDelete = () => {
    handleDelete(deleteId);
    handleClose();
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

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <>
      <Typography variant="h4" align="center" marginTop={"20px"}>
        {isEdit ? "Cập nhật" : "Tạo lớp học"}
      </Typography>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "60vw" },
          display: "flex",
          flexDirection: "column",
          minWidth: "230px",
          alignItems: "center",
        }}
        noValidate
        autoComplete="off"
        onSubmit={formik.handleSubmit}
      >
        <TextField
          id="outlined-basic"
          name="class_text"
          label="Tên lớp"
          variant="outlined"
          value={formik.values.class_text}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.class_text && Boolean(formik.errors.class_text)}
          helperText={formik.touched.class_text && formik.errors.class_text}
        />
        
        <TextField
          id="outlined-basic"
          name="class_num"
          type="number"
          label="Số lớp"
          variant="outlined"
          value={formik.values.class_num}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.class_num && Boolean(formik.errors.class_num)}
          helperText={formik.touched.class_num && formik.errors.class_num}
        />

        <Button type="submit" variant="contained">
          {isEdit ? "Cập nhật" : "Tạo"}
        </Button>
        {isEdit && (
          <Button
            type="submit"
            variant="outlined"
            onClick={() => handleCancel()}
          >
            Hủy
          </Button>
        )}
      </Box>

      <Typography
        variant="h4"
        align="center"
        marginTop={"20px"}
        marginBottom={"20px"}
      >
        Danh sách lớp học
      </Typography>
      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(min(200px, 100%), 1fr))",
          gap: 2,
        }}
      >
        {classes &&
          classes.map((card, index) => (
            <Card variant="outlined" key={index}>
              <CardContent>
                <Typography variant="h5" component="div">
                  Lớp: {card.class_text} [ {card.class_num} ]
                </Typography>
                <Typography variant="body2">
                  <b>Giáo viên chủ nhiệm:</b>
                </Typography>
                <Typography variant="body2">
                  <i>{card?.attendee?.name}</i>
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center" }}>
                <Button size="small" variant="outlined" onClick={() => handleEdit(card)}>
                  <ModeEditOutlineIcon />
                </Button>
                <Button
                  size="small" variant="outlined"
                  onClick={() => handleClickOpen(card._id)}
                  sx={{ color: "tomato" }}
                >
                  <DeleteIcon />
                </Button>
              </CardActions>
            </Card>
          ))}
      </Box>
      {open && (
        <DialogConfirm open={open} handleClose={handleClose} handleConfirmDelete={handleConfirmDelete} whatDelete='lớp học' /> 
      )}
    </>
  );
};

export default Class;
