import { Category } from './types';

import { API_BASE_URL } from '@/lib/constants';
const API_URL = `${API_BASE_URL}/categories`;



function getToken() {
  console.log(localStorage.getItem('authToken'));
  return typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
}

export async function fetchFilterTypes(): Promise<{ id: number; name: string }[]> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/filter-types`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function fetchFeatureTypes(): Promise<{ id: number; name: string }[]> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/feature-types`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}


export async function fetchCategories(): Promise<Category[]> {
  const token = getToken();
  const res = await fetch(API_URL, {
    headers: { 'Authorization': `Bearer ${token}` },
    cache: 'no-store',
  });

  console.log(res.json);
  return res.json();
}

export async function addCategory(data: Category): Promise<Category> {
  const token = getToken();
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateCategory(id: number, data: Category): Promise<Category> {
  const token = getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteCategory(id: number): Promise<void> {
  const token = getToken();
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
}
