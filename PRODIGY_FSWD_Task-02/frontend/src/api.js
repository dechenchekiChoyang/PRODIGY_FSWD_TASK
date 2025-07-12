const API_URL = process.env.REACT_APP_API_URL;

export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const fetchEmployees = async () => {
  const res = await fetch(`${API_URL}/employees`, {
    credentials: 'include',
  });
  return res.json();
};

export const createEmployee = async (employee) => {
  const res = await fetch(`${API_URL}/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(employee),
  });
  return res.json();
};

export const updateEmployee = async (id, employee) => {
  const res = await fetch(`${API_URL}/employees/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(employee),
  });
  return res.json();
};

export const deleteEmployee = async (id) => {
  const res = await fetch(`${API_URL}/employees/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return res.json();
};
