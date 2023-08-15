// AddRecurringEvent.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDateSelectionType, addEventToFirestore } from '../features/eventsSlice'; 

const AddRecurringEvent = () => {
  const dispatch = useDispatch();
  const dateSelectionType = useSelector(state => state.event.dateSelectionType);
  const user = useSelector((state) => state.data.user);

  const [eventDetails, setEventDetails] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    startDate: "",
    endDate: "",
    daysOfWeek: [],
    recurrence: 1,
    specificDates: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventDetails(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = () => {
    dispatch(addEventToFirestore({ userId: user.id, type: dateSelectionType, event: eventDetails }));
  };

  return (
    <div>
      <label>Title: 
        <input name="title" type="text" value={eventDetails.title} onChange={handleChange} />
      </label>

      <label>Description: 
        <textarea name="description" value={eventDetails.description} onChange={handleChange}></textarea>
      </label>

      <label>Start Time:
        <input name="startTime" type="time" value={eventDetails.startTime} onChange={handleChange} />
      </label>

      <label>End Time:
        <input name="endTime" type="time" value={eventDetails.endTime} onChange={handleChange} />
      </label>

      <div>
        <button onClick={() => dispatch(setDateSelectionType('recurring'))}>Recurring</button>
        <button onClick={() => dispatch(setDateSelectionType('specific'))}>Specific Dates</button>
      </div>

      {dateSelectionType === 'recurring' ? 
      <div>
        <label>Start Date:
          <input name="startDate" type="date" value={eventDetails.startDate} onChange={handleChange} />
        </label>

        <label>End Date:
          <input name="endDate" type="date" value={eventDetails.endDate} onChange={handleChange} />
        </label>

        <label>Days of Week (use Ctrl to select multiple):
          <select name="daysOfWeek" multiple value={eventDetails.daysOfWeek} onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions).map(option => option.value);
            setEventDetails(prevState => ({ ...prevState, daysOfWeek: selected }));
          }}>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
        </label>

        <label>Recurrence (every X weeks):
          <input name="recurrence" type="number" value={eventDetails.recurrence} onChange={handleChange} />
        </label>
      </div> 
      : 
      <div>
        {/* Fields for specific date events */}
        {/*... Add fields for specific date events here ...*/}
      </div>}

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default AddRecurringEvent;
