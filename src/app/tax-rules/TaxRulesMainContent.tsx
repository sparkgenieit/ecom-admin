// tax-rules/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  fetchTaxRules,
  addTaxRule,
  updateTaxRule,
  deleteTaxRule,
} from './service';
import { TaxRule } from './types';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import TableActions from '@/components/TableActions';

export default function TaxRulesPage() {
  const [items, setItems] = useState<TaxRule[]>([]);
  const [formData, setFormData] = useState<Omit<TaxRule, 'id'>>({
    name: '',
    percentage: 0,
    applicable_on: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchTaxRules();
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
    setFormData({ name: '', percentage: 0, applicable_on: '' });
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = (rule: TaxRule) => {
    setEditingId(rule.id!);
    setFormData({
      name: rule.name,
      percentage: rule.percentage,
      applicable_on: rule.applicable_on,
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setConfirmDeleteId(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId != null) {
        const updated = await updateTaxRule(editingId, formData);
        setItems(prev => prev.map(i => (i.id === editingId ? updated : i)));
      } else {
        const added = await addTaxRule(formData);
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
    setFormData({ name: '', percentage: 0, applicable_on: '' });
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Tax Rules</h1>
      <button
        onClick={handleAdd}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Add Tax Rule
      </button>

      {loading ? (
        <p className="text-gray-600">Loading tax rules…</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Percentage</th>
              <th className="px-4 py-2 text-left">Applicable On</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(rule => (
              <tr key={rule.id} className="border-t">
                <td className="px-4 py-2">{rule.name}</td>
                <td className="px-4 py-2">{rule.percentage}</td>
                <td className="px-4 py-2">{rule.applicable_on}</td>
                <td className="px-4 py-2">
  <TableActions
    onEdit={() => handleEdit(rule)}
    onDelete={() => handleDelete(rule.id!)}
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
              {editingId != null ? 'Edit Tax Rule' : 'Add Tax Rule'}
            </h2>
            <input
              value={formData.name}
              onChange={e =>
                setFormData(prev => ({ ...prev, name: e.target.value }))
              }
              placeholder="Name"
              className="border p-2 w-full"
              required
            />
            <input
              type="number"
              value={formData.percentage}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  percentage: parseFloat(e.target.value),
                }))
              }
              placeholder="Percentage"
              className="border p-2 w-full"
              required
            />
            <select
              value={formData.applicable_on}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  applicable_on: e.target.value,
                }))
              }
              className="border p-2 w-full"
              required
            >
              <option value="">Select Applicable On</option>
              <option value="MRP">MRP</option>
              <option value="Discounted">Discounted</option>
            </select>
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

      <ConfirmDeleteModal<TaxRule>
        itemId={confirmDeleteId}
        deleteFn={deleteTaxRule}
        setItems={setItems}
        isOpen={confirmDeleteId !== null}
        onCancel={() => setConfirmDeleteId(null)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this tax rule?"
      />
    </div>
  );
}
