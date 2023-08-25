import React from 'react';
import { useSelector } from 'react-redux';
import EditEvent from './EditEvent';
import AddEvent from './AddEvent';
import styles from '../../styles/TableStyles.module.css';
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
        <div className={styles['user-classes-container']}>
            <div className={styles['header-actions']}>
                <h3 className={styles['main-header-text']}>Your Occasional Events</h3>
                <button className={`${styles.button} ${styles['add-button']}`} onClick={toggleAddEvent}>
                    {showAddEvent ? 'Close Add Event' : 'Add New Event'}
                </button>
            </div>

            {showAddEvent && <AddEvent onClose={toggleAddEvent} />}
            {occasionalEvents.length > 0 && (
                <>
                    <h4 className={styles['section-header-text']}>Occasional Events</h4>
                    <table className={styles.table}>
                    <thead className={styles['table-header']}>
                        <tr>
                            <th className={styles['table-cell']}>Title</th>
                            <th className={styles['table-cell']}>Description</th>
                            <th className={styles['table-cell']}>Start Time</th>
                            <th className={styles['table-cell']}>End Time</th>
                            <th className={styles['table-cell']}>Start Date</th>
                            <th className={styles['table-cell']}>End Date</th>
                            <th className={styles['table-cell']}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {occasionalEvents.map((event, index) => (
                            <tr key={index}>
                                <td className={styles['table-cell']}>{event.title || 'none' }</td>
                                <td className={styles['table-cell']}>{event.description || 'none'}</td>
                                <td className={styles['table-cell']}>{convertTo12HourTime(event.startTime)}</td>
                                <td className={styles['table-cell']}>{convertTo12HourTime(event.endTime)}</td>
                                <td className={styles['table-cell']}>{formatDate(event.startDate)}</td>
                                <td className={styles['table-cell']}>{formatDate(event.endDate)}</td>
                                <td className={styles['table-cell']}>
                                    <button className={styles.button} onClick={() => handleEditEvent(event)}>Edit</button>
                                    <button className={`${styles.button} ${styles['remove-button']}`} onClick={() => handleRemoveEvent(event, 'occasional')}>Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                    {selectedEvent && <EditEvent eventData={selectedEvent} onClose={closeEditModal} />}
                </>
            )}

            {occasionalEvents.length === 0 && (
                <h3 className={styles['no-events-text']}>You have no occasional events</h3>
            )}
        </div>
    );
};

export default UserOccasionalEvents;
