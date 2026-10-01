import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getEntries = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getEntry = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createEntry = async (entryData) => {
  const response = await axios.post(API_URL, entryData);
  return response.data;
};

export const updateEntry = async (id, entryData) => {
  const response = await axios.patch(`${API_URL}/${id}`, entryData);
  return response.data;
};

export const deleteEntry = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
