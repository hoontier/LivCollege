import React from 'react';
import Select from 'react-select';

const AllClasses = ({ classesData, searchTerm, isHonors, selectedDays, handleAddClass, daysOfWeek, setIsHonors, setSelectedDays, setSearchTerm, currentPage, setCurrentPage, classesPerPage, setClassesPerPage }) => {
    const daysOptions = daysOfWeek.map(day => ({ label: day, value: day }));  
    
    // We'll instantiate currentClasses with all of the classes, then apply different filter operations to show the final list
    let currentClasses = classesData;

    // Filter based on search term
    currentClasses = classesData.filter((candidateClass) => 
        candidateClass.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidateClass.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidateClass.courseNumber.toString().includes(searchTerm)
    )

    // Filter the classes based on honors status (if applicable)
    currentClasses = currentClasses.filter(candidateClass =>
        (!isHonors || candidateClass.honors)
    )

    // Filter the classes based on day of week
    currentClasses = currentClasses.filter(candidateClass =>
        (selectedDays.length === 0 || selectedDays.every(day => candidateClass.days.split(',').includes(day)))
    )

    // Apply pagination
    const indexOfLastClass = currentPage * classesPerPage;
    const indexOfFirstClass = indexOfLastClass - classesPerPage;
    currentClasses = currentClasses.slice(indexOfFirstClass, indexOfLastClass);

    const classesPerPageOptions = [
        { value: 5, label: '5' },
        { value: 10, label: '10' },
        { value: 25, label: '25' },
        { value: 50, label: '50' },
    ];

    return (
        <>
            <h3>All Classes</h3>
            <input
                type="text"
                placeholder="Search for a class"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                }}
            />
            <div>
                <label>Show only honors classes</label>
                <input
                    type="checkbox"
                    checked={isHonors}
                    onChange={(e) => {
                        setIsHonors(e.target.checked);
                        setCurrentPage(1);
                    }}
                    style={{cursor: 'pointer'}}
                />
            </div>
            <div>
                <label>Filter by days of the week</label>
                <Select
                    isMulti
                    options={daysOptions}
                    onChange={(selectedOptions) =>{
                        setSelectedDays(selectedOptions ? selectedOptions.map(option => option.value) : [])
                        setCurrentPage(1);
                    }
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
                {currentClasses.map((data, index) => (
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
            <button 
                onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
            >
                Back
            </button>
            <button 
                onClick={() => setCurrentPage(currentPage < Math.ceil(classesData.length / classesPerPage) ? currentPage + 1 : currentPage)}
            >
                Next
            </button>
            <Select
                defaultValue={classesPerPageOptions.find(option => option.value === classesPerPage)}
                options={classesPerPageOptions}
                onChange={(selectedOption) => {
                    setClassesPerPage(selectedOption.value);
                    setCurrentPage(1); // Reset to the first page after changing the classes per page
                }}
            />
        </>
    )
}

export default AllClasses;