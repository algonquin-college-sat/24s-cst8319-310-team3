import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EventManagement.css';

function EventManagement() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await axios.get('/api/events');
      setEvents(response.data);
    };

    fetchEvents();
  }, []);

  return (
    <div className="event-management">
      <h1>Event Management</h1>
      <button>Add Event</button>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event.id}>
              <td>{event.title}</td>
              <td>{event.description}</td>
              <td>{event.date}</td>
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

export default EventManagement;
