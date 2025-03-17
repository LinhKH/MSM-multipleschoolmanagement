import axios from "axios";
import { useEffect, useState } from "react";
import CardMedia from "@mui/material/CardMedia";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
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

const TeacherDetail = () => {
  const [teacherDetail, setTeacherDetail] = useState(null);

  const fetchTeacherDetail = async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    try {
      const { data } = await axios.get(`${backendUrl}/teacher/fetch-single`);
      if (data.success) {
        setTeacherDetail(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTeacherDetail();
  }, []);
  return (
    <>
      {teacherDetail && (
        <>
          <CardMedia
            component="img"
            sx={{
              height: 340,
              width: 340,
              margin: "auto",
              borderRadius: "50%",
            }}
            image={`images/upload/teacher/${teacherDetail?.teacher_image}`}
            alt="green iguana"
          />

          <TableContainer component={Paper} sx={{ marginTop: 5 }}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableBody>
                <StyledTableRow>
                  <StyledTableCell align="left">Name</StyledTableCell>
                  <StyledTableCell align="left">
                    {teacherDetail?.name}
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell align="left">Email</StyledTableCell>
                  <StyledTableCell align="left">
                    {teacherDetail?.email}
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell align="left">Tuổi</StyledTableCell>
                  <StyledTableCell align="left">
                    {teacherDetail?.age}
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell align="left">Giới tính</StyledTableCell>
                  <StyledTableCell align="left">
                    {teacherDetail?.gender}
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell align="left">
                    Trình độ chuyên môn
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {teacherDetail?.qualification}
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

export default TeacherDetail;
