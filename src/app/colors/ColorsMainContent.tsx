'use client';

import { useEffect, useState } from 'react';
import { fetchColors, addColor, updateColor, deleteColor } from './service';
import { Color } from './types';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import TableActions from '@/components/TableActions';


export default function ColorsPage() {
  const [items, setItems] = useState<Color[]>([]);
  const [formData, setFormData] = useState<Omit<Color, 'id'>>({
    name: '',
    hex_code: '',
    status: true,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchColors();
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
    setFormData({ name: '', hex_code: '', status: true });
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = (item: Color) => {
    setEditingId(item.id!);
    setFormData({ name: item.name, hex_code: item.hex_code, status: item.status });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setConfirmDeleteId(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      const updated = await updateColor(editingId, formData);
      setItems(prev => prev.map(i => (i.id === editingId ? updated : i)));
    } else {
      const added = await addColor(formData);
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
      <h1 className="text-xl font-bold mb-4">Colors</h1>
      <button onClick={handleAdd} className="mb-4 bg-green-600 text-white px-4 py-2 rounded">
        Add Color
      </button>

      {loading ? (
        <p className="text-gray-600">Loading colors…</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Hex Code</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(color => (
              <tr key={color.id} className="border-t">
                <td className="px-4 py-2">{color.name}</td>
                <td className="px-4 py-2">{color.hex_code}</td>
                <td className="px-4 py-2">{color.status ? 'Active' : 'Inactive'}</td>
                  <td className="px-4 py-2">
                    <TableActions
                      onEdit={() => handleEdit(color)}
                      onDelete={() => handleDelete(color.id!)}
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
            <h2 className="text-xl font-bold">{editingId !== null ? 'Edit' : 'Add'} Color</h2>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="border p-2 w-full"
              required
            />
            <input
              name="hex_code"
              value={formData.hex_code}
              onChange={handleChange}
              placeholder="#FFFFFF"
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
      <ConfirmDeleteModal<Color>
        itemId={confirmDeleteId}
        deleteFn={deleteColor}
        setItems={setItems}
        isOpen={confirmDeleteId !== null}
        onCancel={() => setConfirmDeleteId(null)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this color?"
      />
    </div>
  );
}
