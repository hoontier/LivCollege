import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Schedule from '../components/Schedule';

function AddEvent({ handleAddEvent, userClasses }) {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [multiDay, setMultiDay] = useState(false);
  const [repeats, setRepeats] = useState([]);
  const [visibility, setVisibility] = useState(true);
  const [formChanged, setFormChanged] = useState(false); 
  const navigate = useNavigate();



  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "None"];

  const userEvents = repeats.map(day => {
    const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
    const [endYear, endMonth, endDay] = multiDay ? endDate.split('-').map(Number) : [startYear, startMonth, startDay];
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const startDateObj = new Date(startYear, startMonth - 1, startDay, startHour, startMinute);
    const endDateObj = new Date(endYear, endMonth - 1, endDay, endHour, endMinute);

    return {
      title,
      start: startDateObj,
      end: endDateObj,
      allDay: !startTime && !endTime,
      resource: {
        days: `"${day}"`,
      },
    };
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddEvent(userEvents);
    resetForm();
  };

  const handleDashboard = () => {
    if (formChanged) {
      handleSubmit();
    }
    navigate('/dashboard');
  };

  const handleFormChange = () => setFormChanged(true);

  const resetForm = () => {
    setTitle('');
    setStartDate('');
    setEndDate('');
    setStartTime('');
    setEndTime('');
    setRepeats([]);
    setVisibility(true);
    setFormChanged(false);
  };

  const handleRepeatChange = (e) => {
    const value = e.target.value;
    if (repeats.includes(value)) {
      setRepeats(repeats.filter(day => day !== value));
    } else {
      setRepeats([...repeats, value]);
    }
    handleFormChange();
  }

  return (
    <div>
      <h1>Add Event</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => { setTitle(e.target.value); handleFormChange(); }}
          required
        />
        <input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => { setStartDate(e.target.value); handleFormChange(); }}
          required
        />
        <input
          type="time"
          placeholder="Start Time"
          value={startTime}
          onChange={(e) => { setStartTime(e.target.value); handleFormChange(); }}
          required
        />
        <input
          type="time"
          placeholder="End Time"
          value={endTime}
          onChange={(e) => { setEndTime(e.target.value); handleFormChange(); }}
          required
        />
        <label>
          Multi-Day Event:
          <input
            type="checkbox"
            checked={multiDay}
            onChange={() => { setMultiDay(!multiDay); handleFormChange(); }}
          />
        </label>
        {multiDay && 
          <input
            type="date"
            placeholder="End Date"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); handleFormChange(); }}
            required
          />
        }
        <label>
          Repeats:
          <select multiple value={repeats} onChange={handleRepeatChange}>
            {daysOfWeek.map((day, index) => (
              <option key={index} value={day}>{day}</option>
            ))}
          </select>
        </label>
        <label>
          Visible to friends:
          <input
            type="checkbox"
            checked={visibility}
            onChange={() => { setVisibility(!visibility); handleFormChange(); }}
          />
        </label>
        <button type="submit">Save & Add to Schedule</button>
        <button type="button" onClick={handleDashboard}>Dashboard</button>
      </form>
      <Schedule userClasses={userClasses} userEvents={userEvents}/>
    </div>
  );
}

export default AddEvent;
