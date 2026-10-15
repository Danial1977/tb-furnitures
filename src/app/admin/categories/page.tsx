'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Layers, Plus, Edit, Trash2, Search, X, Check } from 'lucide-react';

export default function AdminCategoriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<any | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/admin/categories');
  }, [status, router]);

  const loadCategories = () => {
    setLoading(true);
    fetch('/api/admin/categories')
      .then((r) => r.json())
      .then((res) => {
        setCategories(res.categories || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (session) loadCategories();
  }, [session]);

  const handleOpenAdd = () => {
    setEditingCat(null);
    setFormData({ name: '', slug: '', description: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (c: any) => {
    setEditingCat(c);
    setFormData({ name: c.name, slug: c.slug, description: c.description || '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingCat) {
      await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingCat.id, ...formData }),
      });
    } else {
      await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    }

    setModalOpen(false);
    loadCategories();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      loadCategories();
    } else {
      alert(data.error || 'Cannot delete category with associated products.');
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            Taxonomy & Navigation
          </span>
          <h1 className="font-editorial text-3xl font-bold text-charcoal-900 mt-1">
            Categories Master List
          </h1>
          <p className="text-xs text-gray-500">
            Manage room collections, URL slugs, and hierarchy for storefront navigation.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-charcoal-900 hover:bg-brand-900 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Add New Category
        </button>
      </div>

      {/* Categories Table View */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase font-semibold">
                <th className="py-3.5 px-4">Category Name</th>
                <th className="py-3.5 px-4">Slug (URL Path)</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Associated Products</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="py-4 px-4 bg-gray-50/20" />
                  </tr>
                ))
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    No categories found. Click 'Add New Category' above.
                  </td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr key={c.id} className="hover:bg-brand-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-charcoal-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-brand-600" />
                      <span>{c.name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-600">/categories/{c.slug}</td>
                    <td className="py-3.5 px-4 text-gray-500 max-w-sm truncate">{c.description || '—'}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block bg-brand-50 text-brand-800 font-semibold px-2.5 py-0.5 rounded-full text-[11px]">
                        {c._count?.products || 0} Products
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-charcoal-900 transition-colors"
                        title="Edit Category"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.name)}
                        className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-editorial text-lg font-bold text-charcoal-900">
                {editingCat ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-charcoal-800 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Hallway & Storage"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal-800 mb-1">URL Slug (Optional)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. hallway-storage"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal-800 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this furniture category..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-charcoal-900 hover:bg-brand-900 text-white font-semibold transition-colors"
                >
                  {editingCat ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
