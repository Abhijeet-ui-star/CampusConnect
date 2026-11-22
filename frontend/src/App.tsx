import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  GraduationCap, Mail, Lock, UserRound, LogOut,
  CalendarDays, MapPin, Users, RefreshCw, CheckCircle,
  Ticket, Plus, Pencil, Trash2, ClipboardList
} from "lucide-react";
import QRScanner from "./Qrscanner";
import api from "./api";

type User = {
  id: number;
  full_name: string;
  email: string;
  student_id: string | null;
  department: string | null;
  role: string;
};

type EventItem = {
  id: number;
  title: string;
  description: string | null;
  category: string;
  venue: string;
  start_at: string;
  end_at: string;
  capacity: number;
  status: string;
};

type Registration = {
  registration_id: number;
  event_id: number;
  title: string;
  description?: string | null;
  category: string;
  venue: string;
  start_at: string;
  registration_status: string;
};

type AttendanceRecord = {
  attendance_id: number;
  student_name: string;
  email: string;
  status: string;
  check_in_at: string | null;
};

type EventRegistration = {
  registration_id: number;
  student_id: number;
  student_name: string;
  email: string;
  status: string;
};

const emptyEventForm = {
  title: "",
  description: "",
  category: "",
  venue: "",
  start_at: "",
  end_at: "",
  capacity: 100
};

function getErrorMessage(error: any): string {
  const data = error?.response?.data;

  if (typeof data?.detail === "string") return data.detail;
  if (data?.detail) return JSON.stringify(data.detail, null, 2);
  if (typeof data?.message === "string") return data.message;
  if (data) return JSON.stringify(data, null, 2);

  return error?.message || "Something went wrong. Please try again.";
}

// LOGIN
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password: password
      });

      if (!res.data?.access_token) {
        throw new Error("Login response did not contain an access token.");
      }

      localStorage.setItem("campusconnect_token", res.data.access_token);
      navigate("/dashboard");
    } catch (error: any) {
      alert(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-5">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-7">
          <GraduationCap size={48} className="mx-auto text-blue-700" />
          <h1 className="text-3xl font-bold text-blue-950 mt-3">CampusConnect</h1>
          <p className="text-slate-500">Shivalik College</p>
        </div>

        <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
        <p className="text-slate-500 mb-6">Sign in to your account.</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="font-semibold text-sm">Email Address</label>
            <div className="flex items-center border rounded-xl px-3 mt-2">
              <Mail className="text-slate-400" size={19} />
              <input
                className="w-full p-3 outline-none"
                type="email"
                placeholder="College email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-sm">Password</label>
            <div className="flex items-center border rounded-xl px-3 mt-2">
              <Lock className="text-slate-400" size={19} />
              <input
                className="w-full p-3 outline-none"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white rounded-xl p-4 font-bold"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-slate-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-700 font-bold">
            Register Now
          </Link>
        </p>
      </div>
    </main>
  );
}

// REGISTER
function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    student_id: "",
    department: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  function update(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/register", form);
      alert("Registration successful! Please login.");
      navigate("/");
    } catch (error: any) {
      alert(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-5">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-lg">
        <div className="text-center mb-6">
          <GraduationCap size={45} className="mx-auto text-blue-700" />
          <h1 className="text-3xl font-bold text-blue-950">Create Account</h1>
          <p className="text-slate-500">Join CampusConnect</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            name="full_name"
            placeholder="Full Name"
            value={form.full_name}
            onChange={update}
            required
            className="w-full border rounded-xl p-3"
          />

          <input
            name="email"
            type="email"
            placeholder="College Email"
            value={form.email}
            onChange={update}
            required
            className="w-full border rounded-xl p-3"
          />

          <input
            name="student_id"
            placeholder="Student ID"
            value={form.student_id}
            onChange={update}
            required
            className="w-full border rounded-xl p-3"
          />

          <select
            name="department"
            value={form.department}
            onChange={update}
            required
            className="w-full border rounded-xl p-3 bg-white"
          >
            <option value="">Select Department</option>
            <option value="CSE">Computer Science Engineering</option>
            <option value="DS">Data Science</option>
            <option value="IT">Information Technology</option>
            <option value="ECE">Electronics and Communication</option>
            <option value="ME">Mechanical Engineering</option>
            <option value="CE">Civil Engineering</option>
          </select>

          <input
            name="password"
            type="password"
            placeholder="Password (minimum 8 characters)"
            value={form.password}
            onChange={update}
            required
            minLength={8}
            className="w-full border rounded-xl p-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white rounded-xl p-4 font-bold"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-5 text-sm text-slate-500">
          Already registered?{" "}
          <Link to="/" className="text-blue-700 font-bold">Login</Link>
        </p>
      </div>
    </main>
  );
}

// DASHBOARD
function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [myRegistrations, setMyRegistrations] = useState<Registration[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventLoading, setEventLoading] = useState(true);
  const [eventError, setEventError] = useState("");
  const [registeringId, setRegisteringId] = useState<number | null>(null);

  const [scanMessage, setScanMessage] = useState("");
  const [scannerKey, setScannerKey] = useState(0);

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [attendanceEventId, setAttendanceEventId] = useState("");
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState("");

  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [eventForm, setEventForm] = useState(emptyEventForm);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [updatingEvent, setUpdatingEvent] = useState(false);

  const [selectedRegistrationEvent, setSelectedRegistrationEvent] = useState<number | null>(null);
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([]);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState("");

  useEffect(() => {
    api.get("/auth/me")
      .then(res => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("campusconnect_token");
        navigate("/");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  async function loadEvents() {
    setEventLoading(true);
    setEventError("");

    try {
      const res = await api.get("/events/");
      setEvents(Array.isArray(res.data) ? res.data : []);
    } catch (error: any) {
      setEventError(getErrorMessage(error));
    } finally {
      setEventLoading(false);
    }
  }

  async function loadMyRegistrations() {
    try {
      const res = await api.get("/events/my-registrations");
      const data: Registration[] = Array.isArray(res.data) ? res.data : [];
      setMyRegistrations(data);
      setRegisteredEvents(data.map(item => item.event_id));
    } catch (error) {
      console.log("Could not load registrations", error);
    }
  }

  useEffect(() => {
    loadEvents();
    loadMyRegistrations();
  }, []);

  async function handleEventRegister(eventId: number) {
    setRegisteringId(eventId);

    try {
      const res = await api.post(`/events/${eventId}/register`);
      alert(typeof res.data?.message === "string" ? res.data.message : "Successfully registered!");
      await loadMyRegistrations();
    } catch (error: any) {
      alert(getErrorMessage(error));
      if (error.response?.status === 409) await loadMyRegistrations();
    } finally {
      setRegisteringId(null);
    }
  }

  async function handleQRScan(decodedText: string) {
    try {
      const qrData = JSON.parse(decodedText);

      if (
        qrData.app !== "CampusConnect" ||
        !Number.isInteger(qrData.registration_id) ||
        !Number.isInteger(qrData.event_id)
      ) {
        throw new Error("Invalid CampusConnect QR ticket");
      }

      const res = await api.post("/attendance/check-in", qrData);
      const message = typeof res.data?.message === "string"
        ? res.data.message
        : "Attendance marked successfully!";

      setScanMessage(message);
      alert(message);
    } catch (error: any) {
      const message = getErrorMessage(error);
      setScanMessage(message);
      alert(message);
    } finally {
      setScannerKey(prev => prev + 1);
    }
  }

  async function loadAttendance() {
    if (!attendanceEventId) {
      setAttendanceError("Please select an event.");
      return;
    }

    setAttendanceLoading(true);
    setAttendanceError("");

    try {
      const res = await api.get(`/attendance/${attendanceEventId}`);
      setAttendanceRecords(Array.isArray(res.data) ? res.data : []);
    } catch (error: any) {
      setAttendanceError(getErrorMessage(error));
    } finally {
      setAttendanceLoading(false);
    }
  }

  async function loadEventRegistrations(eventId: number) {
    setSelectedRegistrationEvent(eventId);
    setRegistrationLoading(true);
    setRegistrationError("");
    setEventRegistrations([]);

    try {
      const res = await api.get(`/events/${eventId}/registrations`);
      setEventRegistrations(Array.isArray(res.data) ? res.data : []);
    } catch (error: any) {
      setRegistrationError(getErrorMessage(error));
    } finally {
      setRegistrationLoading(false);
    }
  }

  async function createEvent(e: FormEvent) {
    e.preventDefault();

    if (new Date(eventForm.end_at) <= new Date(eventForm.start_at)) {
      alert("End time must be after start time.");
      return;
    }

    setCreatingEvent(true);

    try {
      const params = {
        ...eventForm,
        start_at: new Date(eventForm.start_at).toISOString(),
        end_at: new Date(eventForm.end_at).toISOString()
      };

      await api.post("/events/", null, { params });

      alert("Event created successfully!");
      setShowCreateEvent(false);
      setEventForm({ ...emptyEventForm });
      await loadEvents();
    } catch (error: any) {
      alert(getErrorMessage(error));
    } finally {
      setCreatingEvent(false);
    }
  }

  function formatDateTimeLocal(value: string) {
    const date = new Date(value);
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
  }

  function startEditing(event: EventItem) {
    setEditingEventId(event.id);
    setShowCreateEvent(true);

    setEventForm({
      title: event.title,
      description: event.description || "",
      category: event.category,
      venue: event.venue,
      start_at: formatDateTimeLocal(event.start_at),
      end_at: formatDateTimeLocal(event.end_at),
      capacity: event.capacity
    });

    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  async function updateEvent(e: FormEvent) {
    e.preventDefault();
    if (!editingEventId) return;

    if (new Date(eventForm.end_at) <= new Date(eventForm.start_at)) {
      alert("End time must be after start time.");
      return;
    }

    setUpdatingEvent(true);

    try {
      const params = {
        ...eventForm,
        start_at: new Date(eventForm.start_at).toISOString(),
        end_at: new Date(eventForm.end_at).toISOString()
      };

      await api.put(`/events/${editingEventId}`, null, { params });

      alert("Event updated successfully!");
      setEditingEventId(null);
      setShowCreateEvent(false);
      setEventForm({ ...emptyEventForm });
      await loadEvents();
    } catch (error: any) {
      alert(getErrorMessage(error));
    } finally {
      setUpdatingEvent(false);
    }
  }

  async function deleteEvent(eventId: number) {
    if (!window.confirm("Delete this event and its registrations/attendance records?")) return;

    try {
      const res = await api.delete(`/events/${eventId}`);
      alert(typeof res.data?.message === "string" ? res.data.message : "Event deleted successfully!");

      if (editingEventId === eventId) {
        setEditingEventId(null);
        setShowCreateEvent(false);
        setEventForm({ ...emptyEventForm });
      }

      if (selectedRegistrationEvent === eventId) {
        setSelectedRegistrationEvent(null);
        setEventRegistrations([]);
      }

      await loadEvents();
      await loadMyRegistrations();
    } catch (error: any) {
      alert(getErrorMessage(error));
    }
  }

  function logout() {
    localStorage.removeItem("campusconnect_token");
    navigate("/");
  }

  if (loading) return <div className="p-10 text-center">Loading dashboard...</div>;
  if (!user) return null;

  const canScan = ["organizer", "faculty", "admin"].includes(user.role);

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="bg-blue-950 text-white p-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <GraduationCap size={32} />
          <div>
            <h1 className="text-xl font-bold">CampusConnect</h1>
            <p className="text-blue-200 text-sm">Shivalik College</p>
          </div>
        </div>

        <button onClick={logout} className="flex gap-2 items-center">
          <LogOut size={19} /> Logout
        </button>
      </header>

      <section className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-slate-900">
          Welcome, {user.full_name}!
        </h2>
        <p className="text-slate-500 mt-2">Your CampusConnect dashboard</p>

        {/* PROFILE */}
        <div className="bg-white rounded-2xl p-6 shadow mt-8">
          <UserRound className="text-blue-700 mb-3" size={30} />
          <h3 className="font-bold text-xl">My Profile</h3>
          <div className="grid sm:grid-cols-2 gap-2 mt-3 text-slate-700">
            <p>Name: {user.full_name}</p>
            <p>Email: {user.email}</p>
            <p>Student ID: {user.student_id || "Not provided"}</p>
            <p>Department: {user.department || "Not provided"}</p>
            <p>
              Role:{" "}
              <span className="font-bold uppercase text-blue-700">{user.role}</span>
            </p>
          </div>
        </div>

        {/* MY REGISTRATIONS */}
        <div className="bg-white rounded-2xl p-6 shadow mt-8">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Ticket className="text-blue-700" />
            My Registrations ({myRegistrations.length})
          </h3>

          {myRegistrations.length === 0 ? (
            <p className="text-slate-500">You have not registered for any events yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {myRegistrations.map(item => (
                <div key={item.registration_id} className="border rounded-xl p-5">
                  <span className="text-xs font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {item.category}
                  </span>

                  <h4 className="text-xl font-bold mt-4">{item.title}</h4>
                  <p className="text-slate-600 mt-2">
                    {item.description || "No description available."}
                  </p>

                  <p className="flex items-center gap-2 mt-4 text-slate-600">
                    <MapPin size={17} /> {item.venue}
                  </p>

                  <p className="flex items-center gap-2 mt-2 text-slate-600">
                    <CalendarDays size={17} /> {new Date(item.start_at).toLocaleString()}
                  </p>

                  <div className="mt-5 flex flex-col items-center bg-slate-50 border rounded-xl p-5">
                    <QRCodeSVG
                      value={JSON.stringify({
                        app: "CampusConnect",
                        registration_id: item.registration_id,
                        event_id: item.event_id
                      })}
                      size={180}
                      level="H"
                    />
                    <p className="font-bold mt-3">Your Event Ticket</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Registration ID: {item.registration_id}
                    </p>
                    <p className="text-xs text-slate-500">
                      Show this QR at the event entrance
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QR SCANNER */}
        {canScan && (
          <div className="bg-white rounded-2xl p-6 shadow mt-8">
            <h3 className="text-2xl font-bold mb-2">QR Attendance Scanner</h3>
            <p className="text-slate-500 mb-5">
              Scan a student's CampusConnect event ticket.
            </p>
            <QRScanner key={scannerKey} onScan={handleQRScan} />
            {scanMessage && (
              <p className="mt-4 font-semibold text-blue-700">{scanMessage}</p>
            )}
          </div>
        )}

        {/* ATTENDANCE */}
        {canScan && (
          <div className="bg-white rounded-2xl p-6 shadow mt-8">
            <h3 className="text-2xl font-bold mb-4">Attendance Records</h3>

            <div className="flex flex-wrap gap-3 mb-5">
              <select
                value={attendanceEventId}
                onChange={e => setAttendanceEventId(e.target.value)}
                className="border rounded-xl p-3 flex-1"
              >
                <option value="">Select Event</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>{event.title}</option>
                ))}
              </select>

              <button
                onClick={loadAttendance}
                disabled={attendanceLoading}
                className="bg-blue-700 text-white px-5 py-3 rounded-xl font-bold"
              >
                {attendanceLoading ? "Loading..." : "View Attendance"}
              </button>
            </div>

            {attendanceError && (
              <p className="text-red-600 mb-3">{attendanceError}</p>
            )}

            <div className="bg-blue-50 rounded-xl p-4 mb-5">
              <p className="text-slate-600">Total Students Present</p>
              <h2 className="text-3xl font-bold text-blue-800">
                {attendanceRecords.filter(record => record.status === "present").length}
              </h2>
            </div>

            {attendanceRecords.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Check-in Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.map(record => (
                      <tr key={record.attendance_id} className="border-b">
                        <td className="p-3 font-semibold">{record.student_name}</td>
                        <td className="p-3">{record.email}</td>
                        <td className="p-3">{record.status}</td>
                        <td className="p-3">
                          {record.check_in_at
                            ? new Date(record.check_in_at).toLocaleString()
                            : "Not available"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* CAMPUS EVENTS */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <CalendarDays className="text-blue-700" /> Campus Events
              </h3>
              <p className="text-slate-500 mt-1">
                Explore upcoming college events
              </p>
            </div>

            <button
              onClick={() => {
                loadEvents();
                loadMyRegistrations();
              }}
              className="flex gap-2 items-center bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <RefreshCw size={16} /> Refresh
            </button>
          </div>

          {/* CREATE / EDIT */}
          {canScan && (
            <div className="bg-white rounded-2xl p-6 shadow mb-6">
              <button
                onClick={() => {
                  if (editingEventId) {
                    setEditingEventId(null);
                    setEventForm({ ...emptyEventForm });
                  }
                  setShowCreateEvent(!showCreateEvent);
                }}
                className="bg-blue-700 text-white px-5 py-3 rounded-xl font-bold flex gap-2 items-center"
              >
                <Plus size={20} />
                {showCreateEvent ? "Close Form" : "Create New Event"}
              </button>

              {showCreateEvent && (
                <form
                  onSubmit={editingEventId ? updateEvent : createEvent}
                  className="grid md:grid-cols-2 gap-4 mt-6"
                >
                  <input
                    placeholder="Event Title"
                    required
                    value={eventForm.title}
                    onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                    className="border rounded-xl p-3"
                  />

                  <input
                    placeholder="Category"
                    required
                    value={eventForm.category}
                    onChange={e => setEventForm({ ...eventForm, category: e.target.value })}
                    className="border rounded-xl p-3"
                  />

                  <input
                    placeholder="Venue"
                    required
                    value={eventForm.venue}
                    onChange={e => setEventForm({ ...eventForm, venue: e.target.value })}
                    className="border rounded-xl p-3"
                  />

                  <input
                    type="number"
                    placeholder="Capacity"
                    min="1"
                    required
                    value={eventForm.capacity}
                    onChange={e => setEventForm({
                      ...eventForm,
                      capacity: Number(e.target.value)
                    })}
                    className="border rounded-xl p-3"
                  />

                  <div>
                    <label className="text-sm font-semibold">Start Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={eventForm.start_at}
                      onChange={e => setEventForm({
                        ...eventForm,
                        start_at: e.target.value
                      })}
                      className="border rounded-xl p-3 w-full mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold">End Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={eventForm.end_at}
                      onChange={e => setEventForm({
                        ...eventForm,
                        end_at: e.target.value
                      })}
                      className="border rounded-xl p-3 w-full mt-1"
                    />
                  </div>

                  <textarea
                    placeholder="Event Description"
                    required
                    value={eventForm.description}
                    onChange={e => setEventForm({
                      ...eventForm,
                      description: e.target.value
                    })}
                    className="border rounded-xl p-3 md:col-span-2"
                  />

                  <button
                    type="submit"
                    disabled={creatingEvent || updatingEvent}
                    className="bg-green-700 hover:bg-green-800 text-white rounded-xl p-3 font-bold md:col-span-2"
                  >
                    {editingEventId
                      ? updatingEvent ? "Updating..." : "Update Event"
                      : creatingEvent ? "Creating..." : "Create Event"}
                  </button>

                  {editingEventId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingEventId(null);
                        setShowCreateEvent(false);
                        setEventForm({ ...emptyEventForm });
                      }}
                      className="bg-slate-500 text-white rounded-xl p-3 font-bold md:col-span-2"
                    >
                      Cancel Editing
                    </button>
                  )}
                </form>
              )}
            </div>
          )}

          {/* EVENT LIST */}
          {eventLoading ? (
            <p className="bg-white rounded-xl p-6">Loading events...</p>
          ) : eventError ? (
            <div className="bg-white rounded-xl p-6 text-red-600">
              {eventError}
              <button
                onClick={loadEvents}
                className="block mt-3 text-blue-700 font-bold"
              >
                Try again
              </button>
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow">
              <CalendarDays size={42} className="mx-auto text-slate-400 mb-3" />
              <h4 className="text-xl font-bold">No Events Available Yet</h4>
              <p className="text-slate-500 mt-2">
                New college events will appear here.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {events.map(event => {
                const isRegistered = registeredEvents.includes(event.id);
                const isRegistering = registeringId === event.id;

                return (
                  <div key={event.id} className="bg-white rounded-2xl p-6 shadow">
                    <span className="text-xs font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      {event.category}
                    </span>

                    <h4 className="text-xl font-bold mt-4">{event.title}</h4>
                    <p className="text-slate-600 mt-2">
                      {event.description || "No description available."}
                    </p>

                    <p className="flex items-center gap-2 mt-4 text-slate-600">
                      <MapPin size={17} /> {event.venue}
                    </p>

                    <p className="flex items-center gap-2 mt-2 text-slate-600">
                      <CalendarDays size={17} /> {new Date(event.start_at).toLocaleString()}
                    </p>

                    <p className="flex items-center gap-2 mt-2 text-slate-600">
                      <Users size={17} /> Capacity: {event.capacity}
                    </p>

                    {canScan && (
                      <>
                        <div className="flex gap-3 mt-5">
                          <button
                            onClick={() => startEditing(event)}
                            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white rounded-xl p-3 font-bold flex justify-center items-center gap-2"
                          >
                            <Pencil size={17} /> Edit Event
                          </button>

                          <button
                            onClick={() => deleteEvent(event.id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl p-3 font-bold flex justify-center items-center gap-2"
                          >
                            <Trash2 size={17} /> Delete Event
                          </button>
                        </div>

                        <button
                          onClick={() => loadEventRegistrations(event.id)}
                          className="w-full mt-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl p-3 font-bold flex justify-center items-center gap-2"
                        >
                          <ClipboardList size={18} /> View Registered Students
                        </button>
                      </>
                    )}

                    {/* FIXED ORGANIZER VIEW BUTTON */}
                    <button
                      onClick={() => {
                        if (canScan) {
                          loadEventRegistrations(event.id);
                        } else if (!isRegistered && !isRegistering) {
                          handleEventRegister(event.id);
                        }
                      }}
                      disabled={!canScan && (isRegistered || isRegistering)}
                      className={`w-full mt-5 rounded-xl p-3 font-bold flex justify-center items-center gap-2 ${
                        !canScan && (isRegistered || isRegistering)
                          ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                          : canScan
                          ? "bg-blue-700 hover:bg-blue-800 text-white"
                          : "bg-blue-700 hover:bg-blue-800 text-white"
                      }`}
                    >
                      {isRegistering
                        ? "Registering..."
                        : canScan
                        ? <><Users size={18} /> Organizer View</>
                        : isRegistered
                        ? <><CheckCircle size={18} /> Registered</>
                        : "View / Register"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* REGISTERED STUDENTS */}
        {canScan && selectedRegistrationEvent !== null && (
          <div className="bg-white rounded-2xl p-6 shadow mt-8">
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <ClipboardList className="text-purple-700" /> Registered Students
                </h3>
                <p className="text-slate-500 mt-1">
                  Event: {events.find(e => e.id === selectedRegistrationEvent)?.title}
                </p>
              </div>

              <button
                onClick={() => loadEventRegistrations(selectedRegistrationEvent)}
                className="bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                <RefreshCw size={16} className="inline mr-2" /> Refresh
              </button>
            </div>

            {registrationLoading ? (
              <p className="mt-5">Loading registered students...</p>
            ) : registrationError ? (
              <p className="mt-5 text-red-600">{registrationError}</p>
            ) : (
              <>
                <div className="bg-purple-50 rounded-xl p-4 mt-5 mb-5">
                  <p className="text-slate-600">Total Registrations</p>
                  <h2 className="text-3xl font-bold text-purple-800">
                    {eventRegistrations.length}
                  </h2>
                </div>

                {eventRegistrations.length === 0 ? (
                  <p className="text-slate-500">
                    No students have registered for this event yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b bg-slate-50">
                          <th className="p-3">Registration ID</th>
                          <th className="p-3">Student Name</th>
                          <th className="p-3">Student ID</th>
                          <th className="p-3">Email</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {eventRegistrations.map(record => (
                          <tr key={record.registration_id} className="border-b">
                            <td className="p-3">{record.registration_id}</td>
                            <td className="p-3 font-semibold">{record.student_name}</td>
                            <td className="p-3">{record.student_id}</td>
                            <td className="p-3">{record.email}</td>
                            <td className="p-3">{record.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

// MAIN APP
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;