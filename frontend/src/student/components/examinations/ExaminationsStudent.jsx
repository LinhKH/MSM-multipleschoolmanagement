import { Box, Button, Typography } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import moment from "moment";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { AuthContext } from "../../../context/AuthContext";

const ExaminationsStudent = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [examinations, setExaminations] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchExaminationsByClass = async () => {
      try {
        if (user?.classId) {
          const { data } = await axios.get(
            `${backendUrl}/examination/class/${user?.classId}`
          );
          if (data.success) {
            setExaminations(data.data);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchExaminationsByClass();
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
          Danh sách bài kiểm tra lớp của bạn
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Ngày</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">Lớp học</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">Môn học</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">Loại</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {examinations.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {moment(row.examDate).format("MM/DD/YYYY")}
                  </TableCell>
                  <TableCell align="right">
                    {row.class?.class_text} - {row.class?.class_num}
                  </TableCell>
                  <TableCell align="right">
                    {row.subject?.subject_name}
                  </TableCell>
                  <TableCell align="right">{row.examType}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default ExaminationsStudent;
