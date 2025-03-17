import { Box, Typography } from "@mui/material";
import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import moment from "moment";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid2";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));
import { PieChart } from "@mui/x-charts/PieChart";

import { AuthContext } from "../../../context/AuthContext";

const AttendanceStudent = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { user } = useContext(AuthContext);
  const [present, setPresent] = useState(0);
  const [absent, setAbsent] = useState(0);
  const [attendanceData, setAttendanceData] = useState(null);

  const arrStatus = { present: "Có mặt", absent: "Vắng mặt" };

  const [students, setStudents] = useState([]);

  const fetchListAttendanceByStudent = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/attendance/student/${user.id}`
      );
      if (data.success) {
        setStudents(data.data);
        if (data.data) {
          const present = data.data.filter(
            (item) => item.status === "present"
          ).length;
          const absent = data.data.filter(
            (item) => item.status === "absent"
          ).length;
          setPresent(present);
          setAbsent(absent);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchListAttendanceByStudent();
  }, []);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={6}>
            <Typography
              variant="h4"
              align="center"
              marginTop={"20px"}
              marginBottom={"20px"}
            >
              Biểu đồ
            </Typography>
            <Item>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: present, label: "Có mặt" },
                      { id: 1, value: absent, label: "Vắng mặt" },
                    ],
                  },
                ]}
                width={400}
                height={200}
              />
            </Item>
          </Grid>
          <Grid size={6}>
            <Typography
              variant="h4"
              align="center"
              marginTop={"20px"}
              marginBottom={"20px"}
            >
              Bảng chấm công
            </Typography>
            <Item>
              {students ? (
                <Box
                  sx={{
                    width: "100%",
                    height: "auto",
                    borderRadius: 1,
                    border: 1,
                    p: 2,
                  }}
                >
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 450 }} aria-label="simple table">
                      <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }} align="left">
                            <b>Ngày</b>
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }} align="right">
                            <b>Điểm danh</b>
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
                            <TableCell align="left">
                              {moment(row.date).format("YYYY-MM-DD")}
                            </TableCell>
                            <TableCell align="right">
                              {arrStatus[row.status]}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ) : (
                <>Không có dữ liệu</>
              )}
            </Item>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default AttendanceStudent;
