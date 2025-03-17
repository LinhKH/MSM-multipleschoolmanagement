import { useState, useEffect } from "react";
import { useFormik } from "formik";

import { toast } from "sonner";

import subjectSchema from "../../../yupSchema/subjectSchema";
import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  CardContent,
  CardActions,
} from "@mui/material";
import axios from "axios";

import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import DialogConfirm from "../../../basic_utility_components/model_confirm/DialogConfirm";

const Subjects = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [subjects, setSubjects] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);

  const initialValues = {
    subject_name: "",
    subject_code: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: subjectSchema,
    onSubmit: async (values) => {
      if (isEdit) {
        updateSubject(values);
      } else {
        createSubject(values);
      }
    },
  });

  const updateSubject = async (values) => {
    try {
      const { data } = await axios.patch(
        `${backendUrl}/subject/update/${editId}`,
        values
      );
      if (data.success) {
        toast.success(data.message);
        fetchSubjects();
        setIsEdit(false);
        formik.resetForm();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const createSubject = async (values) => {
    try {
      const { data } = await axios.post(`${backendUrl}/subject/create`, values);
      if (data.success) {
        toast.success(data.message);
        fetchSubjects();
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
    setEditId(classItem._id);
    formik.setValues({
      subject_name: classItem.subject_name,
      subject_code: classItem.subject_code,
    });
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/subject/delete/${id}`);
      if (data.success) {
        toast.success(data.message);
        fetchSubjects();
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

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <>
      <Typography variant="h4" align="center" marginTop={"20px"}>
        {isEdit ? "Cập nhật" : "Tạo Môn học"}
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
          name="subject_name"
          label="Tên Môn học"
          variant="outlined"
          value={formik.values.subject_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.subject_name && Boolean(formik.errors.subject_name)}
          helperText={formik.touched.subject_name && formik.errors.subject_name}
        />
        
        <TextField
          id="outlined-basic"
          name="subject_code"
          type="text"
          label="Mã môn học"
          variant="outlined"
          value={formik.values.subject_code}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.subject_code && Boolean(formik.errors.subject_code)}
          helperText={formik.touched.subject_code && formik.errors.subject_code}
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
        Danh sách Môn học
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
        {subjects &&
          subjects.map((card, index) => (
            <Card variant="outlined" key={index} sx={{ textAlign: "center" }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  Môn: {card.subject_name}
                </Typography>
                <Typography variant="h6">
                  Mã: {card?.subject_code}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center" }}>
                <Button size="small" onClick={() => handleEdit(card)}>
                  <ModeEditOutlineIcon />
                </Button>
                <Button
                  size="small"
                  onClick={() => handleClickOpen(card._id)}
                  sx={{ color: "red" }}
                >
                  <DeleteIcon />
                </Button>
              </CardActions>
            </Card>
          ))}
      </Box>
      {open && (
        <DialogConfirm open={open} handleClose={handleClose} handleConfirmDelete={handleConfirmDelete} whatDelete='môn học' /> 
      )}
    </>
  );
};

export default Subjects;
