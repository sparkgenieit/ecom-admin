// src/app/categories/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  fetchFilterTypes,
  fetchFeatureTypes,
} from './service';
import { Category } from './types';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import TableActions from '@/components/TableActions';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterTypes, setFilterTypes] = useState<{ id: number; name: string }[]>([]);
  const [featureTypes, setFeatureTypes] = useState<{ id: number; name: string }[]>([]);
  const [formData, setFormData] = useState<Category>({
    title: '',
    parent_id: null,
    position: 1,
    status: true,
    frontDisplay: '',
    appIcon: '',
    webImage: '',
    mainImage: '',
    filterTypeId: 1,
    featureTypeId: 1,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [filters, features, cats] = await Promise.all([
          fetchFilterTypes(),
          fetchFeatureTypes(),
          fetchCategories(),
        ]);
        setFilterTypes(filters);
        setFeatureTypes(features);
        setCategories(Array.isArray(cats) ? cats : []);
      } catch {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      const updated = await updateCategory(editingId, formData);
      setCategories(prev => prev.map(cat => (cat.id === editingId ? updated : cat)));
      setEditingId(null);
    } else {
      const newCategory = await addCategory(formData);
      setCategories(prev => [...prev, newCategory]);
    }
    resetForm();
    setShowModal(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      parent_id: null,
      position: 1,
      status: true,
      frontDisplay: '',
      appIcon: '',
      webImage: '',
      mainImage: '',
      filterTypeId: 1,
      featureTypeId: 1,
    });
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id ?? null);
    setFormData({ ...cat });
    setShowModal(true);
  };

  const handleAddNew = () => {
    resetForm();
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setConfirmDeleteId(id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    let parsedValue: any;
    if (type === 'checkbox') {
      parsedValue = checked;
    } else if (type === 'number') {
      parsedValue = Number(value);
    } else if (['parent_id', 'filterTypeId', 'featureTypeId'].includes(name)) {
      parsedValue = value === '' ? null : Number(value);
    } else {
      parsedValue = value;
    }
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Categories</h1>

      <button
        onClick={handleAddNew}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Add Category
      </button>

      {loading ? (
        <p className="text-gray-600">Loading categories...</p>
      ) : (
        <ul className="space-y-2">
          {categories.length > 0 ? (
            categories.map(cat => (
              <li
                key={cat.id}
                className="border p-3 rounded flex justify-between items-center"
              >
                <span>{cat.title}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="px-3 py-1 text-sm bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id!)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No categories found.</li>
          )}
        </ul>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingId !== null ? 'Edit' : 'Add'} Category
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-red-500 text-2xl"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                name="title"
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                className="border p-2"
                required
              />
              <select
                name="parent_id"
                value={formData.parent_id ?? ''}
                onChange={handleChange}
                className="border p-2"
              >
                <option value="">No Parent</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
              <input
                name="position"
                type="number"
                placeholder="Position"
                value={formData.position}
                onChange={handleChange}
                className="border p-2"
              />
              <input
                name="frontDisplay"
                type="text"
                placeholder="Front Display"
                value={formData.frontDisplay}
                onChange={handleChange}
                className="border p-2"
              />
              <input
                name="appIcon"
                type="text"
                placeholder="App Icon"
                value={formData.appIcon}
                onChange={handleChange}
                className="border p-2"
              />
              <input
                name="webImage"
                type="text"
                placeholder="Web Image URL"
                value={formData.webImage}
                onChange={handleChange}
                className="border p-2"
              />
              <input
                name="mainImage"
                type="text"
                placeholder="Main Image URL"
                value={formData.mainImage}
                onChange={handleChange}
                className="border p-2"
              />
              <div>
                <label className="block mb-1 font-medium">Filter Type</label>
                <select
                  name="filterTypeId"
                  value={formData.filterTypeId}
                  onChange={handleChange}
                  className="border p-2 w-full"
                >
                  {filterTypes.map(ft => (
                    <option key={ft.id} value={ft.id}>
                      {ft.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Feature Type</label>
                <select
                  name="featureTypeId"
                  value={formData.featureTypeId}
                  onChange={handleChange}
                  className="border p-2 w-full"
                >
                  {featureTypes.map(ft => (
                    <option key={ft.id} value={ft.id}>
                      {ft.name}
                    </option>
                  ))}
                </select>
              </div>
              <label className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  name="status"
                  checked={formData.status}
                  onChange={handleChange}
                />
                Active
              </label>
              <button
                type="submit"
                className="col-span-2 bg-blue-600 text-white px-4 py-2 rounded"
              >
                {editingId !== null ? 'Update Category' : 'Add Category'}
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteModal<Category>
        itemId={confirmDeleteId}
        deleteFn={deleteCategory}
        setItems={setCategories}
        isOpen={confirmDeleteId !== null}
        onCancel={() => setConfirmDeleteId(null)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this category?"
      />
    </div>
  );
}
