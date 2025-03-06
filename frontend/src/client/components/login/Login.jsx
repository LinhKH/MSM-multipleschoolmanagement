import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";

import loginSchema from "../../../yupSchema/loginSchema";
import axios from "axios";
import MessageSnackbar from "../../../basic_utility_components/snackbar/MessageSnackbar";

const Login = () => {
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("");

  const handleClose = () => {
    setMessage(null);
  };

  const initialValues = {
    email: "",
    password: "",
  };

  const Formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });
      try {
        const { data } = await axios.post(
          "http://localhost:8000/api/school/login",
          formData
        );

        Formik.resetForm();

        setMessage(data.message);
        setMode("success");
      } catch (error) {
        console.log(error);
        setMessage(error.response.data.message);
        setMode("error");
      }
    },
  });

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
        Đăng nhập trường học
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

        <Button type="submit" variant="contained">
          Đăng nhập
        </Button>
      </Box>
    </>
  );
};

export default Login;
