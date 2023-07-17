// Calculate the duration in time slots
function getDurationInSlots(startTime, endTime) {
    const start = convertTimeToMinutes(startTime);
    const end = convertTimeToMinutes(endTime);
    return (end - start) / 5;
  }
  
  // Convert time from "hh:mm" format to minutes
  function convertTimeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
  
  // Generate the schedule table
  function Schedule({ classes }) {
    // Create a 2D array to represent the time slots
    const timeSlots = new Array(24 * 12).fill(null).map(() => new Array(7).fill(null));
  
    classes.forEach((classItem) => {
      const { startTime, endTime, days } = classItem;
      const parsedDays = parseDays(days);
  
      const rowStart = convertTimeToMinutes(startTime) / 5;
      const durationInSlots = getDurationInSlots(startTime, endTime);
      const rowEnd = rowStart + durationInSlots;
  
      parsedDays.forEach((day) => {
        const dayIndex = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].indexOf(day);
  
        for (let row = rowStart; row < rowEnd; row++) {
          timeSlots[row][dayIndex] = {
            class: classItem,
            isFirst: row === rowStart,
            rowSpan: durationInSlots,
          };
        }
      });
    });
  
    return (
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((row, index) => {
            const hour = Math.floor(index / 12);
            const minute = (index % 12) * 5;
            const time = formatTime(hour, minute);
  
            return (
              <tr key={index}>
                {index % 12 === 0 && (
                  <>
                    <td rowSpan="12">{time}</td>
                    <td className="time-divider" colSpan="5" />
                  </>
                )}
                {row.map((cell, cellIndex) => {
                  if (cell && cell.isFirst) {
                    return (
                      <td
                        key={cellIndex}
                        rowSpan={cell.rowSpan}
                        style={{ backgroundColor: 'lightgrey' }}
                      >
                        {cell.class.title}
                      </td>
                    );
                  } else if (cell) {
                    // Hide cells that are part of a row span
                    return <td key={cellIndex} style={{ display: 'none' }} />;
                  } else {
                    return <td key={cellIndex} />;
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
  
  // Parse the list of days and remove unnecessary characters
  function parseDays(days) {
    return days.replace(/"/g, '').split(',').map((day) => day.trim());
  }
  
  // Format the time as "hh:mm"
  function formatTime(hours, minutes) {
    const paddedHours = hours.toString().padStart(2, '0');
    const paddedMinutes = minutes.toString().padStart(2, '0');
    return `${paddedHours}:${paddedMinutes}`;
  }
  
  export default Schedule;
  