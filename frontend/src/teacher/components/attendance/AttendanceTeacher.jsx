import {
  Box,
  colors,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";

import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { toast } from "sonner";

const AttendanceTeacher = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [params, setParams] = useState({});
  const [attendaceStatus, setAttendanceStatus] = useState({});
  const [changedStudent, setChangedStudent] = useState(null);

  const handleAttendanceChange = (studentId, event) => {
    const { value } = event.target;
    setAttendanceStatus((prevStatus) => {
      const updatedStatus = { ...prevStatus, [studentId]: value };
      setChangedStudent({ studentId, value });
      return updatedStatus;
    });
  };

  const attendeeSingleStudent = async (studentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/attendance/mark`, {
        student: studentId,
        class: selectedClass,
        date: new Date(),
        status: attendaceStatus[studentId],
      });
      if (data.success) {
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event) => {
    setAttendanceStatus({});
    const { name, value } = event.target;
    setParams({ ...params, [name]: value });
    setSelectedClass(value);
  };
  const fetchAttendeeClass = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/class/attendee`);
      if (data.success) {
        setClasses(data.data);
        if (data.data.length > 0) {
          setSelectedClass(data.data[0]._id);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStudents = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/student/search`, {
        params: { student_class: selectedClass },
      });
      if (data.success) {
        setStudents(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchListAttendanceByClass = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/attendance/class/${selectedClass}`
      );
      if (data.success) {
        const status = data.data.reduce((acc, item) => {
          acc[item.student._id] = item.status;
          return acc;
        }, {});
        setAttendanceStatus(status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAttendeeClass();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
      fetchListAttendanceByClass();
    }
  }, [selectedClass]);

  useEffect(() => {
    if (changedStudent) {
      attendeeSingleStudent(changedStudent.studentId, changedStudent.value);
      setChangedStudent(null);
    }
  }, [changedStudent]);

  return (
    <>
      <Typography
        variant="h4"
        align="center"
        marginTop={"20px"}
        marginBottom={"20px"}
      >
        Chủ nhiệm lớp
      </Typography>
      {classes.length > 0 ? (
        <>
          <Stack sx={{ width: "100%", marginBottom: 2 }} spacing={2}>
            <Alert variant="filled" severity="success">
              Bạn đã được phân công chủ nhiệm {classes.length} lớp
            </Alert>
          </Stack>
          <Box
            sx={{
              width: "100%",
              height: "auto",
              borderRadius: 1,
              border: 1,
              p: 2,
            }}
          >
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-helper-label">
                Lớp học
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="student_class"
                name="student_class"
                value={selectedClass || ""}
                label="Lớp học"
                onChange={handleChange}
              >
                {classes &&
                  classes.map((classItem, index) => (
                    <MenuItem key={index} value={classItem._id}>
                      {classItem.class_text}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <Typography variant="h5" sx={{ textAlign: "center" }}>
              Danh sách học sinh
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">
                      <b>Tên</b>
                    </TableCell>
                    <TableCell align="right">
                      <b>Điểm danh</b>
                    </TableCell>
                    <TableCell align="right">
                      <b>Trạng thái</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((row) => (
                    <TableRow
                      key={row._id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="right">
                        <FormControl
                          sx={{
                            m: 1,
                            minWidth: 120,
                            borderColor:
                              attendaceStatus[row._id] === "present"
                                ? "green"
                                : attendaceStatus[row._id] === "absent"
                                ? "red"
                                : "default",
                          }}
                        >
                          <InputLabel id="demo-simple-select-helper-label">
                            Điểm danh
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-helper-label"
                            id="attendee_status"
                            name="attendee_status"
                            value={attendaceStatus[row._id] || ""}
                            label="Điểm danh"
                            onChange={(event) =>
                              handleAttendanceChange(row._id, event)
                            }
                          >
                            <MenuItem value="">
                              <em>Vui lòng chọn</em>
                            </MenuItem>
                            <MenuItem value="present">
                              <em>Có mặt</em>
                            </MenuItem>
                            <MenuItem value="absent">
                              <em>Vắng mặt</em>
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell align="right">
                        <span
                          style={{
                            color: attendaceStatus[row._id] ? "green" : "red",
                          }}
                        >
                          {attendaceStatus[row._id]
                            ? "Đã điểm danh"
                            : "Chưa điểm danh"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      ) : (
        <Stack sx={{ width: "100%" }} spacing={2}>
          <Alert variant="filled" severity="error">
            Bạn chưa được phân công chủ nhiệm lớp nào!
          </Alert>
        </Stack>
      )}
    </>
  );
};

export default AttendanceTeacher;
