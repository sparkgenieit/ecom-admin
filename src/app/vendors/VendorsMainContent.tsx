// src/app/vendors/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  fetchVendors,
  addVendor,
  updateVendor,
  deleteVendor,
} from './service';
import { Vendor } from './types';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import TableActions from '@/components/TableActions';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [formData, setFormData] = useState<Omit<Vendor, 'id'>>({
    name: '',
    contact_email: '',
    phone: '',
    address: '',
    status: true,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Load vendors on mount
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchVendors();
        setVendors(data);
      } catch (err) {
        console.error(err);
        setVendors([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Open add form
  const handleAdd = () => {
    setFormData({ name: '', contact_email: '', phone: '', address: '', status: true });
    setEditingId(null);
    setShowModal(true);
  };

  // Open edit form
  const handleEdit = (vendor: Vendor) => {
    setEditingId(vendor.id!);
    setFormData({
      name: vendor.name,
      contact_email: vendor.contact_email,
      phone: vendor.phone,
      address: vendor.address,
      status: vendor.status,
    });
    setShowModal(true);
  };

  // Trigger delete confirmation
  const handleDelete = (id: number) => {
    setConfirmDeleteId(id);
  };

  // Submit add/edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      const updated = await updateVendor(editingId, formData);
      setVendors(prev => prev.map(v => (v.id === editingId ? updated : v)));
    } else {
      const added = await addVendor(formData);
      setVendors(prev => [...prev, added]);
    }
    setShowModal(false);
  };

  // Form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Vendors</h1>
      <button
        onClick={handleAdd}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Add Vendor
      </button>

      {loading ? (
        <p className="text-gray-600">Loading vendors...</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Address</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map(vendor => (
              <tr key={vendor.id} className="border-t">
                <td className="px-4 py-2">{vendor.name}</td>
                <td className="px-4 py-2">{vendor.contact_email}</td>
                <td className="px-4 py-2">{vendor.phone}</td>
                <td className="px-4 py-2">{vendor.address}</td>
                <td className="px-4 py-2">{vendor.status ? 'Active' : 'Inactive'}</td>
                <td className="px-4 py-2">
  <TableActions
    onEdit={() => handleEdit(vendor)}
    onDelete={() => handleDelete(vendor.id!)}
  />
</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingId !== null ? 'Edit' : 'Add'} Vendor
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-red-500 text-2xl"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
              <input
                name="contact_email"
                type="email"
                placeholder="Email"
                value={formData.contact_email}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
              <input
                name="phone"
                type="text"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
              <input
                name="address"
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
              <label className="flex items-center gap-2">
                <input
                  name="status"
                  type="checkbox"
                  checked={formData.status}
                  onChange={handleChange}
                />
                Active
              </label>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {editingId !== null ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal<Vendor>
        itemId={confirmDeleteId}
        deleteFn={deleteVendor}
        setItems={setVendors}
        isOpen={confirmDeleteId !== null}
        onCancel={() => setConfirmDeleteId(null)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this vendor?"
      />
    </div>
  );
}
