import { Brand } from './types';
import { API_BASE_URL } from '@/lib/constants';

const API_URL = `${API_BASE_URL}/brands`;



/**
 * Retrieve the auth token from localStorage
 */
function getToken() {
  console.log(localStorage.getItem('authToken'));
  return typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
}

export async function fetchBrands(): Promise<Brand[]> {
  const token = getToken();
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch brands');
  return res.json();
}

export async function addBrand(data: Omit<Brand, 'id'>): Promise<Brand> {
  const token = getToken();
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add brand');
  return res.json();
}

export async function updateBrand(id: number, data: Omit<Brand, 'id'>): Promise<Brand> {
  const token = getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update brand');
  return res.json();
}

export async function deleteBrand(id: number): Promise<void> {
  const token = getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to delete brand');
}
