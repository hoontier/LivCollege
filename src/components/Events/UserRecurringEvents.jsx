//UserRecurringEvents.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import EditEvent from './EditEvent';
import AddEvent from './AddEvent';
import { useEvents } from './useEvents';

const UserRecurringEvents = () => {
    const { 
        showAddEvent, 
        selectedEvent,
        convertTo12HourTime, 
        formatDate, 
        handleRemoveEvent, 
        handleEditEvent, 
        closeEditModal, 
        toggleAddEvent 
    } = useEvents();

    const recurringEvents = useSelector((state) => state.data.user?.recurringEvents || []);

    return (
        <div >
            <div >
                <h3 >Your Recurring Events</h3>
                <button  onClick={toggleAddEvent}>
                    {showAddEvent ? 'Close Add Event' : 'Add New Event'}
                </button>
            </div>

            {showAddEvent && <AddEvent onClose={toggleAddEvent} />}
            {recurringEvents.length > 0 && (
                <>
                    <h4 >Recurring Events</h4>
                    <table >
                    <thead >
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Days of Week</th>
                            <th>Recurrence</th>
                            <th>Specific Dates</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recurringEvents.map((event, index) => (
                            <tr key={index}>
                                <td>{event.title || 'none'}</td>
                                <td>{event.description || 'none'}</td>
                                <td>{convertTo12HourTime(event.startTime)}</td>
                                <td>{convertTo12HourTime(event.endTime)}</td>
                                <td>{formatDate(event.startDate)}</td>
                                <td>{formatDate(event.endDate)}</td>
                                <td>{event.daysOfWeek.length ? event.daysOfWeek.join(', ') : 'none'}</td>
                                <td>{event.recurrence || 'none'}</td>
                                <td>
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
                                <td >
                                    <button  onClick={() => handleEditEvent(event)}>Edit</button>
                                    <button  onClick={() => handleRemoveEvent(event, 'recurring')}>Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                    {selectedEvent && <EditEvent eventData={selectedEvent} onClose={closeEditModal} />}
                </>
            )}

            {recurringEvents.length === 0 && (
                <h3 >You have no recurring events</h3>
            )}
        </div>
    );
};

export default UserRecurringEvents;
