import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  // Aufgaben von der API abrufen
  useEffect(() => {
    fetch("http://localhost:3050/liste_abrufen")
      .then((res) => res.json())
      .then(setTasks)
      .catch((err) => console.error("Fehler beim Laden:", err));
  }, []);

  // Neues Item hinzufügen
  const itemHinzufuegen = () => {
    fetch("http://localhost:3050/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    })
    .then(res => res.json())
    .then((newTask) => {
      setTasks([...tasks, newTask]);  // UI aktualisieren
      setTitle("");  // Eingabefeld leeren
    })
    .catch((err) => console.error("Fehler beim Hinzufügen:", err));
  };

  // Item löschen und UI aktualisieren
  const itemLöschen = (id) => {
    fetch(`http://localhost:3050/delete/${id}`, { method: "DELETE" })
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id)); // UI aktualisieren
      })
      .catch((err) => console.error("Fehler beim Löschen:", err));
  };

  return (
    <>
      <h1>To-Do Liste</h1>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <button onClick={itemHinzufuegen}>Hinzufügen</button>

      <ul>
        {tasks.map(({ id, title }) => (
          <li key={id}>
            <input type="checkbox" /> {title}
            <button onClick={() => itemLöschen(id)}>Löschen</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;

