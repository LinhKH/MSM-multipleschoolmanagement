import React, { useRef, useState } from "react";
import { useFormik } from "formik";
import { toast } from "sonner";

import teacherSchema from "../../../yupSchema/teacherSchema";
import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  CardContent,
  CardActions,
  CardMedia,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useEffect } from "react";
import axios from "axios";

import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import DialogConfirm from "../../../basic_utility_components/model_confirm/DialogConfirm";

const Teachers = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const imageUrlTeacher = import.meta.env.VITE_TEACHER_IMAGE_PATH;
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [classes, setClasses] = useState([]);

  const initialValues = {
    email: "",
    name: "",
    qualification: "",
    age: "",
    gender: "",
    password: "",
    confirm_password: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: teacherSchema(isEdit),
    onSubmit: async (values) => {
      if (isEdit) {
        await updateTeacher(values);
      } else {
        await createTeacher(values);
      }
    },
  });

  const updateTeacher = async (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });
    if (file) {
      formData.append("image", file);
    }
    if (values.password === "") {
      formData.delete("password");
    }
    try {
      const { data } = await axios.patch(
        `${backendUrl}/teacher/update/${editId}`,
        formData
      );

      formik.resetForm();
      handleClearFile();
      fetchTeachers();
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const createTeacher = async (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });
    if (file) {
      formData.append("image", file);
      try {
        const { data } = await axios.post(
          `${backendUrl}/teacher/create`,
          formData
        );

        formik.resetForm();
        handleClearFile();
        fetchTeachers();
        toast.success(data.message);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    } else {
      toast.error("Vui lòng chọn ảnh");
    }
  };

  const handleCancel = () => {
    setIsEdit(false);
    formik.resetForm();
  };

  const handleEdit = async (teacher) => {
    setIsEdit(true);
    setEditId(teacher._id);
    formik.setValues({
      email: teacher.email,
      name: teacher.name,
      qualification: teacher.qualification,
      age: teacher.age,
      gender: teacher.gender,
    });
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/teacher/delete/${id}`);
      if (data.success) {
        toast.success(data.message);
        fetchTeachers();
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

  const addImage = (e) => {
    const image = e.target.files[0];
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (
      image &&
      validImageTypes.includes(image.type) &&
      image.size <= maxSize
    ) {
      setFile(image);
      setImageUrl(URL.createObjectURL(image));
    } else {
      toast.error(
        "Vui lòng chọn ảnh có định dạng jpeg, png hoặc gif và kích thước không quá 2MB."
      );
      handleClearFile();
    }
  };

  const handleImageBlur = (e) => {
    const image = e.target.files[0];
    if (!image) {
      toast.error("Vui lòng chọn hình ảnh.");
    }
  };

  const fileInputRef = useRef(null);
  const handleClearFile = () => {
    setFile(null);
    setImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // const fetchClasses = async () => {
  //   try {
  //     const { data } = await axios.get(`${backendUrl}/class/all`);
  //     if (data.success) {
  //       setClasses(data.data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleSearch = (e) => {
    const search = e.target.value;
    if (search) {
      const filteredTeachers = teachers.filter((teacher) =>
        teacher.name.toLowerCase().includes(search.toLowerCase())
      );
      setTeachers(filteredTeachers);
    } else {
      fetchTeachers();
    }
  };

  // const [params, setParams] = useState({});
  // const handleClass = async (e) => {
  //   const classId = e.target.value;
  //   setParams({ ...params, class: classId });

  //   if (classId) {
  //     try {
  //       const { data } = await axios.get(
  //         `${backendUrl}/student/search?student_class=${classId}`
  //       );
  //       if (data.success) {
  //         setTeachers(data.data);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   } else {
  //     fetchTeachers();
  //   }
  // };

  useEffect(() => {
    fetchTeachers();
    // fetchClasses();
  }, []);

  return (
    <>
      <Typography variant="h4" align="center" marginTop={"20px"}>
        {isEdit ? "Cập nhật" : "Tạo Giáo viên"}
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
          type="file"
          onChange={(e) => addImage(e)}
          onTouchStart={(e) => handleImageBlur(e)}
          id="outlined-basic"
          name="image"
          inputRef={fileInputRef}
        />
        {imageUrl ? (
          <Box>
            <CardMedia component={"img"} height={"240px"} image={imageUrl} />
          </Box>
        ) : null}

        {/* <FormControl
          sx={{ m: 1, minWidth: 120 }}
          error={formik.touched.student_class && formik.errors.student_class}
        >
          <InputLabel id="demo-simple-select-helper-label">Lớp học</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="student_class"
            name="student_class"
            value={formik.values.student_class || ""}
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
          {formik.touched.student_class && formik.errors.student_class ? (
            <FormHelperText>{formik.errors.student_class}</FormHelperText>
          ) : null}
        </FormControl> */}

        <TextField
          id="outlined-basic"
          name="email"
          label="Thư điện tử"
          variant="outlined"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        <TextField
          id="outlined-basic"
          name="name"
          type="text"
          label="Tên Giáo viên"
          variant="outlined"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />

        <TextField
          id="outlined-basic"
          name="qualification"
          type="text"
          label="Trình độ chuyên môn"
          variant="outlined"
          value={formik.values.qualification}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.qualification && Boolean(formik.errors.qualification)}
          helperText={formik.touched.qualification && formik.errors.qualification}
        />

        <TextField
          id="outlined-basic"
          name="age"
          type="number"
          label="Tuổi"
          variant="outlined"
          value={formik.values.age}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.age && Boolean(formik.errors.age)}
          helperText={formik.touched.age && formik.errors.age}
        />

        <FormControl
          sx={{ m: 1, minWidth: 120 }}
          error={formik.touched.gender && formik.errors.gender}
        >
          <InputLabel id="demo-simple-select-helper-label">
            Giới tính
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="gender"
            name="gender"
            value={formik.values.gender}
            label="Giới tính"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <MenuItem value="">
              <em>Vui lòng chọn</em>
            </MenuItem>
            <MenuItem value="male">Nam</MenuItem>
            <MenuItem value="female">Nữ</MenuItem>
          </Select>
          {formik.touched.gender && formik.errors.gender ? (
            <FormHelperText>{formik.errors.gender}</FormHelperText>
          ) : null}
        </FormControl>

        <TextField
          id="outlined-basic"
          name="password"
          type="password"
          label="Mât khẩu"
          variant="outlined"
          value={formik.values.password ?? ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            !isEdit &&
            formik.touched.password &&
            Boolean(formik.errors.password)
          }
          helperText={
            !isEdit && formik.touched.password && formik.errors.password
          }
        />

        <TextField
          id="outlined-basic"
          name="confirm_password"
          type="password"
          label="Xác nhận mật khẩu"
          variant="outlined"
          value={formik.values.confirm_password ?? ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            !isEdit &&
            formik.touched.confirm_password &&
            Boolean(formik.errors.confirm_password)
          }
          helperText={
            !isEdit &&
            formik.touched.confirm_password &&
            formik.errors.confirm_password
          }
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

      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <TextField
          id="outlined-basic"
          name="search"
          label="Tìm kiếm"
          variant="outlined"
          onChange={handleSearch}
        />
      </Box>

      <Typography
        variant="h4"
        align="center"
        marginTop={"20px"}
        marginBottom={"20px"}
      >
        Danh sách Giáo viên
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
        {teachers &&
          teachers.map((teacher, index) => (
            <Card sx={{ maxWidth: 345 }} key={index}>
              <CardMedia
                sx={{ height: 140 }}
                image={`${imageUrlTeacher}${teacher.teacher_image}`}
                title="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {teacher.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  <span style={{ fontWeight: "bold" }}>Email:</span>{" "}
                  {teacher.email}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  <span style={{ fontWeight: "bold" }}>Giới tính:</span>{" "}
                  {teacher.gender == "male" ? "Nam" : "Nữ"}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  <span style={{ fontWeight: "bold" }}>Trình độ:</span>{" "}
                  {teacher.qualification}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center" }}>
                <Button size="small" onClick={() => handleEdit(teacher)}>
                  <ModeEditOutlineIcon />
                </Button>
                <Button
                  size="small"
                  onClick={() => handleClickOpen(teacher._id)}
                  sx={{ color: "red" }}
                >
                  <DeleteIcon />
                </Button>
              </CardActions>
            </Card>
          ))}
      </Box>

      {open && (
        <DialogConfirm
          open={open}
          handleClose={handleClose}
          handleConfirmDelete={handleConfirmDelete}
          whatDelete="Giáo viên"
        />
      )}
    </>
  );
};

export default Teachers;
