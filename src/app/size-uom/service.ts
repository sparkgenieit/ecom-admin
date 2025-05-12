// size-uom/service.ts

import { SizeUom } from './types';
import { API_BASE_URL } from '@/lib/constants';

const API_URL = `${API_BASE_URL}/size-uom`;

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
}

export async function fetchSizeUoms(): Promise<SizeUom[]> {
  const token = getToken();
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch size UOMs');
  return res.json();
}

export async function addSizeUom(data: Omit<SizeUom, 'id'>): Promise<SizeUom> {
  const token = getToken();
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add size UOM');
  return res.json();
}

export async function updateSizeUom(id: number, data: Omit<SizeUom, 'id'>): Promise<SizeUom> {
  const token = getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update size UOM');
  return res.json();
}

export async function deleteSizeUom(id: number): Promise<void> {
  const token = getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete size UOM');
}
