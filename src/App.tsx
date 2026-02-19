import React, { useState, useEffect } from 'react';
import './App.css';

interface Task {
  id: string;
  date: string;
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
  const [newTaskDate, setNewTaskDate] = useState(new Date().toISOString().split('T')[0]);

  // 시계 업데이트
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 데이터 저장
  useEffect(() => {
    localStorage.setItem('golden-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText || !newTaskTime || !newTaskDate) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      date: newTaskDate,
      time: newTaskTime,
      text: newTaskText,
      completed: false,
    };

    // 날짜와 시간 순으로 정렬
    setTasks([...tasks, newTask].sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    }));

    setNewTaskText('');
    setNewTaskTime('');
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task: Task) => task.id !== id));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
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
          <h2>일정 관리</h2>
          <span>{tasks.length}개의 할 일</span>
        </div>

        <form onSubmit={addTask} className="input-group">
          <div className="input-row">
            <input
              type="date"
              className="date-input"
              value={newTaskDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTaskDate(e.target.value)}
              required
            />
            <input
              type="time"
              className="time-input"
              value={newTaskTime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTaskTime(e.target.value)}
              required
            />
          </div>
          <div className="input-row">
            <input
              type="text"
              placeholder="무엇을 해야 하나요?"
              value={newTaskText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTaskText(e.target.value)}
              required
            />
            <button type="submit">추가</button>
          </div>
        </form>

        <div className="task-list">
          {tasks.length === 0 ? (
            <div className="empty-state">등록된 일정이 없습니다.</div>
          ) : (
            tasks.map((task: Task) => (
              <div key={task.id} className="task-item">
                <div className="task-info">
                  <span className="task-date-time">{task.date} | {task.time}</span>
                  <span className="task-text">{task.text}</span>
                </div>
                <button 
                  className="delete-btn"
                  onClick={() => deleteTask(task.id)}
                >
                  삭제
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
