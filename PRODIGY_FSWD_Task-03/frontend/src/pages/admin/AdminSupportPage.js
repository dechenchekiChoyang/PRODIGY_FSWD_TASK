import React, { useEffect, useState } from 'react';
import { getSupportTickets, respondSupportTicket } from '../../services/api';

const AdminSupportPage = () => {
  const [tickets, setTickets] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getSupportTickets().then(setTickets);
  }, []);

  const handleRespond = async (id) => {
    const response = prompt('Enter your response:');
    if (response) {
      await respondSupportTicket(id, { response });
      setTickets(tickets.map(t => t._id === id ? { ...t, response, status: 'Closed' } : t));
      setMsg('Response sent!');
    }
  };

  return (
    <div>
      <h1>Manage Support Tickets</h1>
      {msg && <p>{msg}</p>}
      <ul>
        {tickets.map(t => (
          <li key={t._id}>
            <strong>{t.subject}</strong> - Status: {t.status}<br/>
            {t.message}<br/>
            {t.response ? <em>Response: {t.response}</em> : <button onClick={() => handleRespond(t._id)}>Respond</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSupportPage;
