import Support from '../models/support.model.js';

export async function createTicket(req, res) {
  try {
    const ticket = new Support({ ...req.body, user: req.user._id });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function getTickets(req, res) {
  try {
    const tickets = await Support.find({ user: req.user._id });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getTicketById(req, res) {
  try {
    const ticket = await Support.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    if (ticket.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function respondTicket(req, res) {
  try {
    const ticket = await Support.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    ticket.response = req.body.response;
    ticket.status = 'Closed';
    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
