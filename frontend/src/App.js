import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Select from "react-select";
import useUsers from "./store/useUsers";
import useEvents from "./store/useEvents";
import EditEvent from "./components/EditEvent.js";

function App() {
  const { userData, getUsers, addUser } = useUsers();

  const {
    events,
    getEvents,
    addEvents,
    fetchUserEvents,
    eventsById,
    getEventsById,
  } = useEvents();

  const [username, setUserName] = useState("");

  const [selectedUser, setSelectedUser] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kolkata");

  const [loading, setLoading] = useState(false);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState(false);

  useEffect(() => {
    getUsers();
    getEvents();
  }, [getUsers, getEvents]);

  const handleAddUser = async () => {
    if (username.trim() === "") return;

    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";
      const res = await axios.post(`${API_URL}/api/users`, {
        Name: username,
      });

      const user = {
        _id: res.data._id,
        Name: res.data.Name,
      };

      addUser(user);

      setUserName("");
      console.log("User added:", res.data);
    } catch (err) {
      console.error("Error adding user:", err);
    } finally {
      setLoading(false); // make sure loading stops even on error
    }
  };

  const handleCreateEvent = async () => {
    try {
      setCreatingEvent(true);
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";
      const res = await axios.post(`${API_URL}/api/events`, {
        userIds: selectedUser,
        startDate,
        endDate,
        startTime,
        endTime,
        timezone,
      });

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
      setCreatingEvent(false);
    }
  };

  const handleEditEvent = (id) => {
    console.log(id);

    setEditingEvent(true);
    getEventsById(id);
  };

  return (
    <div className="bg-white h-screen flex items-center justify-center select-none">
      <div className="bg-gray-100 rounded-lg min-h-[80%] w-[80%] p-4 flex flex-col gap-10">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1 items-start justify-center">
            <span className="text-3xl text-red-500 font-semibold">
              Event Management System
            </span>
            <span className="text-xs text-black/[0.6]">
              Create and manage events across multiple timezones
            </span>
          </div>

          <div className="flex gap-2 items-center justify-center">
            <input
              type="text"
              value={username}
              placeholder="Add User"
              className="rounded-lg bg-white border p-2 text-xs h-10 capitalize"
              onChange={(e) => setUserName(e.target.value)}
            />
            <button
              onClick={handleAddUser}
              className="bg-red-500 p-2 rounded-lg h-10 text-white font-bold"
            >
              {loading ? "ADDING..." : "ADD"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border-2 rounded-lg min-h-full w-full flex flex-col gap-4 p-4">
            <span className="text-xl font-semibold">Create Event</span>

            <div>
              <label className="font-semibold">Profile</label>
              <Select
                className="text-center"
                options={userData.map((u) => ({ value: u._id, label: u.Name }))}
                isMulti
                onChange={(selected) =>
                  setSelectedUser(selected.map((s) => s.value))
                }
              />
            </div>

            <div>
              <label className="font-semibold">Timezone</label>
              <select
                type="radio"
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
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-gray-100/[0.8] outline-none rounded-lg p-2 w-[25%]"
                />
              </div>
            </div>

            <button
              onClick={handleCreateEvent}
              className="bg-red-500 text-white p-2 rounded-lg"
            >
              {creatingEvent ? "Creating Event..." : "Create Event"}
            </button>
          </div>

          <div className="bg-white border-2 rounded-lg h-full w-full flex flex-col gap-4 p-4">
            <span className="text-xl font-semibold">Events</span>

            <label className="font-semibold">View in Timezones</label>
            <select
              type="radio"
              onChange={(e) => setTimezone(e.target.value)}
              className="bg-gray-100/[0.8] w-full border p-2 rounded-xl outline-none capitalize text-black text-center"
            >
              <option value="America/New_York">ET</option>
              <option value="Europe/London">GMT</option>
              <option defaultChecked value="Asia/Kolkata">
                IST
              </option>
            </select>

            <label className="font-semibold">User Events</label>
            <select
              type="radio"
              onChange={(e) => fetchUserEvents(e.target.value)}
              className="bg-gray-100/[0.8] w-full border p-2 rounded-lg outline-none capitalize text-black"
            >
              <option className="text-center" defaultChecked>
                select profile...
              </option>
              {userData.map((user) => (
                <option
                  key={user._id}
                  value={user._id}
                  className="text-black/[0.6] text-center"
                >
                  {user.Name}
                </option>
              ))}
            </select>

            <div className="max-h-[200px] overflow-y-scroll">
              {events.length === 0 ? (
                <div className="text-xl text-black/[0.4] items-center justify-center flex w-full h-[80%] p-2">
                  No Events Found
                </div>
              ) : (
                events.map((event) => (
                  <div
                    key={event._id}
                    className="bg-gray-100 rounded-lg p-2 mt-4 flex flex-col gap-1"
                  >
                    <div className="flex items-center gap-1">
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="gray"
                          viewBox="0 0 24 24"
                          stroke-width="2"
                          stroke="gray"
                          class="size-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                          />
                        </svg>
                      </span>
                      <span className="font-semibold text-black text-xl capitalize">
                        {event.userIds
                          .map((id) => {
                            const user = userData.find((u) => u._id === id);
                            return user ? user.Name : "Unknown";
                          })
                          .join(", ")}
                      </span>
                    </div>

                    <span className="text-xs flex items-center gap-1">
                      <span className="text-lg font-bold text-black/[0.6]">
                        Start :{" "}
                      </span>
                      <span className="text-lg">
                        {" "}
                        {new Date(event.EventStartDate).toLocaleString(
                          "en-US",
                          {
                            timeZone: event.EventTimezone,
                            dateStyle: "medium",
                            timeStyle: "short",
                          }
                        )}
                      </span>
                    </span>

                    <span className="text-xs flex items-center gap-1">
                      <span className="text-lg font-bold text-black/[0.6]">
                        End :{" "}
                      </span>
                      <span className="text-lg">
                        {new Date(event.EventEndDate).toLocaleString("en-US", {
                          timeZone: event.EventTimezone,
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </span>

                    <button
                      onClick={() => handleEditEvent(event._id)}
                      className="bg-gray-300 p-2 rounded-lg"
                    >
                      Edit Event
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute">
        {editingEvent && (
          <div>
            {" "}
            <EditEvent
              data={eventsById}
              cancelEdit={() => setEditingEvent(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
