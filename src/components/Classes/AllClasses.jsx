// AllClasses.jsx
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllClasses } from '../../features/dataSlice';
import { addClass } from '../../features/classesSlice';
import { setSearchTerm, setIsHonors, setSelectedDays, setCurrentPage, setClassesPerPage } from '../../features/filtersSlice'; // Assuming you've made filtersSlice

const AllClasses = () => {
    const dispatch = useDispatch();
    const classesData = useSelector((state) => state.classes.allClasses);
    const searchTerm = useSelector((state) => state.filters.searchTerm);
    const isHonors = useSelector((state) => state.filters.isHonors);
    const selectedDays = useSelector((state) => state.filters.selectedDays);
    const currentPage = useSelector((state) => state.filters.currentPage);
    const classesPerPage = useSelector((state) => state.filters.classesPerPage);
    const user = useSelector((state) => state.data.user);
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']; // Assuming these are the days of the week you want
    const [hoveredIndex, setHoveredIndex] = useState(null);


    useEffect(() => {
        if (classesData.length === 0) {
            dispatch(fetchAllClasses());
            console.log("Fetching all classes");
        }
    }, [dispatch, classesData]);
    

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

    const handleAddClass = (data) => {
        dispatch(addClass({ user: user, classData: data}));
    };

    return (
        <>
            <h3>All Classes</h3>
            <input
                type="text"
                placeholder="Search for a class"
                value={searchTerm}
                onChange={(e) => {
                    dispatch(setSearchTerm(e.target.value));
                    dispatch(setCurrentPage(1));
                }}
            />
            <div>
                <label>Show only honors classes</label>
                <input
                    type="checkbox"
                    checked={isHonors}
                    onChange={(e) => {
                        dispatch(setIsHonors(e.target.checked));
                        dispatch(setCurrentPage(1));
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
                        dispatch(setSelectedDays(selectedOptions ? selectedOptions.map(option => option.value) : []));
                        dispatch(setCurrentPage(1));
                    }
                    }
                />
            </div>
            <table>
                <thead>
                <tr>
                    <th>Course</th>
                    <th>Title</th>
                    <th>Section</th>
                    <th>Days</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Credits</th>
                    <th>Honors</th>
                    <th>Instructor</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {currentClasses.map((data, index) => (
                        <tr 
                            key={index} 
                            onClick={() => handleAddClass(data)} 
                            style={{
                                cursor: 'pointer', 
                                backgroundColor: hoveredIndex === index ? 'lightgrey' : 'transparent'
                            }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                        <td>{data.course}</td>
                        <td>{data.title}</td>
                        <td>{data.section}</td>
                        <td>{data.days}</td>
                        <td>{data.startTime}</td>
                        <td>{data.endTime}</td>
                        <td>{data.creditHours}</td>
                        <td>{data.honors ? "Yes" : "No"}</td>
                        <td>{data.instructor}</td>
                        <td> 
                            <button onClick={() => {handleAddClass(data)}}>Add</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
            <button 
                onClick={() => dispatch(setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage))}
            >
                Back
            </button>
            <button 
                onClick={() => dispatch(setCurrentPage(currentPage < Math.ceil(classesData.length / classesPerPage) ? currentPage + 1 : currentPage))}
            >
                Next
            </button>
            <Select
                defaultValue={classesPerPageOptions.find(option => option.value === classesPerPage)}
                options={classesPerPageOptions}
                onChange={(selectedOption) => {
                    dispatch(setClassesPerPage(selectedOption.value));
                    dispatch(setCurrentPage(1)); // Reset to the first page after changing the classes per page
                }}
            />
        </>
    )
}

export default AllClasses;
