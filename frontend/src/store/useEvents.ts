import axios from "axios";
import { create } from "zustand";

interface EventSchema {
  _id: String;
  userIds: String[];
  EventStartDate: Date;
  EventEndDate: Date;
  EventTimezone: String;
}

type Event = {
  events: EventSchema[];
  eventsById?: EventSchema;
  fetchUserEvents: (userId: String) => Promise<void>;
  getEvents: () => Promise<void>;
  getEventsById?: (userId: String) => Promise<void>;
  addEvents: (event: EventSchema) => void;
  updateEvent: (event: EventSchema) => void;
};

const useEvents = create<Event>((set) => ({
  events: [],

  getEvents: async () => {
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";
    const res = await axios.get(`${API_URL}/api/events`);
    set({ events: res.data });
  },

  addEvents: (event: EventSchema) =>
    set((state) => ({
      events: [...state.events, event], // append event
    })),

  getEventsById: async (_id: string) => {
    set({ eventsById: undefined }); // Clear previous data
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";
      const res = await axios.get(`${API_URL}/api/events/${_id}`);

      const Event = {
        _id: res.data._id,
        userIds: res.data.userIds,
        EventStartDate: res.data.EventStartDate,
        EventEndDate: res.data.EventEndDate,
        EventTimezone: res.data.EventTimezone,
        updateHistory: res.data.updateHistory,
      };


      set({ eventsById: Event });

    } catch (err) {
      console.error("Error fetching events for user:", err);
    }
  },

  fetchUserEvents: async (userId: string) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";
      const res = await axios.get(
        `${API_URL}/api/events/user/${userId}`
      );
      set({ events: res.data });
    } catch (err) {
      console.error("Error fetching events for user:", err);
    }
  },

  updateEvent: (updatedEvent: EventSchema) =>
    set((state) => ({
      events: state.events.map((event) =>
        event._id === updatedEvent._id ? updatedEvent : event
      ),
    })),
}));

export default useEvents;
