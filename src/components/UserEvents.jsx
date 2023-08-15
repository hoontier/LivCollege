import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeEvent } from '../features/eventsSlice';
import EditEvent from './EditEvent';  // Assume you will create a component similar to EditClass but for events
import '../styles/TableStyles.css';

const UserEvents = () => {
  const dispatch = useDispatch();
  const occasionalEvents = useSelector((state) => state.data.users?.[0]?.occasionalEvents || []);
  const user = useSelector((state) => state.data.users?.[0]);
  
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleRemoveEvent = (event) => {
    dispatch(removeEvent({ user: user, eventId: event.id, type: 'occasional' }));  // Assuming every event has a unique ID, and this example is for occasional events
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
  };

  const closeEditModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div>
      <h3>Your Events</h3>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {occasionalEvents.map((event, index) => (
            <tr key={index}>
              <td>{event.title}</td>
              <td>{event.description}</td>
              <td>{event.startTime}</td>
              <td>{event.endTime}</td>
              <td>{event.startDate}</td>
              <td>{event.endDate}</td>
              <td>
                <button onClick={() => handleEditEvent(event)}>Edit</button>
                <button onClick={() => handleRemoveEvent(event)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedEvent && <EditEvent eventData={selectedEvent} onClose={closeEditModal} />}
    </div>
  );
}

export default UserEvents;
