// groupsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, doc, setDoc, updateDoc, getDoc, addDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { fetchUserDetails } from './dataSlice';

// Async Thunk for creating a new group
export const createGroupInFirestore = createAsyncThunk(
    'groups/createGroup',
    async (payload, { dispatch }) => {
        const groupDocRef = await addDoc(collection(db, 'groups'), {
            title: payload.title,
            description: payload.description,
            privateState: payload.privateState,
            members: [payload.userId],
            groupRecurringEvents: [],
            groupOccasionalEvents: [],
            outgoingInvites: [],
        });
        
        const userDocRef = doc(db, 'users', payload.userId);
        const userGroups = (await getDoc(userDocRef)).data().groups || [];
        const userGroupInvites = (await getDoc(userDocRef)).data().groupInvites || [];
        userGroups.push(groupDocRef.id);
        await updateDoc(userDocRef, { groups: userGroups });

        // Dispatch fetchUserDetails to refresh user data in Redux store
        dispatch(fetchUserDetails({ uid: payload.userId }));
        return groupDocRef.id;
    }
);

// Alter this thunk so that the events are added to the user's recurringEvents or occasionalEvents array, and that the events are added to the group's groupRecurringEvents or groupOccasionalEvents array
export const addGroupEventToFirestore = createAsyncThunk(
    'events/addGroupEvent',
    async (payload, { dispatch }) => {
      const userDocRef = doc(db, 'users', payload.userId);
      let updatedEvents;
      if (payload.type === "groupRecurring") {
        updatedEvents = (await getDoc(userDocRef)).data().recurringEvents || [];
        updatedEvents.push(payload.event);
        await updateDoc(userDocRef, { recurringEvents: updatedEvents });
      } else {
        updatedEvents = (await getDoc(userDocRef)).data().occasionalEvents || [];
        updatedEvents.push(payload.event);
        await updateDoc(userDocRef, { occasionalEvents: updatedEvents });
      }
      
      // Now let's update the group's events
      const groupDocRef = doc(db, 'groups', payload.groupId);
      let groupEvents;
      if (payload.type === "groupRecurring") {
        groupEvents = (await getDoc(groupDocRef)).data().groupRecurringEvents || [];
        groupEvents.push(payload.event);
        await updateDoc(groupDocRef, { groupRecurringEvents: groupEvents });
      } else {
        groupEvents = (await getDoc(groupDocRef)).data().groupOccasionalEvents || [];
        groupEvents.push(payload.event);
        await updateDoc(groupDocRef, { groupOccasionalEvents: groupEvents });
      }
  
      // Dispatch fetchUserDetails after the Firestore update to refresh user data in the Redux store
      dispatch(fetchUserDetails({ uid: payload.userId }));
  
      return payload.event;
    }
);

export const acceptInviteThunk = createAsyncThunk(
    'groups/handleAcceptInvite',
    async (payload, { dispatch }) => {
        const { groupId, userId } = payload;

        // Get the group's data
        const groupDocRef = doc(db, 'groups', groupId);
        const groupData = (await getDoc(groupDocRef)).data();

        // Check if the user is already in the group's member list
        if (!groupData.members.includes(userId)) {
            // Add the user to the group's member list if not already added
            const updatedMembers = [...groupData.members, userId];
            await updateDoc(groupDocRef, { members: updatedMembers });
        }

        // Get the user's data
        const userDocRef = doc(db, 'users', userId);
        const userData = (await getDoc(userDocRef)).data();

        // Check if the group ID is already in the user's groups list
        if (!userData.groups.includes(groupId)) {
            // Add the group ID to the user's groups list if not already added
            const updatedGroups = [...userData.groups, groupId];
            await updateDoc(userDocRef, { groups: updatedGroups });
        }

        // Remove the group ID from the user's groupInvites list
        const updatedUserInvites = userData.groupInvites.filter(id => id !== groupId);
        await updateDoc(userDocRef, { groupInvites: updatedUserInvites });

        // Remove userId from the group's outgoingInvites list
        const updatedOutgoingInvites = groupData.outgoingInvites.filter(id => id !== userId);
        await updateDoc(groupDocRef, { outgoingInvites: updatedOutgoingInvites });

        // Dispatch fetchUserDetails to refresh user data in Redux store
        dispatch(fetchUserDetails({ uid: payload.userId }));
        return { userId };  // Returning user id as payload for potential use in reducers
    }
);



export const sendGroupInvite = createAsyncThunk(
    'groups/sendGroupInvite',
    async (payload, { getState, dispatch }) => {
        console.log("payload", payload);
        const { groupId, friendId } = payload;
        const state = getState();

        // Fetch the current group data from Firestore
        const groupDocRef = doc(db, 'groups', groupId);
        const groupData = (await getDoc(groupDocRef)).data();

        // Extract the current outgoingInvites or default to an empty array if not found
        const currentOutgoingInvites = groupData.outgoingInvites || [];
        
        // Ensure the friendId isn't already in the outgoingInvites list
        if(!currentOutgoingInvites.includes(friendId)) {
            // Update the group's outgoing invites with the new friendId
            console.log("friendId", friendId);
            await updateDoc(groupDocRef, {
                outgoingInvites: [...currentOutgoingInvites, friendId]
            });
        } else {
            console.warn(`friendId: ${friendId} already exists in the outgoingInvites list for group: ${groupId}`);
        }

        // Fetch the friend's data from Firestore
        const friendDocRef = doc(db, 'users', friendId);
        const friendData = (await getDoc(friendDocRef)).data();

        // Extract the friend's groupInvites or default to an empty array if not found
        const groupInvites = friendData.groupInvites || [];
        
        // Ensure the groupId isn't already in the groupInvites list for the friend
        if(!groupInvites.includes(groupId)) {
            // Update the friend's groupInvites with the new groupId
            await updateDoc(friendDocRef, {
                groupInvites: [...groupInvites, groupId]
            });
        } else {
            console.warn(`groupId: ${groupId} already exists in the groupInvites list for friend: ${friendId}`);
        }

        return friendId; // Return the friendId to be handled in the fulfilled case
    }
);

export const cancelGroupInvite = createAsyncThunk(
    'groups/cancelGroupInvite',
    async (payload, { getState, dispatch }) => {
        const { groupId, friendId } = payload;

        // Fetch the current group data from Firestore
        const groupDocRef = doc(db, 'groups', groupId);
        const groupData = (await getDoc(groupDocRef)).data();

        // Remove friendId from the group's outgoingInvites
        const updatedOutgoingInvites = groupData.outgoingInvites.filter(id => id !== friendId);
        await updateDoc(groupDocRef, {
            outgoingInvites: updatedOutgoingInvites
        });

        // Fetch the friend's data from Firestore
        const friendDocRef = doc(db, 'users', friendId);
        const friendData = (await getDoc(friendDocRef)).data();

        // Remove groupId from the friend's groupInvites
        const updatedGroupInvites = friendData.groupInvites.filter(id => id !== groupId);
        await updateDoc(friendDocRef, {
            groupInvites: updatedGroupInvites
        });

        return friendId; // Return the friendId to be handled in the fulfilled case
    }
);

export const fetchGroupInvitesFromFirestore = createAsyncThunk(
    'groups/fetchGroupInvites',
    async (userId, { dispatch }) => {
        const userDocRef = doc(db, 'users', userId);
        const userData = (await getDoc(userDocRef)).data();
 
        if (userData && userData.groupInvites) {
            const fetchedInvites = [];
            for (let groupId of userData.groupInvites) {
                const groupDocRef = doc(db, 'groups', groupId);
                const groupData = (await getDoc(groupDocRef)).data();
                if (groupData) {
                    fetchedInvites.push({
                        id: groupId,
                        title: groupData.title,
                        description: groupData.description,
                    });
                }
            }
            return fetchedInvites;
        } else {
            return [];
        }
    }
 );

 export const joinGroupInFirestore = createAsyncThunk(
    'groups/joinGroup',
    async (payload, { dispatch }) => {
        const { groupId, userId } = payload;

        // Adding the user to the group's member list
        const groupDocRef = doc(db, 'groups', groupId);
        const groupData = (await getDoc(groupDocRef)).data();
        const updatedMembers = [...groupData.members, userId];
        await updateDoc(groupDocRef, { members: updatedMembers });

        // Adding the group id to the user's groups list
        const userDocRef = doc(db, 'users', userId);
        const userData = (await getDoc(userDocRef)).data();
        const updatedGroups = [...userData.groups, groupId];
        await updateDoc(userDocRef, { groups: updatedGroups });

        // Dispatch fetchUserDetails to refresh user data in Redux store
        dispatch(fetchUserDetails({ uid: userId }));
        return { userId };  // Returning user id as payload for potential use in reducers
    }
);


  
const groupsSlice = createSlice({
    name: 'groups',
    initialState: {
        isLoading: false,
        currentGroup: null,
        outgoingInvites: [],
        groupInvites: [],
    },    
    reducers: {
        setOutgoingInvites: (state, action) => {
            state.outgoingInvites = action.payload;
        },
    },    
    extraReducers: (builder) => {
        builder
            .addCase(createGroupInFirestore.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(createGroupInFirestore.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentGroup = action.payload;
            })
            .addCase(acceptInviteThunk.pending, (state, action) => {
                // Handle pending if needed
            })
            .addCase(acceptInviteThunk.rejected, (state, action) => {
                // Handle errors if needed
            })
            .addCase(sendGroupInvite.fulfilled, (state, action) => {
                if (!state.outgoingInvites.includes(action.payload)) {
                    state.outgoingInvites.push(action.payload);
                }
            })
            .addCase(fetchGroupInvitesFromFirestore.fulfilled, (state, action) => {
                state.groupInvites = action.payload;
            })
            .addCase(acceptInviteThunk.fulfilled, (state, action) => {
                state.groupInvites = state.groupInvites.filter(invite => invite.id !== action.payload.groupId);
                state.outgoingInvites = state.outgoingInvites.filter(invite => invite !== action.payload.userId);
            })            
            .addCase(cancelGroupInvite.fulfilled, (state, action) => {
                state.groupInvites = state.groupInvites.filter(invite => invite.id !== action.payload.groupId);
            })                                               
    },
});

export default groupsSlice.reducer;
