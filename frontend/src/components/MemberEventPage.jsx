import React from 'react';
import { Link } from 'react-router-dom';
import './MemberEventPage.css';

function MemberEventPage() {
  return (
    <div className="member-event-page">
      <h1>Events</h1>
      <div className="event-list">
        <div className="event-item">
          <h2>Event Title 1</h2>
          <p>Event Description</p>
          <Link to="/event/register">
            <button>Register</button>
          </Link>
          <Link to="/volunteer">
            <button>Volunteer</button>
          </Link>
        </div>
        <div className="event-item">
          <h2>Event Title 2</h2>
          <p>Event Description</p>
          <Link to="/event/register">
            <button>Register</button>
          </Link>
          <Link to="/volunteer">
            <button>Volunteer</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MemberEventPage;
