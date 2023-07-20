import React from 'react';
import Select from 'react-select';

const AllClasses = ({ classesData, searchTerm, isHonors, selectedDays, handleAddClass, daysOfWeek, setIsHonors, setSelectedDays, setSearchTerm, fetchClassData, hasMore }) => {
    const daysOptions = daysOfWeek.map(day => ({ label: day, value: day }));  // Format days of the week for the Select component

    return (
        <>
            <h3>All Classes</h3>
            <input
                type="text"
                placeholder="Search for a class"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div>
                <label>Show only honors classes</label>
                <input
                    type="checkbox"
                    checked={isHonors}
                    onChange={(e) => setIsHonors(e.target.checked)}
                    style={{cursor: 'pointer'}}
                />
            </div>
            <div>
                <label>Filter by days of the week</label>
                <Select
                    isMulti
                    options={daysOptions}
                    onChange={(selectedOptions) =>
                        setSelectedDays(selectedOptions ? selectedOptions.map(option => option.value) : [])
                    }
                />
            </div>
            <table>
                <thead>
                <tr>
                    <th>Subject Abbreviation</th>
                    <th>Course Number</th>
                    <th>Title</th>
                    <th>Section</th>
                    <th>Days</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Credit Hours</th>
                    <th>Honors</th>
                    <th>Instructor</th>
                </tr>
                </thead>
                <tbody>
                {classesData
                    .filter(classData =>
                        classData.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        classData.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        classData.courseNumber.toString().includes(searchTerm)
                    )
                    .filter(classData =>
                        (!isHonors || classData.honors) &&
                        (selectedDays.length === 0 || selectedDays.every(day => classData.days.split(',').includes(day)))
                    )
                    .map((data, index) => (
                    <tr key={index} onClick={() => handleAddClass(data)} style={{cursor: 'pointer'}}>
                        <td>{data.subjectAbbreviation}</td>
                        <td>{data.courseNumber}</td>
                        <td>{data.title}</td>
                        <td>{data.section}</td>
                        <td>{data.days}</td>
                        <td>{data.startTime}</td>
                        <td>{data.endTime}</td>
                        <td>{data.creditHours}</td>
                        <td>{data.honors ? "Yes" : "No"}</td>
                        <td>{data.instructor}</td>
                    </tr>
                    ))}
                </tbody>
            </table>

            <button onClick={fetchClassData}  disabled={!hasMore}>Load More</button>
        </>
    )
}

export default AllClasses;