import { useCallback, useContext, useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment-timezone";

import { Box } from "@mui/material";
import axios from "axios";

import { AuthContext } from "../../../context/AuthContext";

moment.tz.setDefault("Asia/Ho_Chi_Minh");

const localizer = momentLocalizer(moment);

const ScheduleStudent = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { user } = useContext(AuthContext);

  const [classId, setClassId] = useState("");
  const [events, setEvents] = useState([]);

  const fetchScheduleByClass = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/schedule/fetch-with-class/${classId}`
      );
      if (data.success) {
        const responData = data.data.map((item) => {
          return {
            id: item._id,
            title: `Môn: ${item.subject.subject_name} - GV: ${item.teacher.name}`,
            start: moment.utc(item.startTime).toDate(),
            end: moment.utc(item.endTime).toDate(),
          };
        });

        setEvents(responData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [date, setDate] = useState(new Date(moment()));
  const [view, setView] = useState("week");

  const onNavigate = useCallback((newDate) => setDate(newDate), [setDate]);
  const onView = useCallback((newView) => setView(newView), [setView]);

  useEffect(() => {
    if (classId) {
      fetchScheduleByClass();
    }
  }, [classId]);

  useEffect(() => {
    setClassId(user.classId);
  }, [user.classId]);

  return (
    <>
      <Box>
        <h1>Lịch học của bạn ( Lớp: {user?.className} )</h1>
      </Box>
      <Calendar
        localizer={localizer}
        events={events}
        defaultView="week"
        views={["day", "week", "month", "agenda"]}
        step={30}
        timeslots={1}
        min={new Date(2021, 10, 0, 7, 0, 0)}
        max={new Date(2021, 10, 0, 21, 0, 0)}
        startAccessor="start"
        endAccessor="end"
        defaultDate={moment().toDate()}
        showMultiDayTimes
        style={{ height: 500 }}
        onNavigate={onNavigate}
        onView={onView}
        view={view}
        date={date}
      />
    </>
  );
};

export default ScheduleStudent;
