import React, { useContext, useEffect, useState } from "react";
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
import { useFormik } from "formik";

import loginSchema from "../../../yupSchema/loginSchema";
import axios from "axios";
import MessageSnackbar from "../../../basic_utility_components/snackbar/MessageSnackbar";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

const Login = () => {
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("");
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { login } = useContext(AuthContext);

  const handleClose = () => {
    setMessage(null);
  };

  const initialValues = {
    email: "mr.linh1090@gmail.com" || "",
    password: "password" || "",
    login_type: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      let typeUrl = ``;
      if (values.login_type === "teacher") {
        typeUrl = `${backendUrl}/teacher/login`;
      } else if (values.login_type === "student") {
        typeUrl = `${backendUrl}/student/login`;
      } else{
        typeUrl = `${backendUrl}/school/login`;
      }
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });
      try {
        const response = await axios.post(
          typeUrl,
          formData
        );

        console.log(response.headers["authorization"]); // undefined if not set in exposedHeaders: "Authorization" of cors server.js,
        const token = response.headers["authorization"];
        if (token) {
          localStorage.setItem("token", token);
        }
        const user = response.data.user;
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }
        formik.resetForm();

        setMessage(response.data.message);
        setMode("success");
        await login(user);
        await navigate(`/${values.login_type}`);
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
        Đăng nhập
      </Typography>
      <Typography variant="body1" align="center" marginTop={"20px"}>
        Tài khoản Trường    : mr.linh1090@gmail.com
      </Typography>
      <Typography variant="body1" align="center" marginTop={"20px"}>
        Tài khoản Giáo viên : linhkhpk00213@gmail.com
      </Typography>
      <Typography variant="body1" align="center" marginTop={"20px"}>
        Tài khoản Học sinh  : fijovizih@mailinator.com
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
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Đối tượng</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={formik.values.login_type}
            name="login_type"
            label="Đối tượng"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.login_type && Boolean(formik.errors.login_type)
            }
          >
            <MenuItem value={"school"}>Trường</MenuItem>
            <MenuItem value={"teacher"}>Giáo viên</MenuItem>
            <MenuItem value={"student"}>Học sinh</MenuItem>
          </Select>
          {formik.touched.login_type && formik.errors.login_type && (
            <FormHelperText sx={{ color:"#d32f2f" }}>{formik.errors.login_type}</FormHelperText>
          )}
        </FormControl>
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
          name="password"
          type="password"
          label="Mật khẩu"
          variant="outlined"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />

        <Button type="submit" variant="contained">
          Đăng nhập
        </Button>
      </Box>
    </>
  );
};

export default Login;
