// AddGroupEvent.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDateSelectionType } from '../../features/eventsSlice';
import { addGroupEventToFirestore } from '../../features/groupsSlice';
import '../../styles/AddEvent.css'

const AddGroupEvent = ({group}) => {
  const [ daysOrDates, setDaysOrDates ] = useState('days');
  const [ numOfDates, setNumOfDates ] = useState(1);
  const [ isRecurring, setIsRecurring ] = useState(false); 
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

  const toggleDaysOrDates = () => {
    if (daysOrDates === 'days') {
      dispatch(setDateSelectionType('recurring'));
      setDaysOrDates('dates');
    } else {
      dispatch(setDateSelectionType('recurring'));
      setDaysOrDates('days');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventDetails(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = () => {
    const eventType = isRecurring ? 'groupRecurring' : 'groupOccasional';
    console.log(group);
    dispatch(addGroupEventToFirestore({ userId: user.id, groupId: group, type: eventType, event: eventDetails }));
  };

  const handleAddDate = () => {
    setNumOfDates(prevState => prevState + 1);
  };

  return (
    <div className="add-event-container">
  
      <label>Title: 
        <input name="title" type="text" value={eventDetails.title} onChange={handleChange} />
      </label>
  
      <label>Description: 
        <textarea name="description" value={eventDetails.description} onChange={handleChange}></textarea>
      </label>

      <label>
        Is this a recurring event? 
        <input 
          type="checkbox"
          checked={isRecurring}
          onChange={() => setIsRecurring(prev => !prev) }
        />
      </label>

      {/* if it's not a recurring event, render a single date input */}

      {!isRecurring && (
        <div className="date-entry">
          <label>Date:
            <input name="startDate" type="date" value={eventDetails.startDate} onChange={handleChange} />
          </label>
        </div> )}
      <label>Start Time:
        <input name="startTime" type="time" value={eventDetails.startTime} onChange={handleChange} />
      </label>
  
      <label>End Time:
        <input name="endTime" type="time" value={eventDetails.endTime} onChange={handleChange} />
      </label>

      { isRecurring && ( // 3. Conditionally render based on isRecurring
        <>
  
      <button onClick={toggleDaysOrDates}>
          {daysOrDates === 'days' ? "Select by Dates" : "Select by Weekdays"}
      </button>
  
      {daysOrDates === 'days' ? 
      <div className="date-entry">
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
  
        <label>Occurs every
          <input name="recurrence" type="number" value={eventDetails.recurrence} onChange={handleChange} />
            {eventDetails.recurrence === 1 ? 'week' : 'weeks'}
        </label>
      </div> 
      : 
      <div className="date-entry">
        {Array.from({ length: numOfDates }).map((_, idx) => (
          <div key={idx}>
            <label>
              Date:
              <input 
                type="date" 
                value={eventDetails.specificDates[idx]?.date || ''}
                onChange={e => {
                  const newDates = [...eventDetails.specificDates];
                  newDates[idx] = { 
                    ...newDates[idx], 
                    date: e.target.value 
                  };
                  setEventDetails(prevState => ({ ...prevState, specificDates: newDates }));
                }}
              />
            </label>
  
            <label>
              Use different times?
              <input 
                type="checkbox"
                checked={eventDetails.specificDates[idx]?.useDifferentTimes || false}
                onChange={e => {
                  const newDates = [...eventDetails.specificDates];
                  newDates[idx] = { 
                    ...newDates[idx], 
                    useDifferentTimes: e.target.checked 
                  };
                  setEventDetails(prevState => ({ ...prevState, specificDates: newDates }));
                }}
              />
            </label>
  
            {eventDetails.specificDates[idx]?.useDifferentTimes && (
              <div>
                <label>Start Time:
                  <input 
                    type="time" 
                    value={eventDetails.specificDates[idx]?.startTime || ''}
                    onChange={e => {
                      const newDates = [...eventDetails.specificDates];
                      newDates[idx] = { 
                        ...newDates[idx], 
                        startTime: e.target.value 
                      };
                      setEventDetails(prevState => ({ ...prevState, specificDates: newDates }));
                    }}
                  />
                </label>
  
                <label>End Time:
                  <input 
                    type="time" 
                    value={eventDetails.specificDates[idx]?.endTime || ''}
                    onChange={e => {
                      const newDates = [...eventDetails.specificDates];
                      newDates[idx] = { 
                        ...newDates[idx], 
                        endTime: e.target.value 
                      };
                      setEventDetails(prevState => ({ ...prevState, specificDates: newDates }));
                    }}
                  />
                </label>
              </div>
            )}
  
            <button onClick={() => {
              const newDates = [...eventDetails.specificDates];
              newDates.splice(idx, 1);
              setEventDetails(prevState => ({ ...prevState, specificDates: newDates }));
              setNumOfDates(prevState => prevState - 1);
            }}>
              Remove Date
            </button>
  
          </div>
          
        ))}
        
        <button onClick={handleAddDate}>Add Another Date</button>
      </div>
      }

      </>
      )}
  
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
  
};

export default AddGroupEvent;
