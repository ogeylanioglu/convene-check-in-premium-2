
import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import "./index.css";

function App() {
  const [guestList, setGuestList] = useState([]);
  const [checkedIn, setCheckedIn] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGuest, setNewGuest] = useState({ firstName: "", lastName: "" });
  const [newlyAddedEmail, setNewlyAddedEmail] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        setGuestList(results.data);
      },
    });
  };

  const handleCheckIn = (email) => {
    setCheckedIn((prev) => ({
      ...prev,
      [email]: !prev[email],
    }));
  };

  const handleAddGuest = () => {
    if (!newGuest.firstName || !newGuest.lastName) return;
    const newEntry = {
      firstName: newGuest.firstName,
      lastName: newGuest.lastName,
      email: `${newGuest.firstName.toLowerCase()}.${newGuest.lastName.toLowerCase()}@manual.com`,
    };
    setGuestList((prev) => [...prev, newEntry]);
    setCheckedIn((prev) => ({
      ...prev,
      [newEntry.email]: false,
    }));
    setNewlyAddedEmail(newEntry.email);
    setTimeout(() => setNewlyAddedEmail(null), 2000);
    setNewGuest({ firstName: "", lastName: "" });
    setShowAddForm(false);
  };

  const totalGuests = guestList.length;
  const checkedInCount = Object.values(checkedIn).filter(Boolean).length;
  const attendanceRate = totalGuests ? ((checkedInCount / totalGuests) * 100).toFixed(1) : 0;

  const filteredGuests = guestList.filter((guest) =>
    `\${guest.firstName} \${guest.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedGuests = filteredGuests.sort((a, b) =>
    a.firstName.localeCompare(b.firstName)
  );

  return (
    <div className="app">
      <header>
        <img src="/C_logo.png" alt="Convene Logo" className="logo" />
        <h1>Elevate your Check-in Process</h1>
      </header>

      <div className="controls">
        <input type="file" accept=".csv" onChange={handleFileUpload} />
        <input
          type="text"
          placeholder="Search guests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="stat-box">
          Attendance Rate: {attendanceRate}%
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `\${attendanceRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="guest-list">
        {sortedGuests.map((guest, index) => (
          <div
            key={index}
            className={
              "guest-card" +
              (checkedIn[guest.email] ? " checked-in" : "") +
              (guest.email === newlyAddedEmail ? " newly-added" : "")
            }
            onClick={() => handleCheckIn(guest.email)}
          >
            {guest.firstName} {guest.lastName}
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="manual-guest-form">
          <input
            type="text"
            placeholder="First Name"
            value={newGuest.firstName}
            onChange={(e) =>
              setNewGuest((prev) => ({ ...prev, firstName: e.target.value }))
            }
          />
          <input
            type="text"
            placeholder="Last Name"
            value={newGuest.lastName}
            onChange={(e) =>
              setNewGuest((prev) => ({ ...prev, lastName: e.target.value }))
            }
          />
          <button onClick={handleAddGuest}>Add Guest</button>
        </div>
      )}

      <button className="add-guest-btn" onClick={() => setShowAddForm(!showAddForm)}>
        +
      </button>
    </div>
  );
}

export default App;
