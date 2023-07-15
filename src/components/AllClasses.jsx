import React from 'react';
import Select from 'react-select';

const AllClasses = ({ classesData, searchTerm, isHonors, selectedDays, handleAddClass, inputRef, daysOfWeek, setIsHonors, setSelectedDays, setSearchTerm }) => {
    return (
        <>
            <h3>All Classes</h3>
            <form onSubmit={(e) => {
                e.preventDefault();
                setSearchTerm(inputRef.current.value);
            }}>
                <input ref={inputRef} type="text" placeholder="Search for a class" />
                <button type="submit" style={{cursor: 'pointer'}}>Search</button>
            </form>
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
                options={daysOfWeek}
                onChange={(selectedOptions) =>
                    setSelectedDays(selectedOptions.map(option => option.value))
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
                    `${classData.subjectAbbreviation} ${classData.courseNumber}`.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .filter(classData =>
                    (!isHonors || classData.honors) &&
                    selectedDays.every(day => classData.days.includes(day))
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
        </>
    )
}

export default AllClasses;