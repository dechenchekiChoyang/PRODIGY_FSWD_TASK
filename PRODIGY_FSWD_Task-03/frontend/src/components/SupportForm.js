import React, { useState } from 'react';
import { createSupportTicket } from '../services/api';

const SupportForm = ({ onSuccess }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await createSupportTicket({ subject, message });
      setMsg('Ticket submitted!');
      setSubject('');
      setMessage('');
      if (onSuccess) onSuccess();
    } catch {
      setMsg('Failed to submit ticket.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" required />
      <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message" required />
      <button type="submit">Submit Ticket</button>
      {msg && <p>{msg}</p>}
    </form>
  );
};

export default SupportForm;
