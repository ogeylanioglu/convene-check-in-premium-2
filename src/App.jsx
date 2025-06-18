import React, { useState } from "react";
import Papa from "papaparse";
import "./index.css";
import background from "../public/background.jpg";
import logo from "../public/C_logo.png";

function App() {
  const [guestList, setGuestList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [checkedIn, setCheckedIn] = useState([]);
  const [manualFirst, setManualFirst] = useState("");
  const [manualLast, setManualLast] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [animate, setAnimate] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const guests = results.data.map((row, index) => ({
          id: index,
          firstName: row["First Name"] || row["firstName"] || "",
          lastName: row["Last Name"] || row["lastName"] || "",
          email: row["Email"] || row["email"] || ""
        }));
        setGuestList(guests);
      }
    });
  };

  const handleCheckIn = (id) => {
    setCheckedIn((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleManualAdd = () => {
    if (!manualFirst || !manualLast) return;
    const newEntry = {
      id: guestList.length + 1,
      firstName: manualFirst,
      lastName: manualLast,
      email: `${manualFirst.toLowerCase()}.${manualLast.toLowerCase()}@manual.com`
    };
    setGuestList((prev) => [...prev, newEntry]);
    setManualFirst("");
    setManualLast("");
    setShowForm(false);
  };

  const filteredGuests = guestList.filter((guest) =>
    `${guest.firstName} ${guest.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const attendanceRate = guestList.length
    ? Math.round((checkedIn.length / guestList.length) * 100)
    : 0;

  return (
    <div className="app">
      <div className="overlay" />
      <header>
        <img src={logo} alt="Logo" className="logo" />
        <h1>Elevate your Check-in Process</h1>
      </header>

      <div className="controls">
        <input type="file" accept=".csv" onChange={handleFileUpload} />
        <input
          type="text"
          placeholder="Search guest..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="attendance">
          Attendance: {checkedIn.length}/{guestList.length} ({attendanceRate}%)
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${attendanceRate}%` }}
            />
          </div>
        </div>
      </div>

      <div className="manual-add">
        {!showForm && (
          <button
            className="plus-button"
            onClick={() => {
              setShowForm(true);
              setAnimate(true);
              setTimeout(() => setAnimate(false), 300);
            }}
          >
            +
          </button>
        )}

        {showForm && (
          <div className={`manual-form ${animate ? "animate-in" : ""}`}>
            <input
              type="text"
              placeholder="First Name"
              value={manualFirst}
              onChange={(e) => setManualFirst(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={manualLast}
              onChange={(e) => setManualLast(e.target.value)}
            />
            <button onClick={handleManualAdd}>Add Guest</button>
          </div>
        )}
      </div>

      <div className="guest-list">
        {filteredGuests.map((guest) => (
          <div
            key={guest.id}
            className={`guest-card ${
              checkedIn.includes(guest.id) ? "checked-in" : ""
            }`}
            onClick={() => handleCheckIn(guest.id)}
          >
            {guest.firstName} {guest.lastName}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
