import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  CardMedia,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";

import registerSchema from "../../../yupSchema/registerSchema";
import axios from "axios";
import MessageSnackbar from "../../../basic_utility_components/snackbar/MessageSnackbar";

const Register = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const handleClose = () => {
    setMessage(null);
  };

  const addImage = (e) => {
    const image = e.target.files[0];
    setFile(image);
    setImageUrl(URL.createObjectURL(image));
  };
  const initialValues = {
    school_name: "",
    email: "",
    owner_name: "",
    password: "",
    confirm_password: "",
  };

  const Formik = useFormik({
    initialValues,
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });
      if (file) {
        formData.append("image", file);
        try {
          const { data } = await axios.post(
            `${backendUrl}/school/register`,
            formData
          );

          Formik.resetForm();
          handleClearFile();

          setMessage(data.message);
          setMode("success");
        } catch (error) {
          console.log(error);
          setMessage(error.response.data.message);
          setMode("error");
        }
      } else {
        setMessage("Vui lòng chọn ảnh");
        setMode("error");
      }
    },
  });

  const fileInputRef = useRef(null);
  const handleClearFile = () => {
    setFile(null);
    setImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      {message && (
        <MessageSnackbar
          messa={message}
          handleClose={handleClose}
          mode={mode}
        />
      )}
      <Typography variant="h4" align="center" marginTop={"20px"}>
        Đăng ký trường học
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
        onSubmit={Formik.handleSubmit}
      >
        <TextField
          type="file"
          onChange={(e) => addImage(e)}
          id="outlined-basic"
          name="image"
          inputRef={fileInputRef}
        />
        {imageUrl ? (
          <Box>
            <CardMedia component={"img"} height={"240px"} image={imageUrl} />
          </Box>
        ) : null}
        <TextField
          id="outlined-basic"
          name="school_name"
          label="Tên trường học"
          variant="outlined"
          value={Formik.values.school_name}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.school_name && Formik.errors.school_name ? (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.school_name}
          </p>
        ) : null}
        <TextField
          id="outlined-basic"
          name="email"
          label="Thư điện tử"
          variant="outlined"
          value={Formik.values.email}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.email && Formik.errors.email ? (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.email}
          </p>
        ) : null}
        <TextField
          id="outlined-basic"
          name="owner_name"
          label="Tên hiệu trưởng"
          variant="outlined"
          value={Formik.values.owner_name}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.owner_name && Formik.errors.owner_name ? (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.owner_name}
          </p>
        ) : null}
        <TextField
          id="outlined-basic"
          name="password"
          type="password"
          label="Mật khẩu"
          variant="outlined"
          value={Formik.values.password}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.password && Formik.errors.password ? (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.password}
          </p>
        ) : null}
        <TextField
          id="outlined-basic"
          name="confirm_password"
          type="password"
          label="Xác nhận mật khẩu"
          variant="outlined"
          value={Formik.values.confirm_password}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.confirm_password && Formik.errors.confirm_password ? (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.confirm_password}
          </p>
        ) : null}
        <Button type="submit" variant="contained">
          Đăng ký
        </Button>
      </Box>
    </>
  );
};

export default Register;
