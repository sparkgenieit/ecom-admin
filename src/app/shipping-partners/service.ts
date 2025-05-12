import { ShippingPartner } from './types';
import { API_BASE_URL } from '@/lib/constants';

const API_URL = `${API_BASE_URL}/shipping-partners`;

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
}

export async function fetchShippingPartners(): Promise<ShippingPartner[]> {
  const token = getToken();
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch shipping-partners');
  return res.json();
}

export async function addShippingPartner(data: Omit<ShippingPartner, 'id'>): Promise<ShippingPartner> {
  const token = getToken();
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add Shipping Partners');
  return res.json();
}

export async function updateShippingPartner(id: number, data: Omit<ShippingPartner, 'id'>): Promise<ShippingPartner> {
  const token = getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update Shipping Partners');
  return res.json();
}

export async function deleteShippingPartner(id: number): Promise<void> {
  const token = getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete Shipping Partners');
}