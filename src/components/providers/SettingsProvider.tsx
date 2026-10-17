'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_SITE_SETTINGS, SiteSettingsData } from '@/lib/settings';

export type { SiteSettingsData };

interface SettingsContextType {
  settings: SiteSettingsData;
  loading: boolean;
  calculateDeliveryFee: (subtotal: number, hasLargeItem: boolean) => number;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettingsData>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);

  // 1. Initial hydration from localStorage if available
  useEffect(() => {
    try {
      const cached = localStorage.getItem('tb_site_settings');
      if (cached) {
        setSettings(JSON.parse(cached));
      }
    } catch {}
  }, []);

  // 2. Fetch live settings from database API
  const refreshSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
        try {
          localStorage.setItem('tb_site_settings', JSON.stringify(data.settings));
        } catch {}
      }
    } catch (e) {
      console.error('Failed to load database site settings:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  // 3. Dynamic Delivery Fee Calculation grounded in live database rules
  const calculateDeliveryFee = useCallback(
    (subtotal: number, hasLargeItem: boolean): number => {
      if (hasLargeItem) {
        return subtotal >= settings.twoManFreeThreshold ? 0 : settings.twoManDeliveryFee;
      }
      if (subtotal >= settings.freeDeliveryThreshold) {
        return 0; // Free delivery threshold met!
      }
      return settings.standardDeliveryFee;
    },
    [settings]
  );

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        calculateDeliveryFee,
        refreshSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
