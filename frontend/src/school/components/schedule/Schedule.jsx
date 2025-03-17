import { useCallback, useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment-timezone";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import axios from "axios";

import ScheduleEvent from "./ScheduleEvent";
import { toast } from "sonner";

moment.tz.setDefault("Asia/Ho_Chi_Minh");

const localizer = momentLocalizer(moment);

const Schedule = () => {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [eventId, setEventId] = useState("");

  const handleOpen = () => {
    if (!classId) {
      toast.error("Vui lòng chọn lớp học");
      return;
    }
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [classes, setClasses] = useState([]);

  const [classId, setClassId] = useState("");
  const [events, setEvents] = useState([]);

  const handleChangeClass = (e) => {
    setClassId(e.target.value);
  };

  const myEventsList = [
    {
      title: "Some title",
      start: new Date(),
      end: new Date(moment().add(1, "days")),
    },
  ];

  const fetchClasses = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/class/all`);
      if (data.success) {
        setClasses(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
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
  const fetchAllSchedule = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/schedule/fetch-all`);
      if (data.success) {
        const responData = data.data.map((item) => {
          return {
            id: item._id,
            title: `Môn: ${item.subject.subject_name} - GV: ${item.teacher.name}`,
            start: moment.utc(item.startTime).tz("Asia/Ho_Chi_Minh").toDate(),
            end: moment.utc(item.endTime).tz("Asia/Ho_Chi_Minh").toDate(),
          };
        });
        setEvents(responData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [date, setDate] = useState(new Date(moment()));
  const [view, setView] = useState(Schedule.WEEK);

  const onNavigate = useCallback((newDate) => setDate(newDate), [setDate]);
  const onView = useCallback((newView) => setView(newView), [setView]);

  const onSelectEvent = (event) => {
    console.log(event);
    setEventId(event.id);
    setIsEdit(true);
    setOpen(true);
  };

  useEffect(() => {
    fetchClasses();
  }, []);
  useEffect(() => {
    if (classId) {
      fetchScheduleByClass();
    } else {
      fetchAllSchedule();
    }
  }, [classId]);
  return (
    <>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}
      >
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-helper-label">Lớp học</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="student_class"
            name="student_class"
            value={classId || ""}
            label="Lớp học"
            onChange={handleChangeClass}
          >
            <MenuItem value="">
              <em>Vui lòng chọn</em>
            </MenuItem>
            {classes &&
              classes.map((classItem, index) => (
                <MenuItem key={index} value={classItem._id}>
                  {classItem.class_text}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          THÊM TIẾT HỌC
        </Button>
      </Box>
      <Box>
        <h1>Schedule</h1>
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
        onSelectEvent={onSelectEvent}
      />

      {open && (
        <ScheduleEvent
          open={open}
          handleClose={handleClose}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          classId={classId}
          setClassId={setClassId}
          eventId={eventId}
          fetchScheduleByClass={fetchScheduleByClass}
        />
      )}
    </>
  );
};

export default Schedule;
