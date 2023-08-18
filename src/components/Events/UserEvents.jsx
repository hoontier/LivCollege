// UserEvents.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeEvent } from '../../features/eventsSlice';
import EditEvent from './EditEvent';  // Assume you will create a component similar to EditClass but for events
import AddEvent from './AddEvent';
import '../../styles/TableStyles.css';

const UserEvents = () => {
  const dispatch = useDispatch();
  const occasionalEvents = useSelector((state) => state.data.users?.[0]?.occasionalEvents || []);
  const recurringEvents = useSelector((state) => state.data.users?.[0]?.recurringEvents || []);
  const user = useSelector((state) => state.data.users?.[0]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  
  const [selectedEvent, setSelectedEvent] = useState(null);

  const convertTo12HourTime = (time) => {
    if (!time) return 'none';
    const [hour, minute] = time.split(':');
    const h = parseInt(hour, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const convertedHour = h > 12 ? h - 12 : h;
    return `${convertedHour}:${minute} ${ampm}`;
  };

  const formatDate = (date) => {
    if (!date) return 'none';
    const [year, month, day] = date.split('-');
    return `${month}-${day}-${year}`;
  };

  const handleRemoveEvent = (event, type) => {
    dispatch(removeEvent({ user: user, eventId: event.id, type }));
};

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
  };

  const closeEditModal = () => {
    setSelectedEvent(null);
  };

  const toggleAddEvent = () => {
    setShowAddEvent(prevState => !prevState);
  };

  return (
      <div className="user-classes-container">
          <div className="header-actions">
              <h3 className="main-header-text">Your Events</h3>
              <button onClick={toggleAddEvent}>
                {showAddEvent ? 'Close Add Event' : 'Add New Event'}
              </button>
          </div>
          
        {showAddEvent && <AddEvent onClose={toggleAddEvent} />}
        {occasionalEvents.length > 0 && (
            <>
                <h4 className="section-header-text">Occasional Events</h4>
                <table className="table">
                    <thead className="table-header">
                        <tr>
                            <th className="table-cell">Title</th>
                            <th className="table-cell">Description</th>
                            <th className="table-cell">Start Time</th>
                            <th className="table-cell">End Time</th>
                            <th className="table-cell">Start Date</th>
                            <th className="table-cell">End Date</th>
                            <th className="table-cell">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {occasionalEvents.map((event, index) => (
                            <tr key={index}>
                                <td className="table-cell">{event.title || 'none' }</td>
                                <td className="table-cell">{event.description || 'none'}</td>
                                <td className="table-cell">{convertTo12HourTime(event.startTime)}</td>
                                <td className="table-cell">{convertTo12HourTime(event.endTime)}</td>
                                <td className="table-cell">{formatDate(event.startDate)}</td>
                                <td className="table-cell">{formatDate(event.endDate)}</td>
                                <td className="table-cell">
                                    <button className="button" onClick={() => handleEditEvent(event)}>Edit</button>
                                    <button className="button remove-button" onClick={() => handleRemoveEvent(event)}>Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {selectedEvent && <EditEvent eventData={selectedEvent} onClose={closeEditModal} />}
            </>
        )}

        {recurringEvents.length > 0 && (
            <>
                <h4 className="section-header-text">Recurring Events</h4>
                <table className="table">
                    <thead className="table-header">
                        <tr>
                            <th className="table-cell">Title</th>
                            <th className="table-cell">Description</th>
                            <th className="table-cell">Start Time</th>
                            <th className="table-cell">End Time</th>
                            <th className="table-cell">Start Date</th>
                            <th className="table-cell">End Date</th>
                            <th className="table-cell">Days of Week</th>
                            <th className="table-cell">Recurrence</th>
                            <th className="table-cell">Specific Dates</th>
                            <th className="table-cell">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recurringEvents.map((event, index) => (
                            <tr key={index}>
                                <td className="table-cell">{event.title || 'none'}</td>
                                <td className="table-cell">{event.description || 'none'}</td>
                                <td className="table-cell">{convertTo12HourTime(event.startTime)}</td>
                                <td className="table-cell">{convertTo12HourTime(event.endTime)}</td>
                                <td className="table-cell">{formatDate(event.startDate)}</td>
                                <td className="table-cell">{formatDate(event.endDate)}</td>
                                <td className="table-cell">{event.daysOfWeek.length ? event.daysOfWeek.join(', ') : 'none'}</td>
                                <td className="table-cell">{event.recurrence || 'none'}</td>
                                <td className="table-cell">
                                    {event.specificDates.map((dateObj, dateIndex) => {
                                        if (dateObj.startTime) {
                                            return (
                                                <div key={dateIndex}>
                                                    {`${formatDate(dateObj.date)} from ${convertTo12HourTime(dateObj.startTime)} to ${convertTo12HourTime(dateObj.endTime)}`}
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div key={dateIndex}>
                                                    {formatDate(dateObj.date)}
                                                </div>
                                            );
                                        }
                                    })}
                                </td>
                                <td className="table-cell">
                                    <button className="button" onClick={() => handleEditEvent(event)}>Edit</button>
                                    <button className="button remove-button" onClick={() => handleRemoveEvent(event, 'recurring')}>Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {selectedEvent && <EditEvent eventData={selectedEvent} onClose={closeEditModal} />}
            </>
        )}

        {occasionalEvents.length === 0 && recurringEvents.length === 0 && (
            <h3>You have no events</h3>
        )}
    </div>
  );
}

export default UserEvents;
