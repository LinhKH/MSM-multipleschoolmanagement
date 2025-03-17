import { Box, Button, Typography } from "@mui/material";

import axios from "axios";
import { useEffect, useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const NoticeTeacher = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [notices, setNotices] = useState([]);

  const fetchNoticesByAudience = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/notice/audience`, {
        audience: "teacher",
      });
      if (data.success) {
        setNotices(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNoticesByAudience();
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
          Danh sách thông báo
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell><b>Tiêu đề</b></TableCell>
                <TableCell><b>Nội dung</b></TableCell>
                <TableCell align="right"><b>Thông báo đến</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notices.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.title}
                  </TableCell>
                  <TableCell>{row.message}</TableCell>
                  <TableCell align="right">{row.audience}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default NoticeTeacher;
