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
  Database,
  ExternalLink,
  Store,
  LogOut,
  Layers,
  FileText,
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const navItems = [
  { href: '/admin', label: 'Executive Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products & Inventory', icon: Package },
  { href: '/admin/categories', label: 'Categories Master', icon: Layers },
  { href: '/admin/orders', label: 'Orders & Shipments', icon: ShoppingBag },
  { href: '/admin/users', label: 'Customers & Staff', icon: Users },
  { href: '/admin/coupons', label: 'Promotions & Coupons', icon: Percent },
  { href: '/admin/settings', label: 'Site & Delivery Rules', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-charcoal-950 text-brand-100 flex flex-col shrink-0 min-h-screen border-r border-charcoal-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-charcoal-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500 text-charcoal-950 flex items-center justify-center font-bold font-editorial text-lg">
            TB
          </div>
          <div>
            <span className="font-editorial text-lg font-bold text-white tracking-wide block leading-none">
              TB FURNITURES
            </span>
            <span className="text-[10px] uppercase tracking-widest text-brand-400 font-semibold mt-1 block">
              Control Centre
            </span>
          </div>
        </div>
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

        <div className="pt-6">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-charcoal-500 mb-2">
            Developer & Database
          </p>
          <a
            href="http://localhost:5555"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-brand-400 hover:bg-charcoal-900 hover:text-brand-300 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Database className="w-4 h-4" />
              <span>Prisma Studio GUI</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <Link
            href="/docs"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-amber-400 hover:bg-charcoal-900 hover:text-amber-300 transition-colors mt-1"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>System Docs (PDF)</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
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
