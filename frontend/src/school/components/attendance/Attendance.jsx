import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Attendee from "./Attendee";
import { Link } from "react-router-dom";

const Attendance = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [params, setParams] = useState({});

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

  const fetchStudents = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/student/search`, {
        params,
      });
      if (data.success) {
        setStudents(data.data);
        fetchAttendanceByStudents(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [attendanceData, setAttendanceData] = useState({});

  const fetchAttendanceByStudents = async (studentList) => {
    const attendancePromises = studentList.map((student) => {
      fetchAttendanceByStudent(student._id);
    });
    const results = await Promise.all(attendancePromises);
    const updatedAttendanceData = {};
    results.forEach((result) => {
      if (result) {
        const { studentId, attendancePercentage } = result;
        updatedAttendanceData[studentId] = attendancePercentage;
      }
    });

    setAttendanceData(updatedAttendanceData);
  };

  const fetchAttendanceByStudent = async (studentId) => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/attendance/student/${studentId}`
      );
      if (data.success) {
        const totalClass = data.data.length;
        const totalPresent = data.data.filter(
          (item) => item.status === "Present"
        ).length;
        const attendancePercentage =
          totalClass > 0 ? (totalPresent / totalClass) * 100 : 0;
        return { studentId, attendancePercentage };
      }
    } catch (error) {
      console.log(`fetchAttendanceByStudent ERROR`, error);
      return { studentId, attendancePercentage: 0 };
    }
  };

  const handleSearch = (e) => {
    setParams({ ...params, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchClasses();
    fetchStudents();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [params]);

  return (
    <>
      <Grid container spacing={2} columns={16}>
        <Grid item size={4} sx={{ marginTop: "10vh" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-helper-label">
                Lớp
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="student_class"
                name="student_class"
                value={params.student_class || ""}
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
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <TextField
                id="outlined-basic"
                name="search"
                label="Tìm kiếm"
                variant="outlined"
                value={params.search || ""}
                onChange={handleSearch}
              />
            </FormControl>
            {/* <Button variant="contained" color="primary">
            THÊM TIẾT HỌC
          </Button> */}
          </Box>
          <Box>
            {params.student_class && <Attendee classId={params.student_class}/>}
          </Box>
        </Grid>
        <Grid size={8}>
          <Typography
            variant="h4"
            align="center"
            marginTop={"20px"}
            marginBottom={"20px"}
          >
            Danh sách điểm danh
          </Typography>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Tên học sinh</TableCell>
                  <TableCell align="right">Giới tính</TableCell>
                  <TableCell align="right">SĐT phụ huynh</TableCell>
                  <TableCell align="right">Lớp</TableCell>
                  <TableCell align="right">Thời gian</TableCell>
                  <TableCell align="right">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students &&
                  students.map((student) => (
                    <TableRow
                      key={student._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align="right">{student.name}</TableCell>
                      <TableCell align="right">{student.gender}</TableCell>
                      <TableCell align="right">
                        {student.guardian_phone}
                      </TableCell>
                      <TableCell align="right">
                        {student.student_class?.class_text} (
                        {student.student_class?.class_num})
                      </TableCell>
                      <TableCell align="right">
                        {
                          attendanceData[student._id] ? `${attendanceData[student._id]}%` : "0%"
                        }
                      </TableCell>
                      <TableCell align="right">
                        <Link to={`/school/attendance/${student._id}`}>Chi tiết</Link>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default Attendance;
