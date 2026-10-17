'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  AlertCircle,
  ArrowUpRight,
  Lock,
  UserCheck,
  UserX,
  RefreshCw,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';

interface OrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

interface UserItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phone: string | null;
  isActive: boolean;
  marketingConsent: boolean;
  createdAt: string;
  _count?: { orders: number };
  orders?: OrderSummary[];
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);

  // Form states for Add Customer
  const [addForm, setAddForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'CUSTOMER',
    password: '',
    marketingConsent: true,
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  // Form states for Edit Customer
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'CUSTOMER',
    isActive: true,
    password: '',
    marketingConsent: false,
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // Delete state
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Success alert
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/admin/users');
  }, [status, router]);

  const loadUsers = () => {
    setLoading(true);
    fetch(`/api/admin/users?search=${encodeURIComponent(search)}&role=${roleFilter}`)
      .then((r) => r.json())
      .then((res) => {
        setUsers(res.users || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (session) {
      const delay = setTimeout(() => {
        loadUsers();
      }, 200);
      return () => clearTimeout(delay);
    }
  }, [session, search, roleFilter]);

  // Handle Add Customer Submit
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError('');

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create customer');
      }

      setSuccessMessage(`Customer ${addForm.firstName} ${addForm.lastName} created successfully.`);
      setShowAddModal(false);
      setAddForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'CUSTOMER',
        password: '',
        marketingConsent: true,
      });
      loadUsers();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err: any) {
      setAddError(err.message || 'Error creating customer');
    } finally {
      setAddLoading(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (user: UserItem) => {
    setEditingUser(user);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      isActive: user.isActive,
      password: '',
      marketingConsent: user.marketingConsent,
    });
    setEditError('');
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setEditLoading(true);
    setEditError('');

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingUser.id,
          ...editForm,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update user profile');
      }

      setSuccessMessage(`Account for ${editForm.firstName} ${editForm.lastName} updated successfully.`);
      setEditingUser(null);
      loadUsers();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err: any) {
      setEditError(err.message || 'Error updating user');
    } finally {
      setEditLoading(false);
    }
  };

  // Handle Delete User
  const handleDeleteSubmit = async () => {
    if (!deletingUser) return;
    setDeleteLoading(true);
    setDeleteError('');

    try {
      const res = await fetch(`/api/admin/users?id=${deletingUser.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete user');
      }

      setSuccessMessage(`Customer ${deletingUser.firstName} ${deletingUser.lastName} was deleted.`);
      setDeletingUser(null);
      loadUsers();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err: any) {
      setDeleteError(err.message || 'Error deleting user');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Client-side filtering by active status if requested
  const filteredUsers = users.filter((u) => {
    if (statusFilter === 'ACTIVE') return u.isActive;
    if (statusFilter === 'INACTIVE') return !u.isActive;
    return true;
  });

  const totalCustomers = users.filter((u) => u.role === 'CUSTOMER').length;
  const totalStaff = users.filter((u) => u.role !== 'CUSTOMER').length;
  const totalOrdersPlaced = users.reduce((acc, curr) => acc + (curr._count?.orders || 0), 0);

  const currentAdminId = (session?.user as any)?.id;

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            Identity & Access Management
          </span>
          <h1 className="font-editorial text-3xl font-bold text-charcoal-900 mt-1">
            Customers & Staff Directory
          </h1>
          <p className="text-xs text-gray-500">
            Create new customers from backend, edit accounts, review orders history, and manage privileges.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadUsers}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 text-charcoal-900 border border-gray-300 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-brand-600 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <button
            onClick={() => {
              setAddError('');
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-2 bg-charcoal-900 hover:bg-brand-900 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-brand-400" />
            + Add New Customer
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900 animate-fadeIn">
          <div className="flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-xs text-gray-500 font-medium">Total Registered</span>
          <p className="font-editorial text-2xl font-bold text-charcoal-900">{users.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-xs text-gray-500 font-medium">Retail Customers</span>
          <p className="font-editorial text-2xl font-bold text-brand-600">{totalCustomers}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-xs text-gray-500 font-medium">Admins & Staff</span>
          <p className="font-editorial text-2xl font-bold text-purple-700">{totalStaff}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-xs text-gray-500 font-medium">Total Orders Placed</span>
          <p className="font-editorial text-2xl font-bold text-charcoal-900">{totalOrdersPlaced}</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="bg-transparent text-xs text-charcoal-900 focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-3 text-xs w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 font-medium">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-charcoal-900 font-medium focus:outline-none focus:ring-1 focus:ring-brand-400"
            >
              <option value="ALL">All Roles</option>
              <option value="CUSTOMER">Customers</option>
              <option value="ADMIN">Admins</option>
              <option value="SUPER_ADMIN">Super Admins</option>
              <option value="CATALOGUE_MANAGER">Catalogue Managers</option>
              <option value="ORDER_MANAGER">Order Managers</option>
              <option value="CUSTOMER_SUPPORT">Customer Support</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-charcoal-900 font-medium focus:outline-none focus:ring-1 focus:ring-brand-400"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Suspended Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase font-semibold">
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Contact Details</th>
                <th className="py-3.5 px-4">Role & Status</th>
                <th className="py-3.5 px-4">Orders Placed</th>
                <th className="py-3.5 px-4">Marketing</th>
                <th className="py-3.5 px-4">Registered</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="py-4 px-4 bg-gray-50/30" />
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    No customers found matching the search criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrentAdmin = u.id === currentAdminId;
                  const orderCount = u._count?.orders || 0;

                  return (
                    <tr key={u.id} className="hover:bg-brand-50/30 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center shrink-0 border border-brand-200 uppercase text-[11px]">
                            {u.firstName?.[0] || 'U'}
                            {u.lastName?.[0] || ''}
                          </div>
                          <div>
                            <p className="font-semibold text-charcoal-900 leading-tight">
                              {u.firstName} {u.lastName}
                              {isCurrentAdmin && (
                                <span className="ml-1.5 text-[9px] bg-brand-100 text-brand-800 font-mono px-1.5 py-0.2 rounded">
                                  YOU
                                </span>
                              )}
                            </p>
                            <span className="text-[10px] text-gray-400 font-mono">ID: {u.id.slice(0, 8)}...</span>
                          </div>
                        </div>
                      </td>

                      {/* Email & Phone */}
                      <td className="py-3.5 px-4 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-gray-600 font-mono">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <a href={`mailto:${u.email}`} className="hover:text-brand-600 hover:underline">
                            {u.email}
                          </a>
                        </div>
                        {u.phone ? (
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <a href={`tel:${u.phone}`} className="hover:text-brand-600">
                              {u.phone}
                            </a>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-400 italic block">No phone number</span>
                        )}
                      </td>

                      {/* Role & Status */}
                      <td className="py-3.5 px-4 space-y-1">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full font-semibold text-[10px] ${
                            u.role === 'SUPER_ADMIN'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : u.role === 'ADMIN'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-gray-100 text-gray-700 border border-gray-200'
                          }`}
                        >
                          {u.role}
                        </span>
                        <div>
                          {u.isActive ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                              Suspended
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Orders Placed & Recent Order Number Pills */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1.5">
                          {/* Clicking on total orders leads to orders list page filtered by user email */}
                          <Link
                            href={`/admin/orders?search=${encodeURIComponent(u.email)}`}
                            className="inline-flex items-center gap-1 font-bold text-brand-600 hover:text-brand-800 hover:underline text-xs"
                            title={`Filter orders list for ${u.email}`}
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-brand-500" />
                            <span>
                              {orderCount} {orderCount === 1 ? 'order' : 'orders'}
                            </span>
                            <ArrowUpRight className="w-3 h-3 text-brand-400" />
                          </Link>

                          {/* Recent Order Number Badges linking directly to Order Detail Page */}
                          {u.orders && u.orders.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {u.orders.map((ord) => (
                                <Link
                                  key={ord.id}
                                  href={`/admin/orders/${ord.id}`}
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-gray-100 hover:bg-brand-100 text-charcoal-700 hover:text-brand-900 border border-gray-200 transition-colors shadow-2xs"
                                  title={`View order #${ord.orderNumber} details`}
                                >
                                  <span>#{ord.orderNumber}</span>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Marketing Opt-in */}
                      <td className="py-3.5 px-4">
                        {u.marketingConsent ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-sage-700">
                            <Check className="w-3 h-3 text-sage-600" />
                            Consented
                          </span>
                        ) : (
                          <span className="text-[11px] text-gray-400">Opted out</span>
                        )}
                      </td>

                      {/* Registered Date */}
                      <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Edit / Delete Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="p-1.5 text-gray-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors border border-gray-200 hover:border-brand-300"
                            title="Edit customer account"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              setDeleteError('');
                              setDeletingUser(u);
                            }}
                            disabled={isCurrentAdmin}
                            className={`p-1.5 rounded-lg transition-colors border ${
                              isCurrentAdmin
                                ? 'text-gray-300 border-gray-100 cursor-not-allowed'
                                : 'text-gray-500 hover:text-red-600 hover:bg-red-50 border-gray-200 hover:border-red-300'
                            }`}
                            title={isCurrentAdmin ? 'Cannot delete current active session' : 'Delete user account'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL 1: ADD NEW CUSTOMER FROM BACKEND                        */}
      {/* ============================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg font-bold text-charcoal-900">Add New Customer</h3>
                  <p className="text-[11px] text-gray-500">Create a registered customer account directly from backend</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-charcoal-900 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{addError}</span>
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal-900">First Name *</label>
                  <input
                    type="text"
                    required
                    value={addForm.firstName}
                    onChange={(e) => setAddForm({ ...addForm, firstName: e.target.value })}
                    placeholder="e.g. William"
                    className="w-full bg-brand-50 border border-brand-200 rounded-xl px-3 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal-900">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={addForm.lastName}
                    onChange={(e) => setAddForm({ ...addForm, lastName: e.target.value })}
                    placeholder="e.g. Harrington"
                    className="w-full bg-brand-50 border border-brand-200 rounded-xl px-3 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal-900">Email Address *</label>
                <input
                  type="email"
                  required
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  placeholder="customer@example.co.uk"
                  className="w-full bg-brand-50 border border-brand-200 rounded-xl px-3 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal-900">Phone Number</label>
                  <input
                    type="text"
                    value={addForm.phone}
                    onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                    placeholder="07467 279653"
                    className="w-full bg-brand-50 border border-brand-200 rounded-xl px-3 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal-900">Account Role</label>
                  <select
                    value={addForm.role}
                    onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                    className="w-full bg-brand-50 border border-brand-200 rounded-xl px-3 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-400"
                  >
                    <option value="CUSTOMER">CUSTOMER (Retail Buyer)</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="CATALOGUE_MANAGER">CATALOGUE MANAGER</option>
                    <option value="ORDER_MANAGER">ORDER MANAGER</option>
                    <option value="CUSTOMER_SUPPORT">CUSTOMER SUPPORT</option>
                    <option value="SUPER_ADMIN">SUPER ADMIN</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal-900">Initial Password</label>
                <input
                  type="text"
                  value={addForm.password}
                  onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                  placeholder="Defaults to Customer123! if blank"
                  className="w-full bg-brand-50 border border-brand-200 rounded-xl px-3 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-400 font-mono"
                />
                <p className="text-[10px] text-gray-500">The customer can change their password anytime via /account.</p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={addForm.marketingConsent}
                  onChange={(e) => setAddForm({ ...addForm, marketingConsent: e.target.checked })}
                  className="rounded text-brand-600 focus:ring-brand-400"
                />
                <span className="text-xs text-charcoal-800">
                  Opt-in for seasonal collections & promotions (marketing consent)
                </span>
              </label>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-charcoal-900 hover:bg-brand-900 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
                >
                  {addLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  {addLoading ? 'Creating...' : 'Create Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: EDIT CUSTOMER DETAILS                                */}
      {/* ============================================================== */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg font-bold text-charcoal-900">Edit Customer Account</h3>
                  <p className="text-[11px] text-gray-500">{editingUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-charcoal-900 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal-900">First Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className="w-full bg-brand-50 border border-brand-200 rounded-xl px-3 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal-900">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className="w-full bg-brand-50 border border-brand-200 rounded-xl px-3 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal-900">Email Address *</label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full bg-brand-50 border border-brand-200 rounded-xl px-3 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal-900">Phone</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="07467 279653"
                    className="w-full bg-brand-50 border border-brand-200 rounded-xl px-3 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal-900">Role</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full bg-brand-50 border border-brand-200 rounded-xl px-3 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-400"
                  >
                    <option value="CUSTOMER">CUSTOMER</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="CATALOGUE_MANAGER">CATALOGUE MANAGER</option>
                    <option value="ORDER_MANAGER">ORDER MANAGER</option>
                    <option value="CUSTOMER_SUPPORT">CUSTOMER SUPPORT</option>
                    <option value="SUPER_ADMIN">SUPER ADMIN</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal-900">Account Status</label>
                  <select
                    value={editForm.isActive ? 'true' : 'false'}
                    onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === 'true' })}
                    className="w-full bg-brand-50 border border-brand-200 rounded-xl px-3 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-400"
                  >
                    <option value="true">Active (Can Login & Order)</option>
                    <option value="false">Suspended (Access Disabled)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal-900">Reset Password (Optional)</label>
                  <input
                    type="password"
                    value={editForm.password}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    placeholder="Leave blank to keep current"
                    className="w-full bg-brand-50 border border-brand-200 rounded-xl px-3 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-400"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={editForm.marketingConsent}
                  onChange={(e) => setEditForm({ ...editForm, marketingConsent: e.target.checked })}
                  className="rounded text-brand-600 focus:ring-brand-400"
                />
                <span className="text-xs text-charcoal-800">
                  Marketing opt-in granted (promotions and seasonal updates)
                </span>
              </label>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
                >
                  {editLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: DELETE CONFIRMATION MODAL                            */}
      {/* ============================================================== */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 animate-scaleUp">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-editorial text-lg font-bold text-charcoal-900">Confirm Deletion</h3>
                <p className="text-xs text-gray-500">This action is irreversible.</p>
              </div>
            </div>

            {deleteError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-charcoal-800 space-y-1">
              <p>
                <strong>Customer:</strong> {deletingUser.firstName} {deletingUser.lastName}
              </p>
              <p>
                <strong>Email:</strong> {deletingUser.email}
              </p>
              <p>
                <strong>Role:</strong> {deletingUser.role}
              </p>
              <p>
                <strong>Orders:</strong> {deletingUser._count?.orders || 0} orders recorded
              </p>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Deleting this user will permanently remove their customer profile, saved wishlist, and active basket.
            </p>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSubmit}
                disabled={deleteLoading}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
              >
                {deleteLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                {deleteLoading ? 'Deleting...' : 'Delete Customer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
