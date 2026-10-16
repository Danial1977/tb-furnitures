'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tags,
  Percent,
  Sliders,
  Settings,
  Store,
  LogOut,
  Layers,
  Mail,
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const navItems = [
  { href: '/admin', label: 'Executive Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products & Inventory', icon: Package },
  { href: '/admin/categories', label: 'Categories Master', icon: Layers },
  { href: '/admin/orders', label: 'Orders & Shipments', icon: ShoppingBag },
  { href: '/admin/inquiries', label: 'Inquiries & Subscribers', icon: Mail },
  { href: '/admin/users', label: 'Customers & Staff', icon: Users },
  { href: '/admin/coupons', label: 'Promotions & Coupons', icon: Percent },
  { href: '/admin/settings', label: 'Site & Delivery Rules', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-charcoal-950 text-brand-100 flex flex-col shrink-0 min-h-screen border-r border-charcoal-800">
      {/* Brand Header */}
      <div className="p-4 border-b border-charcoal-800">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="overflow-hidden rounded-lg bg-sand-100 p-0.5 border border-charcoal-700/60 shadow-sm shrink-0">
            <img
              src="/images/oakland-logo.jpg"
              alt="Oakland Furniture & Flooring"
              className="h-9 w-auto object-contain rounded"
            />
          </div>
          <div className="overflow-hidden">
            <span className="font-editorial text-sm font-bold text-white tracking-wide block leading-tight">
              OAKLAND
            </span>
            <span className="text-[9px] uppercase tracking-wider text-brand-400 font-semibold block truncate">
              Furniture & Flooring
            </span>
            <span className="text-[9px] uppercase tracking-widest text-charcoal-400 font-medium block">
              Control Centre
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-charcoal-500 mb-2">
          Master Operations
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-brand-500 text-charcoal-950 font-semibold shadow-sm'
                  : 'text-brand-200/70 hover:bg-charcoal-900 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>


      {/* Footer Actions */}
      <div className="p-4 border-t border-charcoal-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-3 py-2 text-xs text-brand-300 hover:text-white transition-colors"
        >
          <Store className="w-4 h-4" />
          <span>View Public Storefront ↗</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-charcoal-900 rounded-lg transition-colors text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Admin</span>
        </button>
      </div>
    </aside>
  );
}
