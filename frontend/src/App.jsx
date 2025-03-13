import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster, toast } from 'sonner';

// school routes
import SchoolLayout from "./school/SchoolLayout";
import Attendance from "./school/components/attendance/Attendance";
import AttendanceDetail from "./school/components/attendance/AttendanceDetail";
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
import TeacherDetail from "./teacher/components/teacher_detail/TeacherDetail";
import ExaminationsTeacher from "./teacher/components/examinations/ExaminationsTeacher";
import NoticeTeacher from "./teacher/components/notice/NoticeTeacher";
import ScheduleTeacher from "./teacher/components/schedule/ScheduleTeacher";
// student routes
import StudentLayout from "./student/StudentLayout";
import AttendanceStudent from "./student/components/attendance/AttendanceStudent";
import ExaminationsStudent from "./student/components/examinations/ExaminationsStudent";
import NoticeStudent from "./student/components/notice/NoticeStudent";
import ScheduleStudent from "./student/components/schedule/ScheduleStudent";
import StudentDetail from "./student/components/student_detail/StudentDetail";

// client routes
import ClientLayout from "./client/ClientLayout";
import Home from "./client/components/home/Home";
import Login from "./client/components/login/Login";
import Register from "./client/components/register/Register";
import Logout from "./client/components/logout/Logout";
import ProtectedRoute from "./guard/ProtectedRoute";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* School route */}
          <Route
            path="/school"
            element={
              <ProtectedRoute allowedRoles={["SCHOOL"]}>
                <SchoolLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="attendance/:id" element={<AttendanceDetail />} />
            <Route path="class" element={<Class />} />
            <Route path="examinations" element={<Examinations />} />
            <Route path="notice" element={<Notice />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="students" element={<Students />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="teachers" element={<Teachers />} />
          </Route>
          {/* teacher route */}
          <Route
            path="teacher"
            element={
              <ProtectedRoute allowedRoles={["TEACHER"]}>
                <TeacherLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<TeacherDetail />} />
            <Route path="attendance" element={<AttendanceTeacher />} />
            <Route path="examinations" element={<ExaminationsTeacher />} />
            <Route path="notice" element={<NoticeTeacher />} />
            <Route path="schedule" element={<ScheduleTeacher />} />
          </Route>
          {/* student route */}
          <Route
            path="student"
            element={
              <ProtectedRoute allowedRoles={["STUDENT"]}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentDetail />} />
            <Route path="attendance" element={<AttendanceStudent />} />
            <Route path="examinations" element={<ExaminationsStudent />} />
            <Route path="notice" element={<NoticeStudent />} />
            <Route path="schedule" element={<ScheduleStudent />} />
          </Route>

          {/* Client route */}
          <Route path="/" element={<ClientLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="logout" element={<Logout />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </>
  );
}

export default App;
