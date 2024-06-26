import React from 'react';
import { Link } from 'react-router-dom';
import './Event.css';

function Event() {
  return (
    <div className="event-page">
      <h1>Event Page</h1>
      <div className="event-list">
        <div className="event-item">
          <h2>Event Title 1</h2>
          <p>Event Description</p>
          <Link to="/volunteer">
            <button>Volunteer</button>
          </Link>
          <button>Register</button>
        </div>
        <div className="event-item">
          <h2>Event Title 2</h2>
          <p>Event Description</p>
          <Link to="/volunteer">
            <button>Volunteer</button>
          </Link>
          <button>Register</button>
        </div>
      </div>
    </div>
  );
}

export default Event;
