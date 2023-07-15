import React from 'react';

const Users = ({ users }) => {
    return (
        <>
            <br />
            <br />
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Classes</th>
                </tr>
                </thead>
                <tbody>
                {users.map((data, index) => (
                    <tr key={index}>
                        <td>{data.name}</td>
                        <td>{data.classes && data.classes.length > 0 ? data.classes.map(classItem => classItem.course).join(', ') : "No classes"}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    )
}

export default Users;
