'use client';

import { useEffect, useState } from 'react';
import { fetchMaterials, addMaterial, updateMaterial, deleteMaterial } from './service';
import { Material } from './types';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import TableActions from '@/components/TableActions';

export default function MaterialsPage() {
  const [items, setItems] = useState<Material[]>([]);
  const [formData, setFormData] = useState<Omit<Material, 'id'>>({
    name: '',
    status: true,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchMaterials();
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
    setFormData({ name: '', status: true });
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = (item: Material) => {
    setEditingId(item.id!);
    setFormData({ name: item.name, status: item.status });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setConfirmDeleteId(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      const updated = await updateMaterial(editingId, formData);
      setItems(prev => prev.map(i => (i.id === editingId ? updated : i)));
    } else {
      const added = await addMaterial(formData);
      setItems(prev => [...prev, added]);
    }
    setShowModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Materials</h1>
      <button onClick={handleAdd} className="mb-4 bg-green-600 text-white px-4 py-2 rounded">
        Add Material
      </button>

      {loading ? (
        <p className="text-gray-600">Loading materials…</p>
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
            {items.map(item => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.status ? 'Active' : 'Inactive'}</td>
                <td className="px-4 py-2">
  <TableActions
    onEdit={() => handleEdit(material)}
    onDelete={() => handleDelete(material.id!)}
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
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold">{editingId !== null ? 'Edit' : 'Add'} Material</h2>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="border p-2 w-full"
              required
            />
            <label className="flex items-center gap-2">
              <input name="status" type="checkbox" checked={formData.status} onChange={handleChange} />
              Active
            </label>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                {editingId !== null ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal<Material>
        itemId={confirmDeleteId}
        deleteFn={deleteMaterial}
        setItems={setItems}
        isOpen={confirmDeleteId !== null}
        onCancel={() => setConfirmDeleteId(null)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this material?"
      />
    </div>
);
}
