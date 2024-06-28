import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <ul>
        <li><Link to="/admin/members">Manage Members</Link></li>
        <li><Link to="/admin/events">Manage Events</Link></li>
        <li><Link to="/admin/news">Manage News</Link></li>
      </ul>
    </div>
  );
}

export default AdminDashboard;
