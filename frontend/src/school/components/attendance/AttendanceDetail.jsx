import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";

import moment from "moment";

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

const AttendanceDetail = () => {
  const studentId = useParams().id;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [attendanceData, setAttendanceData] = useState(null);
  const [present, setPresent] = useState(0);
  const [absent, setAbsent] = useState(0);

  const fetchAttendanceByStudent = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/attendance/student/${studentId}`
      );
      if (data.success) {
        setAttendanceData(data.data);
        if (data.data) {
          const present = data.data.filter((item) => item.status === "Present")
            .length;
          const absent = data.data.filter((item) => item.status === "Absent")
            .length;
          setPresent(present);
          setAbsent(absent);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAttendanceByStudent();
  }, []);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={6}>
            <Item>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: present, label: "Present" },
                      { id: 1, value: absent, label: "Absent" },
                    ],
                  },
                ]}
                width={400}
                height={200}
              />
            </Item>
          </Grid>
          <Grid size={6}>
            <Item>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left"><b>Date</b></TableCell>
                      <TableCell align="right"><b>Status</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendanceData &&
                      attendanceData.map((row) => (
                        <TableRow
                          key={row._id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell align="left">{moment(row.date).format('YYYY-MM-DD')}</TableCell>
                          <TableCell align="right">{row.status}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Item>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default AttendanceDetail;
