'use client';

import { useEffect, useState } from 'react';
import {
  fetchWarranties,
  addWarranty,
  updateWarranty,
  deleteWarranty,
} from './service';
import { Warranty } from './types';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';

export default function WarrantiesPage() {
  const [items, setItems] = useState<Warranty[]>([]);
  const [formData, setFormData] = useState<Omit<Warranty, 'id'>>({
    duration_months: 0,
    description: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchWarranties();
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
    setFormData({ duration_months: 0, description: '' });
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = (w: Warranty) => {
    setFormData({ duration_months: w.duration_months, description: w.description });
    setEditingId(w.id!);
    setShowModal(true);
  };

  const handleDelete = (id: number) => setConfirmDeleteId(id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId != null) {
      const updated = await updateWarranty(editingId, formData);
      setItems(prev => prev.map(i => (i.id === editingId ? updated : i)));
    } else {
      const added = await addWarranty(formData);
      setItems(prev => [...prev, added]);
    }
    closeModals();
  };

  const closeModals = () => {
    setShowModal(false);
    setConfirmDeleteId(null);
    setEditingId(null);
    setFormData({ duration_months: 0, description: '' });
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Warranties</h1>
      <button onClick={handleAdd} className="mb-4 bg-green-600 text-white px-4 py-2 rounded">
        Add Warranty
      </button>

      {loading ? (
        <p className="text-gray-600">Loading warranties…</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Duration (months)</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(w => (
              <tr key={w.id} className="border-t">
                <td className="px-4 py-2">{w.duration_months}</td>
                <td className="px-4 py-2">{w.description}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(w)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(w.id!)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
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
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow-lg w-full max-w-md space-y-4"
          >
            <h2 className="text-xl font-bold">
              {editingId != null ? 'Edit Warranty' : 'Add Warranty'}
            </h2>
            <input
              type="number"
              value={formData.duration_months}
              onChange={e =>
                setFormData(prev => ({ ...prev, duration_months: Number(e.target.value) }))
              }
              placeholder="Duration (months)"
              className="border p-2 w-full"
              required
            />
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description"
              className="border p-2 w-full"
              required
            />
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

      <ConfirmDeleteModal<Warranty>
        itemId={confirmDeleteId}
        deleteFn={deleteWarranty}
        setItems={setItems}
        isOpen={confirmDeleteId !== null}
        onCancel={() => setConfirmDeleteId(null)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this warranty?"
      />
    </div>
  );
}
