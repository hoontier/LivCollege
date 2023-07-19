import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);
const startDate = new Date(2023, 7, 23); // August 23, 2023
const endDate = new Date(2023, 11, 8); // December 8, 2023

// Convert a time from "hh:mm" format and a day index to a date object
function convertTimeToDate(time, dayIndex, startDate) {
  const [hours, minutes] = time.split(':').map(Number);
  let date = new Date(startDate);

  date.setDate(date.getDate() + ((dayIndex + 7 - date.getDay()) % 7)); // Set date to next dayIndex
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
}

// Parse the list of days and remove unnecessary characters
function parseDays(days) {
  return days.replace(/"/g, '').split(',').map((day) => day.trim());
}

// Convert the classes into events that react-big-calendar can understand


const Schedule = ({ userClasses, friendClasses }) => {
  const userEvents = convertClassesToEvents(userClasses, true, '#3174ad');
  const friendEvents = friendClasses.flatMap((friend, index) =>
    convertClassesToEvents(friend.classes, false, friend.color, friend.friendName)
  );
  const events = [...userEvents, ...friendEvents];

  function convertClassesToEvents(classes, isUserClasses = true, color, friendName = '') {
    const events = [];
  
    classes.forEach((classItem) => {
      const { startTime, endTime, days, title } = classItem;
      const parsedDays = parseDays(days);
  
      parsedDays.forEach((day) => {
        const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day);
        let eventStartDate = convertTimeToDate(startTime, dayIndex, startDate);
        let eventEndDate = convertTimeToDate(endTime, dayIndex, startDate);
  
        // Loop for each week until end of the semester
        while (eventStartDate <= endDate) {
          events.push({
            start: new Date(eventStartDate),
            end: new Date(eventEndDate),
            title: isUserClasses ? `You: ${title}` : `${friendName}: ${title}`,
            isUserClasses,
            color,
          });
  
          // Increment dates by 1 week
          eventStartDate.setDate(eventStartDate.getDate() + 7);
          eventEndDate.setDate(eventEndDate.getDate() + 7);
        }
      });
    });
  
    return events;
  }

  const eventPropGetter = (event, start, end, isSelected) => {
    let style = {
      backgroundColor: event.color, // color now comes from the event itself
    };
    return { style };
  };
  
  return (
    <div style={{ height: '500px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ margin: '50px' }}
        defaultView='week'
        scrollToTime={new Date(1970, 1, 1, 8)} 
        defaultDate={new Date(2023, 7, 27)}
        eventPropGetter={eventPropGetter}
      />
    </div>
  );
};

export default Schedule;
