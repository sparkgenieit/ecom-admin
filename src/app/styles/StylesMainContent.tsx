'use client';

import { useEffect, useState } from 'react';
import {
  fetchStyles,
  addStyle,
  updateStyle,
  deleteStyle,
} from './service';
import { Style } from './types';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import TableActions from '@/components/TableActions';

export default function StylesPage() {
  const [items, setItems] = useState<Style[]>([]);
  const [formData, setFormData] = useState<Omit<Style, 'id'>>({
    name: '',
    status: true,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchStyles();
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
    setFormData({ name: '', status: true });
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = (style: Style) => {
    setFormData({ name: style.name, status: style.status });
    setEditingId(style.id!);
    setShowModal(true);
  };

  const handleDelete = (id: number) => setConfirmDeleteId(id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId != null) {
      const updated = await updateStyle(editingId, formData);
      setItems(prev => prev.map(i => (i.id === editingId ? updated : i)));
    } else {
      const added = await addStyle(formData);
      setItems(prev => [...prev, added]);
    }
    closeModals();
  };

  const closeModals = () => {
    setShowModal(false);
    setConfirmDeleteId(null);
    setEditingId(null);
    setFormData({ name: '', status: true });
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Styles</h1>
      <button onClick={handleAdd} className="mb-4 bg-green-600 text-white px-4 py-2 rounded">
        Add Style
      </button>

      {loading ? (
        <p className="text-gray-600">Loading styles…</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(st => (
              <tr key={st.id} className="border-t">
                <td className="px-4 py-2">{st.name}</td>
                <td className="px-4 py-2">{st.status ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2">
  <TableActions
    onEdit={() => handleEdit(style)}
    onDelete={() => handleDelete(style.id!)}
  />
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
              {editingId != null ? 'Edit Style' : 'Add Style'}
            </h2>
            <input
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Name"
              className="border p-2 w-full"
              required
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.status}
                onChange={e => setFormData(prev => ({ ...prev, status: e.target.checked }))}
              />
              Status
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

      <ConfirmDeleteModal<Style>
        itemId={confirmDeleteId}
        deleteFn={deleteStyle}
        setItems={setItems}
        isOpen={confirmDeleteId !== null}
        onCancel={() => setConfirmDeleteId(null)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this style?"
      />
    </div>
);
}
