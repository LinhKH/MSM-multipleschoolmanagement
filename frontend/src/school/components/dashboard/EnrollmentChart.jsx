import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import axios from "axios";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";

const EnrollmentChart = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [data, setData] = useState([]);
  const [overview, setOverview] = useState({});

  const fetchEnrollmentStats = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/school/dashboard/enrollment-stats`
      );
      setData(
        data.data.map((item) => ({
          month: `Tháng ${item._id}`,
          students: item.count,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };
  const fetchDashboardOverview = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/school/dashboard/overview`
      );
      setOverview(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchEnrollmentStats();
      await fetchDashboardOverview();
    };
    fetchData();
  }, []);

  return (
    <>
      <Box sx={{ height: "500px", width: "100%", marginTop: "150px", display: "flex", justifyContent: "center" }}>
        <Typography variant="h6" >
          Thống kê học sinh đăng ký
        </Typography>
        <LineChart width={600} height={300} data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <CartesianGrid stroke="#eee" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="students" stroke="#8884d8" />
        </LineChart>
      </Box>
      <Box sx={{  display: "flex", gap: 2, justifyContent: "center" }}>
        <Card>
          <CardActionArea
            sx={{
              height: "100%",
              "&[data-active]": {
                backgroundColor: "action.selected",
                "&:hover": {
                  backgroundColor: "action.selectedHover",
                },
              },
            }}
          >
            <CardContent sx={{ height: "100%" }}>
              <Typography variant="h5" component="div">
                👨‍🎓 Học sinh
              </Typography>
              <Typography variant="h3" color="text.secondary">
                {overview.totalStudents}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card>
          <CardActionArea
            sx={{
              height: "100%",
              "&[data-active]": {
                backgroundColor: "action.selected",
                "&:hover": {
                  backgroundColor: "action.selectedHover",
                },
              },
            }}
          >
            <CardContent sx={{ height: "100%" }}>
              <Typography variant="h5" component="div">
                👨‍🏫 Giáo viên
              </Typography>
              <Typography variant="h3" color="text.secondary">
                {overview.totalTeachers}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card>
          <CardActionArea
            sx={{
              height: "100%",
              "&[data-active]": {
                backgroundColor: "action.selected",
                "&:hover": {
                  backgroundColor: "action.selectedHover",
                },
              },
            }}
          >
            <CardContent sx={{ height: "100%" }}>
              <Typography variant="h5" component="div">
                📚 Môn học
              </Typography>
              <Typography variant="h3" color="text.secondary">
                {overview.totalCourses}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
    </>
  );
};

export default EnrollmentChart;
