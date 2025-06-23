
import React, { useState } from "react";
import "./index.css";

function App() {
  const [guests, setGuests] = useState([]);
  const [sortAsc, setSortAsc] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showManualOnly, setShowManualOnly] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const lines = event.target.result.split("\n").filter((line) => line.trim() !== "");
      const parsedGuests = lines.slice(1).map((line, index) => {
        const name = line.split(",")[0];
        return {
          id: index,
          Name: name,
          checkedIn: false,
          manual: false
        };
      });
      setGuests(parsedGuests);
    };
    reader.readAsText(file);
  };

  const toggleCheckIn = (id) => {
    setGuests(
      guests.map((guest) =>
        guest.id === id ? { ...guest, checkedIn: !guest.checkedIn } : guest
      )
    );
  };

  const handleAddGuest = () => {
    const fullName = prompt("Enter full name of guest:");
    if (fullName) {
      const [first, ...lastParts] = fullName.trim().split(" ");
      const last = lastParts.join(" ");
      const email = `${first}.${last}@manual.com`.toLowerCase();
      const newGuest = {
        id: guests.length + 1,
        Name: fullName,
        Email: email,
        checkedIn: false,
        manual: true
      };
      setGuests([...guests, newGuest]);
    }
  };

  const handleReset = () => {
    setGuests(guests.map((guest) => ({ ...guest, checkedIn: false })));
  };

  const handleClear = () => {
    setGuests([]);
  };

  const handleExport = () => {
    const headers = ["Name", "Email", "Checked In", "Manual"];
    const rows = guests.map((g) => [
      g.Name,
      g.Email || "",
      g.checkedIn ? "Yes" : "No",
      g.manual ? "Yes" : "No"
    ]);
    const csvContent =
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "guest-list.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const filteredGuests = guests
    .filter((guest) =>
      (!showManualOnly || guest.manual) &&
      guest.Name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortAsc
        ? a.Name.localeCompare(b.Name)
        : b.Name.localeCompare(a.Name)
    );

  const checkedInCount = guests.filter((guest) => guest.checkedIn).length;
  const percentage = guests.length ? Math.round((checkedInCount / guests.length) * 100) : 0;

  return (
    <div className="app-container">
      <h1 className="title">Guest Check-In</h1>
      <input type="file" accept=".csv" onChange={handleFileUpload} className="file-upload" />

      <div className="controls">
        <input
          type="text"
          placeholder="Search guest..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <button onClick={() => setSortAsc(!sortAsc)}>Sort {sortAsc ? "↓ Z-A" : "↑ A-Z"}</button>
        <button onClick={() => setShowManualOnly(!showManualOnly)}>
          {showManualOnly ? "Show All" : "Show Manual Only"}
        </button>
        <button onClick={handleExport}>Export CSV</button>
        <button onClick={handleReset}>Reset All</button>
        <button onClick={handleClear}>Clear</button>
      </div>

      <div className="stats">
        <div className="stat-box">
          Attendance Rate: {percentage}%
        </div>
        <progress value={checkedInCount} max={guests.length}></progress>
        <div className="stat-box">
          {checkedInCount} / {guests.length} Checked In
        </div>
      </div>

      <div className="guest-list">
        {filteredGuests.map((guest) => (
          <div
            key={guest.id}
            className={`guest-card ${guest.checkedIn ? "checked-in" : ""} ${guest.manual ? "manual" : ""}`}
            onClick={() => toggleCheckIn(guest.id)}
          >
            <span>{guest.Name}</span>
          </div>
        ))}
      </div>

      <button className="fab" onClick={handleAddGuest}>+</button>
    </div>
  );
}

export default App;
