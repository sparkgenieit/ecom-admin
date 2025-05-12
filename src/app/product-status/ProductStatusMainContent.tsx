'use client';

import { useEffect, useState } from 'react';
import {
  fetchProductStatus,
  addProductStatus,
  updateProductStatus,
  deleteProductStatus,
} from './service';
import { ProductStatus } from './types';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import TableActions from '@/components/TableActions';

export default function ProductStatusPage() {
  const [items, setItems] = useState<ProductStatus[]>([]);
  const [formData, setFormData] = useState<Omit<ProductStatus, 'id'>>({ label: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProductStatus();
        setItems(data);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleAdd = () => {
    setFormData({ label: '' });
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = (item: ProductStatus) => {
    setEditingId(item.id!);
    setFormData({ label: item.label });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setConfirmDeleteId(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      const updated = await updateProductStatus(editingId, formData);
      setItems(prev => prev.map(i => (i.id === editingId ? updated : i)));
    } else {
      const added = await addProductStatus(formData);
      setItems(prev => [...prev, added]);
    }
    setShowModal(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Product Status</h1>
      <button onClick={handleAdd} className="mb-4 bg-green-600 text-white px-4 py-2 rounded">
        Add Status
      </button>

      {loading ? (
        <p className="text-gray-600">Loading statuses…</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Label</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(status => (
              <tr key={status.id} className="border-t">
                <td className="px-4 py-2">{status.label}</td>
                <td className="px-4 py-2">
  <TableActions
    onEdit={() => handleEdit(status)}
    onDelete={() => handleDelete(status.id!)}
  />
</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold">{editingId !== null ? 'Edit' : 'Add'} Status</h2>
            <input
              name="label"
              value={formData.label}
              onChange={e => setFormData({ label: e.target.value })}
              placeholder="Label"
              className="border p-2 w-full"
              required
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{editingId !== null ? 'Update' : 'Add'}</button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDeleteModal<ProductStatus>
        itemId={confirmDeleteId}
        deleteFn={deleteProductStatus}
        setItems={setItems}
        isOpen={confirmDeleteId !== null}
        onCancel={() => setConfirmDeleteId(null)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this status?"
      />
    </div>
);
}
