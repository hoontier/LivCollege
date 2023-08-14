// Schedule.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);
const startDate = new Date(2023, 7, 23); // August 23, 2023
const endDate = new Date(2023, 11, 8); // December 8, 2023

function convertTimeToDate(time, dayIndex, startDate) {
  const [baseTime, period] = time.split(' ');
  const [hours, minutes] = baseTime.split(':').map(Number);

  let adjustedHours = hours;

  // Adjust hours based on the AM/PM period
  if (period === 'PM' && hours !== 12) {
    adjustedHours += 12;
  } else if (period === 'AM' && hours === 12) {
    adjustedHours = 0; // Convert 12 AM to 00 hours
  }

  let date = new Date(startDate);

  date.setDate(date.getDate() + ((dayIndex + 7 - date.getDay()) % 7)); // Set date to next dayIndex
  date.setHours(adjustedHours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
}


function parseDays(days) {
  return days.replace(/"/g, '').split(',').map((day) => day.trim());
}

function convertClassesToCalendarItems(classes, isUserClasses = true, color, friendName = '') {
  const calendarItems = [];

  classes.forEach((classItem) => {
    const { startTime, endTime, days, title } = classItem;
    const parsedDays = parseDays(days);

    parsedDays.forEach((day) => {
      const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day);
      let itemStartDate = convertTimeToDate(startTime, dayIndex, startDate);
      let itemEndDate = convertTimeToDate(endTime, dayIndex, startDate);

      // Loop for each week until end of the semester
      while (itemStartDate <= endDate) {
        calendarItems.push({
          start: new Date(itemStartDate),
          end: new Date(itemEndDate),
          title: isUserClasses ? `You: ${title}` : `${friendName}: ${title}`,
          isUserClasses,
          color,
        });

        // Increment dates by 1 week
        itemStartDate.setDate(itemStartDate.getDate() + 7);
        itemEndDate.setDate(itemEndDate.getDate() + 7);
      }
    });
  });

  return calendarItems;
}

const Schedule = () => {
  const userClasses = useSelector((state) => state.classes.userClasses);
  const selectedFriend = useSelector((state) => state.friends.selectedFriend);

  const userClassCalendarItems = convertClassesToCalendarItems(userClasses, true, '#3174ad');
  const friendCalendarItems = selectedFriend && selectedFriend.classes && selectedFriend.classes.length > 0
    ? convertClassesToCalendarItems(selectedFriend.classes, false, '#f47373', selectedFriend.name)
    : [];

  const calendarItems = [...userClassCalendarItems, ...friendCalendarItems];

  const itemPropGetter = (item, start, end, isSelected) => {
    let style = {
      backgroundColor: item.color,
    };
    return { style };
  };

  return (
    <div style={{ height: '500px' }}>
      <Calendar
        localizer={localizer}
        events={calendarItems}
        startAccessor="start"
        endAccessor="end"
        style={{ margin: '50px' }}
        defaultView='week'
        scrollToTime={new Date(1970, 1, 1, 8)} 
        defaultDate={new Date(2023, 7, 27)}
        eventPropGetter={itemPropGetter}
      />
    </div>
  );
};

export default Schedule;
