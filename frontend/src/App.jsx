import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// school routes
import SchoolLayout from "./school/SchoolLayout";
import Attendance from "./school/components/attendance/Attendance";
import Dashboard from "./school/components/dashboard/Dashboard";
import Class from "./school/components/class/Class";
import Examinations from "./school/components/examinations/Examinations";
import Notice from "./school/components/notice/Notice";
import Schedule from "./school/components/schedule/Schedule";
import Students from "./school/components/students/Students";
import Subjects from "./school/components/subjects/Subjects";
import Teachers from "./school/components/teachers/Teachers";
// teacher routes
import TeacherLayout from "./teacher/TeacherLayout";
import AttendanceTeacher from "./teacher/components/attendance/AttendanceTeacher";
import DashboardTeacher from "./teacher/components/dashboard/DashboardTeacher";
import ExaminationsTeacher from "./teacher/components/examinations/ExaminationsTeacher";
import NoticeTeacher from "./teacher/components/notice/NoticeTeacher";
import ScheduleTeacher from "./teacher/components/schedule/ScheduleTeacher";

// client routes
import ClientLayout from "./client/ClientLayout";
import Home from "./client/components/home/Home";
import Login from "./client/components/login/Login";
import Register from "./client/components/register/Register";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* School route */}
          <Route path="school" element={<SchoolLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="class" element={<Class />} />
            <Route path="examinations" element={<Examinations />} />
            <Route path="notice" element={<Notice />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="students" element={<Students />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="teachers" element={<Teachers />} />
          </Route>
          {/* teacher route */}
          <Route path="teacher" element={<TeacherLayout />}>
            <Route index element={<DashboardTeacher />} />
            <Route path="attendance" element={<AttendanceTeacher />} />
            <Route path="examinations" element={<ExaminationsTeacher />} />
            <Route path="notice" element={<NoticeTeacher />} />
            <Route path="schedule" element={<ScheduleTeacher />} />
          </Route>

          {/* Client route */}
          <Route path="/" element={<ClientLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
            

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
