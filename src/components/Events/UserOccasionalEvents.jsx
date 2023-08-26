import React from 'react';
import { useSelector } from 'react-redux';
import EditEvent from './EditEvent';
import AddEvent from './AddEvent';
import { useEvents } from './useEvents';

const UserOccasionalEvents = () => {
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

    const occasionalEvents = useSelector((state) => state.data.user?.occasionalEvents || []);

    return (
        <div >
            <div >
                <h3 >Your Occasional Events</h3>
                <button onClick={toggleAddEvent}>
                    {showAddEvent ? 'Close Add Event' : 'Add New Event'}
                </button>
            </div>

            {showAddEvent && <AddEvent onClose={toggleAddEvent} />}
            {occasionalEvents.length > 0 && (
                <>
                    <h4 >Occasional Events</h4>
                    <table >
                    <thead >
                        <tr>
                            <th >Title</th>
                            <th >Description</th>
                            <th >Start Time</th>
                            <th >End Time</th>
                            <th >Start Date</th>
                            <th >End Date</th>
                            <th >Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {occasionalEvents.map((event, index) => (
                            <tr key={index}>
                                <td >{event.title || 'none' }</td>
                                <td >{event.description || 'none'}</td>
                                <td >{convertTo12HourTime(event.startTime)}</td>
                                <td >{convertTo12HourTime(event.endTime)}</td>
                                <td >{formatDate(event.startDate)}</td>
                                <td >{formatDate(event.endDate)}</td>
                                <td >
                                    <button onClick={() => handleEditEvent(event)}>Edit</button>
                                    <button onClick={() => handleRemoveEvent(event, 'occasional')}>Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                    {selectedEvent && <EditEvent eventData={selectedEvent} onClose={closeEditModal} />}
                </>
            )}

            {occasionalEvents.length === 0 && (
                <h3>You have no occasional events</h3>
            )}
        </div>
    );
};

export default UserOccasionalEvents;
