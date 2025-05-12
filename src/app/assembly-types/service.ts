import { AssemblyType } from './types';
import { API_BASE_URL } from '@/lib/constants';

const API_URL = `${API_BASE_URL}/assembly-types`;


function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
}

export async function fetchAssemblyTypes(): Promise<AssemblyType[]> {
  const token = getToken();
  const res = await fetch(API_URL, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch assembly types');
  return res.json();
}

export async function addAssemblyType(data: Omit<AssemblyType, 'id'>): Promise<AssemblyType> {
  const token = getToken();
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add assembly type');
  return res.json();
}

export async function updateAssemblyType(id: number, data: Omit<AssemblyType, 'id'>): Promise<AssemblyType> {
  const token = getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update assembly type');
  return res.json();
}

export async function deleteAssemblyType(id: number): Promise<void> {
  const token = getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete assembly type');
}
