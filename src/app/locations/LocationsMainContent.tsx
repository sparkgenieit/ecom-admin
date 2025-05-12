'use client';

import { useEffect, useState } from 'react';
import {
  fetchLocations,
  addLocation,
  updateLocation,
  deleteLocation,
} from './service';
import { Location } from './types';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';

export default function LocationsPage() {
  const [items, setItems] = useState<Location[]>([]);
  const [formData, setFormData] = useState<Omit<Location, 'id'>>({
    state: '',
    city: '',
    pincode: '',
    is_serviceable: true,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchLocations();
        setItems(data);
      } catch (err) {
        console.error(err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleAdd = () => {
    setFormData({ state: '', city: '', pincode: '', is_serviceable: true });
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = (loc: Location) => {
    setEditingId(loc.id!);
    setFormData({
      state: loc.state,
      city: loc.city,
      pincode: loc.pincode,
      is_serviceable: loc.is_serviceable,
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setConfirmDeleteId(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId != null) {
      const updated = await updateLocation(editingId, formData);
      setItems(prev => prev.map(i => (i.id === editingId ? updated : i)));
    } else {
      const added = await addLocation(formData);
      setItems(prev => [...prev, added]);
    }
    closeModals();
  };

  const closeModals = () => {
    setShowModal(false);
    setConfirmDeleteId(null);
    setEditingId(null);
    setFormData({ state: '', city: '', pincode: '', is_serviceable: true });
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Locations</h1>
      <button onClick={handleAdd} className="mb-4 bg-green-600 text-white px-4 py-2 rounded">
        Add Location
      </button>

      {loading ? (
        <p className="text-gray-600">Loading locations…</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">State</th>
              <th className="px-4 py-2 text-left">City</th>
              <th className="px-4 py-2 text-left">Pincode</th>
              <th className="px-4 py-2 text-left">Serviceable</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(loc => (
              <tr key={loc.id} className="border-t">
                <td className="px-4 py-2">{loc.state}</td>
                <td className="px-4 py-2">{loc.city}</td>
                <td className="px-4 py-2">{loc.pincode}</td>
                <td className="px-4 py-2">{loc.is_serviceable ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => handleEdit(loc)} className="px-3 py-1 bg-yellow-500 text-white rounded">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(loc.id!)} className="px-3 py-1 bg-red-600 text-white rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold">{editingId != null ? 'Edit Location' : 'Add Location'}</h2>
            <input
              value={formData.state}
              onChange={e => setFormData(prev => ({ ...prev, state: e.target.value }))}
              placeholder="State"
              className="border p-2 w-full"
              required
            />
            <input
              value={formData.city}
              onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
              placeholder="City"
              className="border p-2 w-full"
              required
            />
            <input
              value={formData.pincode}
              onChange={e => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
              placeholder="Pincode"
              className="border p-2 w-full"
              required
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_serviceable}
                onChange={e => setFormData(prev => ({ ...prev, is_serviceable: e.target.checked }))}
              />
              Serviceable
            </label>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={closeModals} className="px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                {editingId != null ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDeleteModal<Location>
        itemId={confirmDeleteId}
        deleteFn={deleteLocation}
        setItems={setItems}
        isOpen={confirmDeleteId !== null}
        onCancel={() => setConfirmDeleteId(null)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this location?"
      />
    </div>
  );
}
