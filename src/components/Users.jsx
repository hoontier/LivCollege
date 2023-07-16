import React from 'react';

const Users = ({ users, handleAddFriend }) => {
    return (
        <>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Classes</th>
                </tr>
                </thead>
                <tbody>
                {users.map((data, index) => (
                    <tr key={index} onClick={() => handleAddFriend(data)} style={{cursor: 'pointer'}}>
                        
                        <td>{data.private ? data.username : data.name}</td>
                        <td>
                            {
                                // Only display classes if account is not private
                                !data.private && data.classes && data.classes.length > 0
                                    ? data.classes.map(classItem => classItem.course).join(', ')
                                    : data.private
                                        ? "Private account"
                                        : "No classes"
                            }
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    )
}

export default Users;

