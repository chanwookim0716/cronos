import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ko } from 'date-fns/locale'; // 한국어 로케일 임포트
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

registerLocale('ko', ko); // 한국어 로케일 등록

interface Task {
  id: string;
  date: string;
  time: string;
  text: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date()); // 현재 시간 표시용
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('golden-tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(new Date()); // 날짜와 시간을 동시에 선택

  // 시계 업데이트
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 데이터 저장
  useEffect(() => {
    localStorage.setItem('golden-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText || !selectedDateTime) return;

    const formattedDate = selectedDateTime.toISOString().split('T')[0]; // YYYY-MM-DD
    const formattedTime = selectedDateTime.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }); // HH:MM

    const newTask: Task = {
      id: crypto.randomUUID(),
      date: formattedDate,
      time: formattedTime,
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
    setSelectedDateTime(new Date()); // 추가 후 현재 날짜/시간으로 초기화
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task: Task) => task.id !== id));
  };

  const formatClockTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatClockDate = (date: Date) => {
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
        <div className="clock-time">{formatClockTime(currentTime)}</div>
        <div className="clock-date">{formatClockDate(currentTime)}</div>
      </section>

      <section className="scheduler-card">
        <div className="scheduler-header">
          <h2>일정 관리</h2>
          <span>{tasks.length}개의 할 일</span>
        </div>

        <form onSubmit={addTask} className="input-group">
          <div className="input-row">
            <DatePicker
              selected={selectedDateTime}
              onChange={(date: Date | null) => setSelectedDateTime(date)}
              dateFormat="yyyy년 MM월 dd일 HH:mm"
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="시간"
              className="date-time-picker-input" // 커스텀 스타일 적용을 위한 클래스
              wrapperClassName="date-time-picker-wrapper" // 래퍼에 스타일 적용을 위한 클래스
              popperPlacement="bottom-start"
              locale="ko" // 한국어 로케일 사용
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
