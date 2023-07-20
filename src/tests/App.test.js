import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

// Your components
import App from './App';

// Mock Firebase 
jest.mock('./config/firebaseConfig', () => ({
  auth: {
    currentUser: {
      uid: 'testUid'
    }
  },
  db: {}
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
  signOut: jest.fn(),
}));

describe('App', () => {
  test('renders the sign in page initially', () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <App />
      </Router>
    );

    expect(getByText(/sign in/i)).toBeInTheDocument();
  });

  // Test for navigating to the dashboard
  test('navigates to the dashboard when user is authenticated', async () => {
    // Mock the onAuthStateChanged function to simulate user being authenticated
    const user = { uid: 'testUid' };
    require('firebase/auth').onAuthStateChanged.mockImplementationOnce((auth, callback) => callback(user));

    // Mock the getDoc function to simulate fetching user data from Firestore
    require('firebase/firestore').getDoc.mockImplementation(() => Promise.resolve({
      exists: () => true,
      data: () => ({ classes: [], friends: [], friendRequests: [], outgoingRequests: [] }),
    }));

    const history = createMemoryHistory();
    const { findByText } = render(
      <Router history={history}>
        <App />
      </Router>
    );

    expect(await findByText(/dashboard/i)).toBeInTheDocument();
  });

  // Add more tests as needed
});
