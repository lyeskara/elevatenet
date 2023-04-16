import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/auth';

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const listUsersResult = await firebase.auth().listUsers();
      setUsers(listUsersResult.users);
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Admin Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.uid}>{user.uid}</li>
        ))}
      </ul>
    </div>
  );
}

export default AdminUsers;
