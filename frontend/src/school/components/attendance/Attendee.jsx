import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import { purple } from "@mui/material/colors";
import axios from "axios";
import { toast } from "sonner";
const color = purple[500];

const Attendee = ({ classId }) => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [attendance, setAttendance] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchTeachers = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/teacher/all`);
      if (data.success) {
        setTeachers(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchClassDetail = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/class/single/${classId}`);
      if (data.success) {
        setAttendance(data.data.attendee || null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async () => {
    try {
      const { data } = await axios.patch(
        `${backendUrl}/class/update/${classId}`,
        {
          attendee: selectedTeacher,
        }
      );
      if (data.success) {
        toast.success("Phân công GVCN thành công!");
        setSelectedTeacher("");
        fetchClassDetail();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchClassDetail();
  }, [classId]);

  return (
    <>
      <Box>
        <Typography sx={{ color: color }} variant="h5">
          Danh sách GVCN
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          {attendance ? (
            <>
              <Typography variant="h6">GVCN: {attendance?.name}</Typography>
              <Button onClick={() => setSelectedTeacher(attendance._id)}>Cập nhật</Button>
            </>
          ) : (
            "Chưa phân công GVCN"
          )}
        </Box>
      </Box>
      <Typography sx={{ color: color }} variant="h5">
        Phân công GVCN
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <FormControl sx={{ m: 1, minWidth: 120, width: "70%" }}>
          <InputLabel id="demo-simple-select-helper-label">
            Giáo viên
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="teacher"
            name="teacher"
            value={selectedTeacher || ""}
            label="Giáo viên"
            onChange={(e) => setSelectedTeacher(e.target.value)}
          >
            <MenuItem value="">
              <em>Vui lòng chọn</em>
            </MenuItem>
            {teachers &&
              teachers.map((teacher, index) => (
                <MenuItem key={index} value={teacher._id}>
                  {teacher.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <Button
          disabled={!selectedTeacher}
          variant="contained"
          color="primary"
          onClick={handleSave}
        >
          LƯU
        </Button>
      </Box>
    </>
  );
};

export default Attendee;
