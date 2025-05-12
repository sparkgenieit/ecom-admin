import { ProductStatus } from './types';
import { API_BASE_URL } from '@/lib/constants';

const API_URL = `${API_BASE_URL}/product-status`;

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
}

export async function fetchProductStatus(): Promise<ProductStatus[]> {
  const token = getToken();
  const res = await fetch(API_URL, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch product status');
  return res.json();
}

export async function addProductStatus(data: Omit<ProductStatus, 'id'>): Promise<ProductStatus> {
  const token = getToken();
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add product status');
  return res.json();
}

export async function updateProductStatus(id: number, data: Omit<ProductStatus, 'id'>): Promise<ProductStatus> {
  const token = getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update product status');
  return res.json();
}

export async function deleteProductStatus(id: number): Promise<void> {
  const token = getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete product status');
}
