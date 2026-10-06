'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Subscription, MonthlyStats } from '@/types';
import { calculateMonthlyStats } from '@/lib/calculator';
import { generatePdfReport } from '@/lib/pdf';
import { Navbar, ActiveTab } from '@/components/Navbar';
import { DashboardView } from '@/components/DashboardView';
import { SubscriptionListView } from '@/components/SubscriptionListView';
import { CalendarView } from '@/components/CalendarView';
import { AnalyticsView } from '@/components/AnalyticsView';
import { BackupView } from '@/components/BackupView';
import { SubscriptionModal } from '@/components/SubscriptionModal';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal állapot
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);

  // Adatok lekérése a szerverről
  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/subscriptions');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Hiba az előfizetések lekérésekor');
      }
      setSubscriptions(data.data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  // Statisztikák számítása
  const activeSubscriptions = subscriptions.filter(s => s.status !== 'archived');
  const stats: MonthlyStats = calculateMonthlyStats(activeSubscriptions);

  // Új felvitel modal megnyitása
  const handleOpenNewModal = () => {
    setEditingSub(null);
    setIsModalOpen(true);
  };

  // Szerkesztés modal megnyitása
  const handleEditSubscription = (sub: Subscription) => {
    setEditingSub(sub);
    setIsModalOpen(true);
  };

  // Előfizetés mentése (létrehozás vagy frissítés)
  const handleSaveSubscription = async (subData: Partial<Subscription>) => {
    try {
      const isEdit = Boolean(editingSub && editingSub.id);
      const url = isEdit ? `/api/subscriptions/${editingSub!.id}` : '/api/subscriptions';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Hiba a mentés során');
      }

      await fetchSubscriptions();
      setIsModalOpen(false);
      setEditingSub(null);
    } catch (err: any) {
      alert(`Hiba történt: ${err.message}`);
    }
  };

  // Törlés
    const handleArchiveSubscription = async (sub: Subscription) => {
    try {
      const res = await fetch(`/api/subscriptions/${sub.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: sub.status === 'archived' ? 'active' : 'archived' })
      });
      if (!res.ok) throw new Error('Hiba az archiválás során');
      await fetchSubscriptions();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    try {
      const res = await fetch(`/api/subscriptions/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Hiba a törlés során');
      }
      await fetchSubscriptions();
    } catch (err: any) {
      alert(`Hiba a törlés során: ${err.message}`);
    }
  };

  // Aktív / Inaktív státusz gyorsváltása
  const handleToggleStatus = async (sub: Subscription) => {
    try {
      const res = await fetch(`/api/subscriptions/${sub.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !sub.isActive })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Hiba a státuszváltás során');
      }
      await fetchSubscriptions();
    } catch (err: any) {
      alert(`Hiba: ${err.message}`);
    }
  };

  // PDF Riport letöltése
  const handleDownloadPdf = () => {
    try {
      generatePdfReport(subscriptions, stats);
    } catch (err) {
      console.error(err);
      alert('Nem sikerült generálni a PDF riportot.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      
      {/* Fejléc és navigáció */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onOpenNewModal={handleOpenNewModal}
      />

      {/* Fő tartalom konténer */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="text-xs font-medium text-muted-foreground">
              Adatok betöltése folyamatban...
            </span>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-center">
            <h3 className="font-bold text-sm">Hiba az adatok betöltésekor</h3>
            <p className="text-xs mt-1">{error}</p>
            <button
              onClick={() => fetchSubscriptions()}
              className="mt-3 px-4 py-1.5 rounded-lg bg-destructive text-white text-xs font-semibold"
            >
              Újrapróbálkozás
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardView
                subscriptions={activeSubscriptions}
                stats={stats}
                onNavigate={(tab) => setActiveTab(tab)}
                onEditSubscription={handleEditSubscription}
                onDownloadPdf={handleDownloadPdf}
              />
            )}

            {activeTab === 'subscriptions' && (
              <SubscriptionListView
                subscriptions={subscriptions}
                onEdit={handleEditSubscription}
                onDelete={handleDeleteSubscription}
                onArchive={handleArchiveSubscription}
                onToggleStatus={handleToggleStatus}
                onOpenNewModal={handleOpenNewModal}
              />
            )}

            {activeTab === 'calendar' && (
              <CalendarView
                subscriptions={activeSubscriptions}
                onEditSubscription={handleEditSubscription}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsView
                subscriptions={activeSubscriptions}
                stats={stats}
                onDownloadPdf={handleDownloadPdf}
              />
            )}

            {activeTab === 'backup' && (
              <BackupView
                subscriptions={subscriptions}
                onRefreshData={fetchSubscriptions}
              />
            )}
          </>
        )}
      </main>

      {/* Új / Szerkesztés Modál */}
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSub(null);
        }}
        onSave={handleSaveSubscription}
        initialSubscription={editingSub}
      />

      {/* Lábléc */}
      <footer className="border-t border-border py-4 bg-card/40 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-muted-foreground gap-2">
          <span>SubTracker &bull; Teljesen privát, Dockerben futó előfizetés kezelő</span>
          <span>SQLite helyi adatbázis &bull; 10 beépített stílustéma</span>
        </div>
      </footer>

    </div>
  );
}
