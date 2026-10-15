'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, MapPin, User, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface AccountNavProps {
  userEmail?: string | null;
  userName?: string | null;
}

export function AccountNav({ userEmail, userName }: AccountNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/account',
      label: 'Order History & Dispatch',
      icon: Package,
      active: pathname === '/account',
    },
    {
      href: '/account/addresses',
      label: 'Saved UK Delivery Addresses',
      icon: MapPin,
      active: pathname === '/account/addresses',
    },
    {
      href: '/account/profile',
      label: 'Personal Details & Password',
      icon: User,
      active: pathname === '/account/profile',
    },
  ];

  return (
    <div className="space-y-6">
      {/* User Mini Card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 block">
          Client Account
        </span>
        <h3 className="font-editorial text-lg font-bold text-charcoal-900 truncate">
          {userName || 'TB Client'}
        </h3>
        <p className="text-xs text-gray-500 truncate">{userEmail}</p>
      </div>

      {/* Nav Links */}
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 p-3.5 rounded-xl text-xs font-semibold transition-all ${
                item.active
                  ? 'bg-brand-100/80 text-charcoal-900 border border-brand-300 shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-brand-50 hover:text-charcoal-900 border border-gray-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${item.active ? 'text-brand-700' : 'text-gray-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3 p-3.5 rounded-xl text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 border border-gray-200 transition-colors"
        >
          <LogOut className="w-4 h-4 text-gray-400" />
          <span>Sign Out</span>
        </button>
      </nav>
    </div>
  );
}
