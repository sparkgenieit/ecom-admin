// size-uom/page.tsx

'use client';

import { useEffect, useState } from 'react';
import {
  fetchSizeUoms,
  addSizeUom,
  updateSizeUom,
  deleteSizeUom,
} from './service';
import { SizeUom } from './types';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import TableActions from '@/components/TableActions';

export default function SizeUomPage() {
  const [items, setItems] = useState<SizeUom[]>([]);
  const [formData, setFormData] = useState<Omit<SizeUom, 'id'>>({
    title: '',
    status: false,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchSizeUoms();
        setItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleAdd = () => {
    setFormData({ title: '', status: false });
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = (uom: SizeUom) => {
    setEditingId(uom.id!);
    setFormData({ title: uom.title, status: uom.status });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setConfirmDeleteId(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId != null) {
        const updated = await updateSizeUom(editingId, formData);
        setItems(prev => prev.map(i => (i.id === editingId ? updated : i)));
      } else {
        const added = await addSizeUom(formData);
        setItems(prev => [...prev, added]);
      }
    } catch (err) {
      console.error(err);
    }
    closeModals();
  };

  const closeModals = () => {
    setShowModal(false);
    setConfirmDeleteId(null);
    setEditingId(null);
    setFormData({ title: '', status: false });
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Size UOM</h1>
      <button
        onClick={handleAdd}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Add Size UOM
      </button>

      {loading ? (
        <p className="text-gray-600">Loading size UOMs…</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(uom => (
              <tr key={uom.id} className="border-t">
                <td className="px-4 py-2">{uom.title}</td>
                <td className="px-4 py-2">
                  {uom.status ? 'Active' : 'Inactive'}
                </td>
                <td className="px-4 py-2">
  <TableActions
    onEdit={() => handleEdit(item)}
    onDelete={() => handleDelete(item.id!)}
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
              {editingId != null ? 'Edit Size UOM' : 'Add Size UOM'}
            </h2>
            <input
              value={formData.title}
              onChange={e =>
                setFormData(prev => ({ ...prev, title: e.target.value }))
              }
              placeholder="Title"
              className="border p-2 w-full"
              required
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.status}
                onChange={e =>
                  setFormData(prev => ({ ...prev, status: e.target.checked }))
                }
                className="form-checkbox"
              />
              <span>Status (Active?)</span>
            </label>
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
                {editingId != null ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDeleteModal<SizeUom>
        itemId={confirmDeleteId}
        deleteFn={deleteSizeUom}
        setItems={setItems}
        isOpen={confirmDeleteId !== null}
        onCancel={() => setConfirmDeleteId(null)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this size UOM?"
      />
    </div>
  );
}
