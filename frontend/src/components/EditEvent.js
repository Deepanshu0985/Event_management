import axios from "axios";
import { useEffect, useState } from "react";
import useEvents from "../store/useEvents";
import useUsers from "../store/useUsers";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

function EditEvent({ data, cancelEdit }) {
  const { userData } = useUsers();
  const { addEvents } = useEvents();
  const [username, setUserName] = useState("");



  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kolkata");

  const [updatingEvent, setUpdatingEvent] = useState(false);

  useEffect(() => {
    if (data) {
      const start = new Date(data.EventStartDate);
      const end = new Date(data.EventEndDate);
      data.userIds.forEach((id) => {
        const user = userData.find((u) => u._id === id);
        if (user) {
          setUserName(user.Name);
        }
      });

      setStartDate(dayjs(start).format("YYYY-MM-DD")); // YYYY-MM-DD
      setStartTime(dayjs(start).format("HH:mm")); // HH:MM

      setEndDate(dayjs(end).format("YYYY-MM-DD"));
      setEndTime(dayjs(end).format("HH:mm"));

      setTimezone(data.EventTimezone);

    }
  }, [data, userData]);

  const handleUpdateEvent = async () => {
    try {
      const start = dayjs.tz(`${startDate} ${startTime}`, timezone).toDate();
      const end = dayjs.tz(`${endDate} ${endTime}`, timezone).toDate();

      setUpdatingEvent(true);
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";
      const res = await axios.put(
        `${API_URL}/api/events/${data._id}`,
        {
          userIds: data.userIds,
          EventStartDate: start,
          EventEndDate: end,
          EventTimezone: timezone,
        }
      );

      const Event = {
        _id: res.data._id,
        userIds: res.data.userIds,
        EventStartDate: res.data.EventStartDate,
        EventEndDate: res.data.EventEndDate,
        EventTimezone: res.data.EventTimezone,
      };

      addEvents(Event);

      console.log("Event created:", res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingEvent(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center backdrop-blur-sm bg-black/30 ">
      <div className="bg-white border-2 rounded-lg h-[80%] w-[40%] flex flex-col  gap-4 p-4 relative">
        <span className="text-xl font-semibold">Create Event</span>

        <div>
          <label className="font-semibold">Profile</label>
          <div className="bg-gray-100/[0.8] w-full border p-2 rounded-xl outline-none capitalize text-black text-center">
            {username}
          </div>
        </div>

        <div>
          <label className="font-semibold">Timezone</label>
          <select
            type="radio"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="bg-gray-100/[0.8] w-full border p-2 rounded-xl outline-none capitalize text-black text-center"
          >
            <option value="America/New_York">ET</option>
            <option value="Europe/London">GMT</option>
            <option defaultChecked value="Asia/Kolkata">
              IST
            </option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-semibold">Start Date & Time</label>
          <div className="flex gap-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-gray-100/[0.8] outline-none rounded-lg p-2 w-full text-center"
            />
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="bg-gray-100/[0.8] outline-none rounded-lg p-2 w-[25%]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-semibold">End Date & Time</label>
          <div className="flex gap-4">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-gray-100/[0.8] outline-none rounded-lg p-2 w-full text-center"
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="bg-gray-100/[0.8] outline-none rounded-lg p-2 w-[25%]"
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={cancelEdit}
            className="bg-gray-400 text-white p-2 rounded-lg"
          >
            cancel
          </button>
          <button
            onClick={handleUpdateEvent}
            className="bg-red-500 text-white p-2 rounded-lg "
          >
            {updatingEvent ? "Updateing Event..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditEvent;
