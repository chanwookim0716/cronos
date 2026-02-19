import React, { useState, useEffect } from 'react';
import './App.css';

interface Task {
  id: string;
  time: string;
  text: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('golden-tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');

  // Clock Update
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Persistence
  useEffect(() => {
    localStorage.setItem('golden-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText || !newTaskTime) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      time: newTaskTime,
      text: newTaskText,
      completed: false,
    };

    setTasks([...tasks, newTask].sort((a, b) => a.time.localeCompare(b.time)));
    setNewTaskText('');
    setNewTaskTime('');
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task: Task) => task.id !== id));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="app-container">
      <section className="clock-section">
        <div className="clock-time">{formatTime(time)}</div>
        <div className="clock-date">{formatDate(time)}</div>
      </section>

      <section className="scheduler-card">
        <div className="scheduler-header">
          <h2>Daily Schedule</h2>
          <span>{tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}</span>
        </div>

        <form onSubmit={addTask} className="input-group">
          <input
            type="time"
            value={newTaskTime}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTaskTime(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="What needs to be done?"
            value={newTaskText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTaskText(e.target.value)}
            required
          />
          <button type="submit">Add Task</button>
        </form>

        <div className="task-list">
          {tasks.length === 0 ? (
            <div className="empty-state">No tasks scheduled for today.</div>
          ) : (
            tasks.map((task: Task) => (
              <div key={task.id} className="task-item">
                <div className="task-info">
                  <span className="task-time">{task.time}</span>
                  <span className="task-text">{task.text}</span>
                </div>
                <button 
                  className="delete-btn"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default App;
