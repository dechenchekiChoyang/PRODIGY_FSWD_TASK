import React, { useState, useEffect } from 'react';
import { createSupportTicket, getSupportTickets } from '../services/api';

const SupportPage = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState([]);
  const [responseMsg, setResponseMsg] = useState('');

  useEffect(() => {
    getSupportTickets().then(setTickets);
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await createSupportTicket({ subject, message });
      setResponseMsg('Ticket submitted!');
      setSubject('');
      setMessage('');
      getSupportTickets().then(setTickets);
    } catch {
      setResponseMsg('Failed to submit ticket.');
    }
  };

  return (
    <div>
      <h1>Customer Support</h1>
      <form onSubmit={handleSubmit}>
        <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" required />
        <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message" required />
        <button type="submit">Submit Ticket</button>
      </form>
      {responseMsg && <p>{responseMsg}</p>}
      <h2>Your Tickets</h2>
      {tickets.length === 0 ? <p>No tickets found.</p> : (
        <ul>
          {tickets.map(ticket => (
            <li key={ticket._id}>
              <strong>{ticket.subject}</strong> - Status: {ticket.status}<br/>
              {ticket.message}<br/>
              {ticket.response && <em>Response: {ticket.response}</em>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SupportPage;
