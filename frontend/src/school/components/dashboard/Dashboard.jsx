import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Button, CardMedia, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import { useFormik } from "formik";

import registerSchema from "../../../yupSchema/registerSchema";

import MessageSnackbar from "../../../basic_utility_components/snackbar/MessageSnackbar";

const Dashboard = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [school, setSchool] = useState(null);
  const [edit, setEdit] = useState(false);

  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("");
  const handleClose = () => {
    setMessage(null);
  };

  const fetchSchools = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/school/fetch-single`);

      if (data.success) {
        setSchool(data.school);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addImage = (e) => {
    const image = e.target.files[0];
    setFile(image);
    setImageUrl(URL.createObjectURL(image));
  };

  const initialValues = {
    school_name: "",
  };
  const formik = useFormik({
    initialValues,
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      
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

  const cancelEdit = () => {
    setEdit(false);
    handleClearFile();
  };

  const handleEdit = () => {
    setEdit(true);
    formik.setFieldValue("school_name", school.school_name);
  };

  const handleSubmition = async () => {
    const formData = new FormData();
    formData.append("school_name", formik.getFieldProps("school_name").value);
    if (file) {
      formData.append("image", file);
    }
    try {
      const { data } = await axios.patch(
        `${backendUrl}/school/update`,
        formData
      );

      if (data.success) {
        setSchool(data.school);
        formik.resetForm();
        handleClearFile();
        cancelEdit();
        setMessage(data.message);
        setMode("success");
      }

    } catch (error) {
      console.log(error);
      setMessage(error.response.data.message);
      setMode("error");
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  return (
    <>
      {edit && (
        <>
          <Typography variant="h4" align="center" marginTop={"20px"}>
            Chỉnh sửa trường học
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
              id="outlined-basic"
              name="image"
              inputRef={fileInputRef}
            />
            {imageUrl ? (
              <Box>
                <CardMedia
                  component={"img"}
                  height={"240px"}
                  image={imageUrl}
                />
              </Box>
            ) : null}
            <TextField
              id="outlined-basic"
              name="school_name"
              label="Tên trường học"
              variant="outlined"
              value={formik.values.school_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.school_name && formik.errors.school_name ? (
              <p style={{ color: "red", textTransform: "capitalize" }}>
                {formik.errors.school_name}
              </p>
            ) : null}

            <Box sx={{ display: "flex", justifyContent: "center", gap: "20px" }}>
              <Button onClick={handleSubmition} variant="contained">
                Cập nhật
              </Button>
              <Button variant="outlined" onClick={cancelEdit}>
                Hủy
              </Button>

            </Box>
          </Box>
        </>
      )}
      {school && (
        <Box sx={{ height: "500px", width: "100%" }}>
          <img
            src={`images/upload/school/${school.school_image}`}
            alt="school"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <Typography variant="h4">{school.school_name}</Typography>
          <Typography variant="h6">Hiệu trưởng: {school.owner_name}</Typography>
          <Button onClick={handleEdit} variant="outlined">
            <EditIcon />
          </Button>
        </Box>
      )}

      {message && (
        <MessageSnackbar
          messa={message}
          handleClose={handleClose}
          mode={mode}
        />
      )}
    </>
  );
};

export default Dashboard;
