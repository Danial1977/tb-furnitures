'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import {
  Package,
  Search,
  Plus,
  Download,
  Upload,
  RefreshCw,
  Edit,
  Trash2,
  X,
  Check,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { formatGBP } from '@/lib/utils';
import Link from 'next/link';

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit / Add Modal State
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    sku: '',
    price: '',
    compareAtPrice: '',
    stockOnHand: '15',
    status: 'ACTIVE',
    primaryImage: '',
    description: '',
    isLargeItem: false,
  });

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/admin/products');
  }, [status, router]);

  const loadProducts = () => {
    setLoading(true);
    fetch(
      `/api/admin/products?search=${encodeURIComponent(search)}&category=${selectedCategory}&status=${selectedStatus}`
    )
      .then((r) => r.json())
      .then((res) => {
        setProducts(res.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (session) loadProducts();
  }, [session, search, selectedCategory, selectedStatus]);

  // Open Edit Modal
  const handleOpenEdit = (p: any) => {
    setIsAddMode(false);
    setFormError('');
    setEditForm({
      id: p.id,
      name: p.name || '',
      sku: p.sku || '',
      price: String(p.price || ''),
      compareAtPrice: p.compareAtPrice ? String(p.compareAtPrice) : '',
      stockOnHand: String(p.variants?.[0]?.stockOnHand ?? 15),
      status: p.status || 'ACTIVE',
      primaryImage: p.primaryImage || '',
      description: p.description || '',
      isLargeItem: Boolean(p.isLargeItem),
    });
    setEditingProduct(p);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setIsAddMode(true);
    setFormError('');
    setEditForm({
      id: '',
      name: '',
      sku: `TBF-${Math.floor(1000 + Math.random() * 9000)}`,
      price: '',
      compareAtPrice: '',
      stockOnHand: '20',
      status: 'ACTIVE',
      primaryImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
      description: 'Handcrafted luxury British furniture piece made to order.',
      isLargeItem: false,
    });
    setEditingProduct({});
  };

  // Save changes
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');

    try {
      if (isAddMode) {
        // Create via bulk rows API endpoint with 1 row
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rows: [
              {
                sku: editForm.sku,
                name: editForm.name,
                price: editForm.price,
                compareAtPrice: editForm.compareAtPrice || null,
                stock: editForm.stockOnHand,
                primaryImage: editForm.primaryImage,
                description: editForm.description,
              },
            ],
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Failed to create product');
      } else {
        const res = await fetch('/api/admin/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editForm),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Failed to update product');
      }

      setEditingProduct(null);
      loadProducts();
    } catch (err: any) {
      setFormError(err.message || 'Error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (p: any) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${p.name}" (SKU: ${p.sku})?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/products?id=${p.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        loadProducts();
      } else {
        alert('Could not delete product: ' + data.error);
      }
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  // CSV EXPORT LOGIC
  const handleExportCSV = () => {
    if (products.length === 0) {
      alert('No products to export.');
      return;
    }

    const headers = ['SKU', 'Name', 'Category', 'Brand', 'Price_GBP', 'Compare_Price_GBP', 'Stock_On_Hand', 'Status', 'Image_URL'];
    const rows = products.map((p) => [
      `"${p.sku}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.categories[0]?.category?.name || 'Unassigned'}"`,
      `"${p.brand?.name || 'TB Atelier'}"`,
      p.price,
      p.compareAtPrice || '',
      p.variants[0]?.stockOnHand || 0,
      p.status,
      `"${p.primaryImage}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tb_furnitures_catalogue_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV IMPORT LOGIC
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter((l) => l.trim().length > 0);
        if (lines.length < 2) {
          alert('CSV file is empty or missing headers.');
          setImporting(false);
          return;
        }

        const headers = lines[0].split(',').map((h) => h.replace(/^"|"$/g, '').trim().toLowerCase());
        const rows = lines.slice(1).map((line) => {
          const vals = line.split(',').map((v) => v.replace(/^"|"$/g, '').trim());
          const obj: any = {};
          headers.forEach((h, i) => {
            if (h.includes('sku')) obj.sku = vals[i];
            if (h.includes('name')) obj.name = vals[i];
            if (h.includes('price') && !h.includes('compare')) obj.price = vals[i];
            if (h.includes('compare')) obj.compareAtPrice = vals[i];
            if (h.includes('stock')) obj.stock = vals[i];
            if (h.includes('image')) obj.primaryImage = vals[i];
          });
          return obj;
        });

        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rows }),
        });

        const result = await res.json();
        if (result.success) {
          alert(`Successfully imported / synchronized ${result.importedCount} products into database!`);
          loadProducts();
        } else {
          alert('Import failed: ' + result.error);
        }
      } catch (err: any) {
        alert('Failed to parse CSV file: ' + err.message);
      } finally {
        setImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Title & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            Catalogue Management
          </span>
          <h1 className="font-editorial text-3xl font-bold text-charcoal-900 mt-1">
            Master Furniture Catalogue
          </h1>
          <p className="text-xs text-gray-500">
            Control SKUs, prices, stock reserves, images, and bulk synchronizations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-charcoal-900 border border-gray-300 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
          >
            <Upload className="w-4 h-4 text-brand-600" />
            {importing ? 'Importing CSV...' : 'Import CSV'}
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-charcoal-900 border border-gray-300 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
          >
            <Download className="w-4 h-4 text-sage-600" />
            Export Full CSV
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 bg-charcoal-900 hover:bg-brand-900 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU..."
            className="bg-transparent text-xs text-charcoal-900 focus:outline-none w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400 font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-charcoal-900 font-medium focus:outline-none focus:ring-1 focus:ring-brand-400"
            >
              <option value="ALL">All Categories</option>
              <option value="living-room">Living Room</option>
              <option value="bedroom">Bedroom</option>
              <option value="dining-room">Dining Room</option>
              <option value="home-office">Home Office</option>
              <option value="garden-outdoor">Garden & Outdoor</option>
              <option value="lighting-decor">Lighting & Decor</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400 font-medium">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-charcoal-900 font-medium focus:outline-none focus:ring-1 focus:ring-brand-400"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <button
            onClick={loadProducts}
            className="p-2 text-gray-400 hover:text-brand-600 transition-colors"
            title="Refresh Table"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Comprehensive Products Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase font-semibold">
                <th className="py-3.5 px-4">Item Details</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Category & Brand</th>
                <th className="py-3.5 px-4">Unit Price (GBP)</th>
                <th className="py-3.5 px-4">Stock on Hand</th>
                <th className="py-3.5 px-4">Delivery Tier</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={8} className="py-4 px-4 bg-gray-50/30" />
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    No furniture items match the current filters.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-brand-50/40 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <img
                        src={p.primaryImage}
                        alt={p.name}
                        className="w-11 h-11 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-100"
                      />
                      <div>
                        <span className="font-semibold text-charcoal-900 line-clamp-1 max-w-xs">
                          {p.name}
                        </span>
                        {p.slug && (
                          <Link
                            href={`/products/${p.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-[11px] text-brand-600 hover:underline mt-0.5"
                          >
                            <span>View Storefront</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-700">{p.sku}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-charcoal-900">{p.categories[0]?.category?.name || 'Unassigned'}</p>
                      <p className="text-[10px] text-gray-400">{p.brand?.name || 'TB Atelier'}</p>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-charcoal-900">
                      {formatGBP(p.price)}
                      {p.compareAtPrice && (
                        <span className="block text-[10px] text-gray-400 line-through">
                          {formatGBP(p.compareAtPrice)}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-semibold ${
                          (p.variants[0]?.stockOnHand || 0) <= 5 ? 'text-red-600' : 'text-charcoal-900'
                        }`}
                      >
                        {p.variants[0]?.stockOnHand || 15} units
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      {p.isLargeItem ? (
                        <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-medium">
                          Two-Man White Glove
                        </span>
                      ) : (
                        <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">
                          Standard Courier
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                        p.status === 'ACTIVE'
                          ? 'bg-sage-100 text-sage-800'
                          : p.status === 'DRAFT'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 hover:bg-brand-100 rounded-lg text-brand-700 transition-colors"
                        title="Edit Details"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p)}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Product"
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

        {/* Table Footer Summary */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <span>Showing {products.length} Furniture Products in Database</span>
          <span className="font-mono">Prices configured in GBP (£)</span>
        </div>
      </div>

      {/* EDIT / ADD PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h3 className="font-editorial text-xl font-bold text-charcoal-900">
                  {isAddMode ? 'Add New Furniture Item' : 'Edit Product Details'}
                </h3>
                <p className="text-xs text-gray-500">
                  {isAddMode ? 'Enter product specifications and initial stock.' : `Updating SKU: ${editForm.sku}`}
                </p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              {formError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                    placeholder="e.g. Windsor Solid Oak Extending Dining Table"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.sku}
                    onChange={(e) => setEditForm({ ...editForm, sku: e.target.value })}
                    className="w-full text-xs font-mono border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                    placeholder="e.g. TBF-OAK-001"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                    Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                  >
                    <option value="ACTIVE">ACTIVE (Published in Store)</option>
                    <option value="DRAFT">DRAFT (Hidden)</option>
                    <option value="ARCHIVED">ARCHIVED (Discontinued)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                    Selling Price (£ GBP) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-brand-400 focus:outline-none font-semibold"
                    placeholder="1295.00"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                    RRP / Compare At Price (£ GBP)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.compareAtPrice}
                    onChange={(e) => setEditForm({ ...editForm, compareAtPrice: e.target.value })}
                    className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                    placeholder="1595.00"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                    Stock On Hand (Units)
                  </label>
                  <input
                    type="number"
                    required
                    value={editForm.stockOnHand}
                    onChange={(e) => setEditForm({ ...editForm, stockOnHand: e.target.value })}
                    className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                    placeholder="15"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                    Delivery Classification
                  </label>
                  <label className="flex items-center gap-2 mt-2 text-xs text-charcoal-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.isLargeItem}
                      onChange={(e) => setEditForm({ ...editForm, isLargeItem: e.target.checked })}
                      className="rounded text-brand-600 focus:ring-brand-400 w-4 h-4"
                    />
                    <span>Two-Man White Glove Room Delivery (Large Item)</span>
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                    Primary Image URL
                  </label>
                  <input
                    type="url"
                    value={editForm.primaryImage}
                    onChange={(e) => setEditForm({ ...editForm, primaryImage: e.target.value })}
                    className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                    Product Description
                  </label>
                  <textarea
                    rows={4}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                    placeholder="Provide materials, craftsmanship details, care instructions..."
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {saving ? 'Saving...' : isAddMode ? 'Create Product' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
