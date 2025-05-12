'use client';


import { useEffect, useState } from 'react';
import {
  fetchShippingPartners,
  addShippingPartner,
  updateShippingPartner,
  deleteShippingPartner,
} from './service';
import { ShippingPartner } from './types';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import TableActions from '@/components/TableActions';

export default function ShippingPartnersPage() {
  const [items, setItems] = useState<ShippingPartner[]>([]);
  const [formData, setFormData] = useState<Omit<ShippingPartner, 'id'>>({
    name: '',
    api_key: '',
    contact_email: '',
    status: true,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchShippingPartners();
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
    setFormData({ name: '', api_key: '', contact_email: '', status: true });
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = (partner: ShippingPartner) => {
    setFormData({
      name: partner.name,
      api_key: partner.api_key,
      contact_email: partner.contact_email,
      status: partner.status,
    });
    setEditingId(partner.id!);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setConfirmDeleteId(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId != null) {
      const updated = await updateShippingPartner(editingId, formData);
      setItems(prev => prev.map(i => (i.id === editingId ? updated : i)));
    } else {
      const added = await addShippingPartner(formData);
      setItems(prev => [...prev, added]);
    }
    closeModals();
  };

  const closeModals = () => {
    setShowModal(false);
    setConfirmDeleteId(null);
    setEditingId(null);
    setFormData({ name: '', api_key: '', contact_email: '', status: true });
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Shipping Partners</h1>
      <button onClick={handleAdd} className="mb-4 bg-green-600 text-white px-4 py-2 rounded">
        Add Shipping Partner
      </button>

      {loading ? (
        <p className="text-gray-600">Loading shipping partners…</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">API Key</th>
              <th className="px-4 py-2 text-left">Contact Email</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(sp => (
              <tr key={sp.id} className="border-t">
                <td className="px-4 py-2">{sp.name}</td>
                <td className="px-4 py-2 break-all">{sp.api_key}</td>
                <td className="px-4 py-2">{sp.contact_email}</td>
                <td className="px-4 py-2">{sp.status ? 'Yes' : 'No'}</td>
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
              {editingId != null ? 'Edit Shipping Partner' : 'Add Shipping Partner'}
            </h2>
            <input
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Name"
              className="border p-2 w-full"
              required
            />
            <input
              value={formData.api_key}
              onChange={e => setFormData(prev => ({ ...prev, api_key: e.target.value }))}
              placeholder="API Key"
              className="border p-2 w-full break-all"
              required
            />
            <input
              type="email"
              value={formData.contact_email}
              onChange={e => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
              placeholder="Contact Email"
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

      <ConfirmDeleteModal<ShippingPartner>
        itemId={confirmDeleteId}
        deleteFn={deleteShippingPartner}
        setItems={setItems}
        isOpen={confirmDeleteId !== null}
        onCancel={() => setConfirmDeleteId(null)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this shipping partner?"
      />
    </div>
  );
}
