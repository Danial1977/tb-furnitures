'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Users, Search, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

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
    if (session) loadUsers();
  }, [session, search, roleFilter]);

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            Identity & Access Management
          </span>
          <h1 className="font-editorial text-3xl font-bold text-charcoal-900 mt-1">
            Customers & Staff Directory
          </h1>
          <p className="text-xs text-gray-500">
            Review registered customer profiles, buyer orders count, and staff privileges.
          </p>
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
            placeholder="Search by name, email..."
            className="bg-transparent text-xs text-charcoal-900 focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-400 font-medium">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-charcoal-900 font-medium focus:outline-none focus:ring-1 focus:ring-brand-400"
          >
            <option value="ALL">All Roles</option>
            <option value="CUSTOMER">Customers</option>
            <option value="ADMIN">Admins</option>
            <option value="SUPER_ADMIN">Super Admins</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase font-semibold">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Orders Placed</th>
                <th className="py-3.5 px-4">Marketing Opt-in</th>
                <th className="py-3.5 px-4">Registered Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="py-4 px-4 bg-gray-50/30" />
                  </tr>
                ))
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-brand-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-charcoal-900">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-600">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-semibold text-[10px] ${
                          u.role === 'SUPER_ADMIN'
                            ? 'bg-purple-100 text-purple-800'
                            : u.role === 'ADMIN'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-charcoal-900">
                      {u._count?.orders || 0} orders
                    </td>
                    <td className="py-3.5 px-4">
                      {u.marketingConsent ? (
                        <span className="text-sage-700 font-semibold">✓ Consented</span>
                      ) : (
                        <span className="text-gray-400">Opted out</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
