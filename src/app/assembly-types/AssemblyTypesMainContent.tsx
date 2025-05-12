// src/app/assembly-types/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  fetchAssemblyTypes,
  addAssemblyType,
  updateAssemblyType,
  deleteAssemblyType,
} from './service';
import { AssemblyType } from './types';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';

export default function AssemblyTypesPage() {
  const [items, setItems] = useState<AssemblyType[]>([]);
  const [formData, setFormData] = useState<Omit<AssemblyType, 'id'>>({ name: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Load assembly types on mount
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAssemblyTypes();
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

  // Open add form
  const handleAdd = () => {
    setFormData({ name: '' });
    setEditingId(null);
    setShowModal(true);
  };

  // Open edit form
  const handleEdit = (item: AssemblyType) => {
    setEditingId(item.id!);
    setFormData({ name: item.name });
    setShowModal(true);
  };

  // Trigger delete confirmation
  const handleDelete = (id: number) => {
    setConfirmDeleteId(id);
  };

  // Submit add/update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      const updated = await updateAssemblyType(editingId, formData);
      setItems(prev => prev.map(i => (i.id === editingId ? updated : i)));
    } else {
      const added = await addAssemblyType(formData);
      setItems(prev => [...prev, added]);
    }
    setShowModal(false);
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ name: e.target.value });
  };

  // Close both modals
  const closeModals = () => {
    setShowModal(false);
    setConfirmDeleteId(null);
    setEditingId(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Assembly Types</h1>
      <button
        onClick={handleAdd}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Add Assembly Type
      </button>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id!)}
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

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow-lg w-full max-w-md space-y-4"
          >
            <h2 className="text-xl font-bold">
              {editingId !== null ? 'Edit' : 'Add'} Assembly Type
            </h2>
            <input
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="border p-2 w-full"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModals}
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
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal<AssemblyType>
        itemId={confirmDeleteId}
        deleteFn={deleteAssemblyType}
        setItems={setItems}
        isOpen={confirmDeleteId !== null}
        onCancel={() => setConfirmDeleteId(null)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this assembly type?"
      />
    </div>
  );
}
