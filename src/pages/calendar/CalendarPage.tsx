import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const INITIAL_DATE = new Date(2026, 2, 1);

const CalendarPage = () => {
  const calendarRef = useRef<any>(null);

  const [selectedMonth, setSelectedMonth] = useState(INITIAL_DATE.getMonth());
  const [selectedYear, setSelectedYear] = useState(INITIAL_DATE.getFullYear());

  const [meetings, setMeetings] = useState<any[]>([]);
  const [availabilitySlots, setAvailabilitySlots] = useState<any[]>([]);

  const [selectedDate, setSelectedDate] = useState("");
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const savedMeetings = localStorage.getItem("meetings");
    const savedSlots = localStorage.getItem("availability");

    if (savedMeetings) setMeetings(JSON.parse(savedMeetings));
    if (savedSlots) setAvailabilitySlots(JSON.parse(savedSlots));
  }, []);

  useEffect(() => {
    localStorage.setItem("meetings", JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem("availability", JSON.stringify(availabilitySlots));
  }, [availabilitySlots]);

  const formatTimeToAMPM = (time: string) => {
    if (!time) return "";
    const [h, m] = time.split(":");
    let hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    return `${hour % 12 || 12}:${m} ${ampm}`;
  };

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.dateStr);
  };

  // 🔥 CHECK DUPLICATE SLOT
  const isSlotExists =
    selectedDate &&
    time &&
    availabilitySlots.some(
      (slot) => slot.date === selectedDate && slot.time === time
    );

  // ✅ Add meeting request
  const handleAddMeeting = () => {
    if (!selectedDate || !title) return;

    const newMeeting = {
      id: Date.now(),
      title: `${title} (${formatTimeToAMPM(time)})`,
      date: selectedDate,
      status: "pending",
    };

    setMeetings([...meetings, newMeeting]);

    setTitle("");
    setTime("");
    setSelectedDate("");
  };

  // ✅ Add availability slot (FIXED + NO DUPLICATE)
  const addAvailabilitySlot = () => {
    if (!selectedDate || !time) return;

    if (isSlotExists) {
      alert("⚠️ This availability slot already exists!");
      return;
    }

    const slot = {
      id: Date.now(),
      title: `Available (${formatTimeToAMPM(time)})`,
      date: selectedDate,
      time: time,
    };

    setAvailabilitySlots([...availabilitySlots, slot]);
  };

  // Accept / Decline meeting
  const updateStatus = (id: number, status: string) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
  };

  // calendar navigation
  const handleMonthChange = (month: number) => {
    calendarRef.current.getApi().gotoDate(new Date(selectedYear, month, 1));
  };

  const handleYearChange = (year: number) => {
    calendarRef.current.getApi().gotoDate(new Date(year, selectedMonth, 1));
  };

  // CALENDAR EVENTS
  const calendarEvents = [
    ...meetings
      .filter((m) => m.status !== "declined")
      .map((m) => ({
        id: m.id,
        title: m.title,
        date: m.date,
        color: m.status === "confirmed" ? "green" : "orange",
      })),

    ...availabilitySlots.map((s) => ({
      id: s.id,
      title: s.title,
      date: s.date,
      color: "blue",
    })),
  ];

  const confirmedMeetings = meetings.filter(
    (m) => m.status === "confirmed"
  );

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">📅 Meeting Calendar</h2>

      {/* Controls */}
      <div className="mb-4 flex gap-3">
        <select
          value={selectedMonth}
          onChange={(e) => handleMonthChange(parseInt(e.target.value))}
          className="border p-2"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => handleYearChange(parseInt(e.target.value))}
          className="border p-2"
        >
          <option value="2026">2026</option>
          <option value="2027">2027</option>
          <option value="2028">2028</option>
        </select>
      </div>

      {/* Calendar */}
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        initialDate={INITIAL_DATE}
        events={calendarEvents}
        dateClick={handleDateClick}
        eventDisplay="block"
      />

      {/* Availability */}
      <div className="mt-6 p-4 border rounded">
        <h3 className="font-semibold mb-2">🟦 Add Availability Slot</h3>

        <p className="text-sm mb-2">
          Selected Date: {selectedDate || "None"}
        </p>

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="border p-2 mr-2"
        />

        <button
          onClick={addAvailabilitySlot}
          disabled={isSlotExists}
          className={`px-4 py-2 rounded text-white ${
            isSlotExists
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-500"
          }`}
        >
          {isSlotExists ? "Already Added" : "Add Availability"}
        </button>
      </div>

      {/* Meetings */}
      <div className="mt-6 p-4 border rounded">
        <h3 className="font-semibold mb-2">📩 Meeting Requests</h3>

        <input
          type="text"
          placeholder="Meeting Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 mr-2"
        />

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="border p-2 mr-2"
        />

        <button
          onClick={handleAddMeeting}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send Request
        </button>
      </div>

      {/* Requests */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">All Requests</h3>

        {meetings.map((m) => (
          <div key={m.id} className="border p-3 mb-2 rounded">
            <p>{m.title}</p>
            <p className="text-sm text-gray-500">{m.date}</p>

            <p>
              Status: <b>{m.status}</b>
            </p>

            <button
              onClick={() => updateStatus(m.id, "confirmed")}
              className="bg-green-500 text-white px-2 py-1 mr-2"
            >
              Accept
            </button>

            <button
              onClick={() => updateStatus(m.id, "declined")}
              className="bg-red-500 text-white px-2 py-1"
            >
              Decline
            </button>
          </div>
        ))}
      </div>

      {/* Dashboard */}
      <div className="mt-6 p-4 border rounded">
        <h3 className="font-semibold">✅ Confirmed Meetings (Dashboard)</h3>

        {confirmedMeetings.length === 0 ? (
          <p className="text-gray-500">No confirmed meetings</p>
        ) : (
          confirmedMeetings.map((m) => (
            <div key={m.id} className="border-b p-2">
              <p>{m.title}</p>
              <p className="text-sm text-gray-500">{m.date}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CalendarPage;