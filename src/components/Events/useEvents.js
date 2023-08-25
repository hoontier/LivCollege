import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeEvent } from '../../features/eventsSlice';

export const useEvents = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user);
    
    const [showAddEvent, setShowAddEvent] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [forceRender, setForceRender] = useState(false);

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
        setForceRender(prev => !prev);
    };

    const handleEditEvent = (event) => {
        setSelectedEvent(event);
        setForceRender(prev => !prev);
    };

    const closeEditModal = () => {
        setSelectedEvent(null);
    };

    const toggleAddEvent = () => {
        setShowAddEvent(prevState => !prevState);
    };

    return {
        showAddEvent,
        selectedEvent,
        convertTo12HourTime,
        formatDate,
        handleRemoveEvent,
        handleEditEvent,
        closeEditModal,
        toggleAddEvent
    };
};
