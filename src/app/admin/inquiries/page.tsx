'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Mail,
  MessageSquare,
  Search,
  CheckCircle,
  Archive,
  Trash2,
  ExternalLink,
  Phone,
  User,
  Calendar,
  X,
  Filter,
  RefreshCw,
  Bell,
  Sparkles,
} from 'lucide-react';

export default function AdminInquiriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [submissions, setSubmissions] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, inquiries: 0, newsletters: 0, unread: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'CONTACT_INQUIRY' | 'NEWSLETTER'>('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/admin/inquiries');
    }
  }, [status, router]);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (typeFilter !== 'ALL') params.set('type', typeFilter);
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());

      const res = await fetch(`/api/submissions?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setSubmissions(data.submissions || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadSubmissions();
    }
  }, [session, typeFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadSubmissions();
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setSubmissions((prev) =>
          prev.map((sub) => (sub.id === id ? { ...sub, status: newStatus } : sub))
        );
        if (selectedSubmission?.id === id) {
          setSelectedSubmission({ ...selectedSubmission, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this entry?')) return;
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((sub) => sub.id !== id));
        if (selectedSubmission?.id === id) setSelectedSubmission(null);
      }
    } catch (err) {
      console.error('Error deleting submission:', err);
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            Customer Communications
          </span>
          <h1 className="font-editorial text-3xl font-bold text-charcoal-900 mt-1">
            Inquiries & Newsletter Subscribers
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Central repository of customer requests, trade enquiries, and marketing subscribers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadSubmissions()}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-xs font-medium text-charcoal-700 hover:bg-gray-100 transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Records</span>
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="font-editorial text-2xl font-bold text-charcoal-900 mt-3">{stats.total}</p>
          <span className="text-[11px] text-gray-400 mt-1 block">Unified communications log</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Inquiries</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <p className="font-editorial text-2xl font-bold text-charcoal-900 mt-3">{stats.inquiries}</p>
          <span className="text-[11px] text-gray-400 mt-1 block">Customer & trade messages</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Newsletter Subscribers</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="font-editorial text-2xl font-bold text-charcoal-900 mt-3">{stats.newsletters}</p>
          <span className="text-[11px] text-gray-400 mt-1 block">£50 voucher promotional signups</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending / Unread</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <p className="font-editorial text-2xl font-bold text-amber-600 mt-3">{stats.unread}</p>
          <span className="text-[11px] text-gray-400 mt-1 block">Awaiting customer response</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tab filter buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setTypeFilter('ALL')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                typeFilter === 'ALL'
                  ? 'bg-charcoal-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Records ({stats.total})
            </button>
            <button
              onClick={() => setTypeFilter('CONTACT_INQUIRY')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                typeFilter === 'CONTACT_INQUIRY'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Contact Enquiries ({stats.inquiries})
            </button>
            <button
              onClick={() => setTypeFilter('NEWSLETTER')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                typeFilter === 'NEWSLETTER'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Newsletter Subscribers ({stats.newsletters})
            </button>
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Filter className="w-3.5 h-3.5" />
              <span>Status:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-gray-300 rounded-xl px-3 py-2 bg-white text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-brand-400"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New (Unread)</option>
              <option value="RESOLVED">Resolved</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, email address, phone, or keyword..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-24 py-2.5 text-xs text-charcoal-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:bg-white transition-all"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-medium rounded-lg transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500 space-y-2">
            <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Loading communications records...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-charcoal-900">No submissions found</p>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              When customers submit contact enquiries or subscribe to the newsletter, they will appear in this unified view.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[11px] font-semibold">
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Category / Purpose</th>
                  <th className="py-3.5 px-4">Message Preview</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {submissions.map((sub) => {
                  const isNewsletter = sub.type === 'NEWSLETTER';
                  return (
                    <tr
                      key={sub.id}
                      className="hover:bg-brand-50/40 transition-colors cursor-pointer"
                      onClick={() => setSelectedSubmission(sub)}
                    >
                      <td className="py-3.5 px-4 whitespace-nowrap text-gray-500 font-mono text-[11px]">
                        {new Date(sub.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isNewsletter ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800">
                            <Sparkles className="w-3 h-3" />
                            Newsletter
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-100 text-blue-800">
                            <Mail className="w-3 h-3" />
                            Inquiry
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-charcoal-900">
                          {sub.name || (isNewsletter ? 'Subscriber' : 'Anonymous')}
                        </div>
                        <a
                          href={`mailto:${sub.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-brand-600 hover:underline block text-[11px]"
                        >
                          {sub.email}
                        </a>
                        {sub.phone && (
                          <span className="text-[11px] text-gray-500 font-mono block">
                            {sub.phone}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-gray-100 text-charcoal-700 rounded-md text-[11px] font-medium">
                          {sub.enquiryType || (isNewsletter ? 'NEWSLETTER' : 'GENERAL')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs truncate text-gray-600">
                        {sub.message || '—'}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                            sub.status === 'NEW'
                              ? 'bg-amber-100 text-amber-800'
                              : sub.status === 'RESOLVED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div
                          className="flex items-center justify-end gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {sub.status === 'NEW' ? (
                            <button
                              onClick={() => handleUpdateStatus(sub.id, 'RESOLVED')}
                              title="Mark as Resolved"
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateStatus(sub.id, 'NEW')}
                              title="Mark as New / Unread"
                              className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(sub.id)}
                            title="Delete"
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details View Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
                  Submission Detail
                </span>
                <h3 className="font-editorial text-2xl font-bold text-charcoal-900 mt-1">
                  {selectedSubmission.type === 'NEWSLETTER'
                    ? 'Newsletter Subscription'
                    : 'Customer Enquiry'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold">Customer</span>
                  <strong className="text-charcoal-900 text-sm block mt-0.5">
                    {selectedSubmission.name || 'Not provided'}
                  </strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold">Date Received</span>
                  <span className="text-charcoal-700 block mt-0.5">
                    {new Date(selectedSubmission.createdAt).toLocaleString('en-GB')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold">Email</span>
                  <a
                    href={`mailto:${selectedSubmission.email}`}
                    className="text-brand-600 font-semibold hover:underline block mt-0.5"
                  >
                    {selectedSubmission.email}
                  </a>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold">Telephone</span>
                  {selectedSubmission.phone ? (
                    <a
                      href={`tel:${selectedSubmission.phone}`}
                      className="text-charcoal-900 font-mono block mt-0.5 hover:underline"
                    >
                      {selectedSubmission.phone}
                    </a>
                  ) : (
                    <span className="text-gray-400 mt-0.5 block">Not provided</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-semibold mb-1">
                  Enquiry Nature / Topic
                </span>
                <span className="px-2.5 py-1 bg-brand-50 text-brand-800 rounded-md font-semibold text-xs inline-block">
                  {selectedSubmission.enquiryType || 'GENERAL'}
                </span>
              </div>

              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-semibold mb-1">
                  Message Content
                </span>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-charcoal-800 whitespace-pre-wrap leading-relaxed text-xs">
                  {selectedSubmission.message || 'No additional message provided.'}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Status:</span>
                  <select
                    value={selectedSubmission.status}
                    onChange={(e) => handleUpdateStatus(selectedSubmission.id, e.target.value)}
                    className="text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white font-semibold"
                  >
                    <option value="NEW">NEW</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${selectedSubmission.email}?subject=RE: Oakland Furniture & Flooring Enquiry&body=Dear ${
                      selectedSubmission.name || 'Customer'
                    },%0D%0A%0D%0AThank you for contacting Oakland Furniture & Flooring.`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Reply via Email</span>
                  </a>
                  <button
                    onClick={() => handleDelete(selectedSubmission.id)}
                    className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
