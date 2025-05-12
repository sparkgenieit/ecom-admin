import { Warranty } from './types';
import { API_BASE_URL } from '@/lib/constants';

const API_URL = `${API_BASE_URL}/warranties`;

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
}

export async function fetchWarranties(): Promise<Warranty[]> {
  const token = getToken();
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch warranties');
  return res.json();
}

export async function addWarranty(data: Omit<Warranty, 'id'>): Promise<Warranty> {
  const token = getToken();
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add Warranties');
  return res.json();
}

export async function updateWarranty(id: number, data: Omit<Warranty, 'id'>): Promise<Warranty> {
  const token = getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update Warranties');
  return res.json();
}

export async function deleteWarranty(id: number): Promise<void> {
  const token = getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete Warranties');
}