import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  // Aufgaben abrufen
  const fetchTasks = () => {
    fetch("http://localhost:3050/liste_abrufen")
      .then((res) => res.json())
      .then(setTasks)
      .catch(() => setError("Fehler beim Laden der Aufgaben"));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Neues Task hinzufügen
  const itemHinzufuegen = () => {
    if (!title.trim()) {
      setError("Bitte einen Titel eingeben!");
      return;
    }

    fetch("http://localhost:3050/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    })
      .then(res => res.json())
      .then(() => {
        setTitle(""); 
        fetchTasks(); // Neu laden
      })
      .catch(() => setError("Fehler beim Hinzufügen"));
  };

  // Task löschen
  const itemLöschen = (id) => {
    fetch(`http://localhost:3050/delete/${id}`, { method: "DELETE" })
      .then(() => fetchTasks()) // Neu laden
      .catch(() => setError("Fehler beim Löschen"));
  };

  // Checkbox-Status ändern
  const statusÄndern = (id, completed) => {
    fetch(`http://localhost:3050/update/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    })
    .then(() => fetchTasks()) // Neu laden
    .catch(() => setError("Fehler beim Aktualisieren"));
  };

  return (
    <>
      <h1>To-Do Liste</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <input 
        value={title} 
        onChange={(e) => {
          setTitle(e.target.value);
          setError(""); 
        }} 
      />
      <button onClick={itemHinzufuegen}>Hinzufügen</button>

      <ul>
        {tasks.map(({ id, title, completed }) => (
          <li key={id} style={{ textDecoration: completed ? "line-through" : "none" }}>
            <input 
              type="checkbox" 
              checked={completed} 
              onChange={() => statusÄndern(id, !completed)} 
            />
            {title}
            <button onClick={() => itemLöschen(id)}>Löschen</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
