// Groups.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createGroupInFirestore } from '../../features/groupsSlice';

const CreateGroup = () => {
    const user = useSelector((state) => state.data.user);
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [privateState, setPrivateState] = useState(false);

    const handleCreateGroup = () => {
        if (title && description) {
            dispatch(createGroupInFirestore({ userId: user.id, title, description, privateState }));
            setTitle('');
            setDescription('');
        }
    };

    return (
        <div className="container-groups">
            <h3>Create Group</h3>
            <div>
                <input 
                    type="text" 
                    placeholder="Group Title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                />
                <textarea 
                    placeholder="Description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                />
                {/* toggle private */}
                <label htmlFor="private">Private</label>
                <input
                    type="checkbox"
                    id="private"
                    name="private"
                    checked={privateState}
                    onChange={() => setPrivateState(!privateState)}
                />
                <button onClick={handleCreateGroup}>Create New Group</button>
            </div>
            {/* More functionalities such as listing groups, inviting members, and adding group events will be added here... */}
        </div>
    );
}

export default CreateGroup;
