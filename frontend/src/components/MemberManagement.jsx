import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MemberManagement.css';

function MemberManagement() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const response = await axios.get('/api/members');
      setMembers(response.data);
    };

    fetchMembers();
  }, []);

  return (
    <div className="member-management">
      <h1>Member Management</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map(member => (
            <tr key={member.id}>
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>{member.role}</td>
              <td>
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MemberManagement;
