import axios from "axios";
import React, { useEffect, useState } from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const StudentDetail = () => {
  const [studentDetail, setStudentDetail] = useState(null);

  const fetchStudentDetail = async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    try {
      const { data } = await axios.get(`${backendUrl}/student/fetch-single`);
      if (data.success) {
        setStudentDetail(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStudentDetail();
  }, []);
  return (
    <>
      {studentDetail && (
        <>
          <CardMedia
            component="img"
            sx={{
              height: 340,
              width: 340,
              margin: "auto",
              borderRadius: "50%",
            }}
            image={`images/upload/student/${studentDetail?.student_image}`}
            alt="green iguana"
          />

          <TableContainer component={Paper} sx={{ marginTop: 5 }}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableBody>
                <StyledTableRow>
                  <StyledTableCell align="left">Name</StyledTableCell>
                  <StyledTableCell align="left">
                    {studentDetail?.name}
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell align="left">Lớp</StyledTableCell>
                  <StyledTableCell align="left">
                    {studentDetail?.student_class?.class_text} [{" "}
                    {studentDetail?.student_class?.class_num} ]
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell align="left">Email</StyledTableCell>
                  <StyledTableCell align="left">
                    {studentDetail?.email}
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell align="left">Tuổi</StyledTableCell>
                  <StyledTableCell align="left">
                    {studentDetail?.age}
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell align="left">Giới tính</StyledTableCell>
                  <StyledTableCell align="left">
                    {studentDetail?.gender === "male" ? "Nam" : "Nữ"}
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell align="left">Người giám hộ</StyledTableCell>
                  <StyledTableCell align="left">
                    {studentDetail?.guardian}
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell align="left">
                    SĐT Người giám hộ
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {studentDetail?.guardian_phone}
                  </StyledTableCell>
                </StyledTableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
};

export default StudentDetail;
