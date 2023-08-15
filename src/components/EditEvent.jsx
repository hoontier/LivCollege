// EditEvent.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateEventInFirestore } from '../features/eventsSlice'; // Assuming you have this action created

const EditEvent = ({ eventData, onClose }) => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState(eventData.title);
    const [description, setDescription] = useState(eventData.description);
    const [startTime, setStartTime] = useState(eventData.startTime);
    const [endTime, setEndTime] = useState(eventData.endTime);
    const [startDate, setStartDate] = useState(eventData.startDate);
    const [endDate, setEndDate] = useState(eventData.endDate);

    const handleSubmit = () => {
        const updatedEvent = {
            ...eventData,
            title,
            description,
            startTime,
            endTime,
            startDate,
            endDate
        };
        dispatch(updateEventInFirestore(updatedEvent));
        onClose();
    };

    return (
        <div className="edit-event-modal">
            <h2>Edit Event</h2>
            <label>
                Title:
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
            </label>
            <label>
                Description:
                <textarea value={description} onChange={e => setDescription(e.target.value)} />
            </label>
            <label>
                Start Time:
                <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
            </label>
            <label>
                End Time:
                <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
            </label>
            <label>
                Start Date:
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </label>
            <label>
                End Date:
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </label>
            <button onClick={handleSubmit}>Update Event</button>
            <button onClick={onClose}>Cancel</button>
        </div>
    );
}

export default EditEvent;
