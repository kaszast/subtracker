'use client';

import React, { useState } from 'react';
import { Subscription } from '@/types';
import { ALL_CATEGORIES } from '@/lib/presets';
import { formatMoney, getMonthlyEquivalentHuf } from '@/lib/calculator';
import { ServiceIcon } from './ServiceIcon';
import { Archive,  
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  Plus, 
  Power,
  AlertCircle
 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface SubscriptionListViewProps {
  subscriptions: Subscription[];
  onEdit: (sub: Subscription) => void;
  onDelete: (id: string) => Promise<void>;
  onArchive: (sub: Subscription) => Promise<void>;
  onToggleStatus: (sub: Subscription) => Promise<void>;
  onOpenNewModal: () => void;
}

export const SubscriptionListView: React.FC<SubscriptionListViewProps> = ({
  subscriptions,
  onEdit,
  onDelete,
  onArchive,
  onToggleStatus,
  onOpenNewModal
}) => {
  const { t } = useLanguage();
  const [showArchived, setShowArchived] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive' | 'trial'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'cost-desc' | 'cost-asc' | 'name'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Szűrés
  const filtered = subscriptions.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(search.toLowerCase()) ||
                          sub.paymentMethod?.toLowerCase().includes(search.toLowerCase()) ||
                          sub.notes?.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || sub.category === selectedCategory;
    
    let matchesStat = true;
    if (selectedStatus === 'active') matchesStat = sub.isActive;
    if (selectedStatus === 'inactive') matchesStat = !sub.isActive;
    if (selectedStatus === 'trial') matchesStat = sub.isTrial;

    return matchesSearch && matchesCat && matchesStat;
  });

  // Rendezés
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime();
    }
    if (sortBy === 'cost-desc') {
      return getMonthlyEquivalentHuf(b) - getMonthlyEquivalentHuf(a);
    }
    if (sortBy === 'cost-asc') {
      return getMonthlyEquivalentHuf(a) - getMonthlyEquivalentHuf(b);
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  return (
    <div className="space-y-5">
      
      {/* Szűrősáv & Kezelőszervek */}
      <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Kereső */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Keresés név, kártya vagy megjegyzés szerint..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm"
          />
        </div>

        {/* Szűrők & Rendezés */}
        <div className="flex flex-wrap items-center gap-2">
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm"
          >
            <option value="all">Minden kategória</option>
            {ALL_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm"
          >
            <option value="all">Minden státusz</option>
            <option value="active">Csak aktív</option>
            <option value="inactive">Szüneteltetett</option>
            <option value="trial">Csak próbaidőszak</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm"
          >
            <option value="date">Következő levonás</option>
            <option value="cost-desc">Legdrágább (Havi)</option>
            <option value="cost-asc">Legolcsóbb (Havi)</option>
            <option value="name">Név (A-Z)</option>
          </select>

          {/* Nézetváltó */}
          <div className="flex items-center border border-border rounded-xl p-0.5 bg-secondary/40">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'grid' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Kártya nézet"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'table' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Táblázat nézet"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Eredménylista */}
      {sorted.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-card border border-border">
          <AlertCircle className="w-8 h-8 mx-auto text-muted-foreground mb-3 opacity-60" />
          <h3 className="text-sm font-semibold text-foreground">Nincs találat a megadott feltételekre</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Próbáld módosítani a keresési vagy szűrési feltételeket, vagy rögzíts új előfizetést.
          </p>
          <button
            onClick={onOpenNewModal}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-sm hover:shadow"
          >
            <Plus className="w-4 h-4" />
            Új előfizetés felvitele
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        
        /* Grid Kártyák Nézet */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((sub) => {
            const monthlyHuf = Math.round(getMonthlyEquivalentHuf(sub));
            return (
              <div
                key={sub.id}
                className={`p-5 rounded-2xl bg-card border transition-all flex flex-col justify-between ${
                  sub.isActive
                    ? 'border-border hover:border-primary/50 shadow-sm'
                    : 'border-border/60 opacity-60 bg-card/60'
                }`}
              >
                <div>
                  {/* Felső sáv: Ikon, Név, Művelet gombok */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <ServiceIcon name={sub.icon} domain={sub.domain} color={sub.color} className="w-10 h-10 shrink-0 p-2" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-foreground truncate">{sub.name}</h4>
                          {sub.url && (
                            <a
                              href={sub.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-muted-foreground hover:text-primary shrink-0"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <span className="text-[11px] text-muted-foreground block truncate">
                          {sub.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          if (confirm(`Biztosan ${sub.status === 'archived' ? 'visszaállítod' : 'archiválod'} ezt az előfizetést?`)) {
                            onArchive(sub);
                          }
                        }}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
                        title={sub.status === 'archived' ? 'Visszaállítás' : 'Archiválás'}
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onToggleStatus(sub)}
                        className={`p-1.5 rounded-lg text-xs transition-colors ${
                          sub.isActive
                            ? 'text-emerald-500 hover:bg-emerald-500/10'
                            : 'text-muted-foreground hover:bg-muted'
                        }`}
                        title={sub.isActive ? t('pausedSub') : t('activeSub')}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEdit(sub)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="Szerkesztés"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Biztosan törölni szeretnéd a(z) ${sub.name} előfizetést?`)) {
                            onDelete(sub.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Törlés"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Címkék (Trial, Ciklus, Fizetési mód) */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border/50">
                      {sub.billingCycle === 'monthly' ? t('monthly') : sub.billingCycle === 'yearly' ? t('yearly') : sub.billingCycle === 'quarterly' ? t('quarterly') : t('weekly')}
                    </span>
                    {sub.paymentMethod && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border/50">
                        {sub.paymentMethod}
                      </span>
                    )}
                    {sub.isTrial && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-500 border border-amber-500/30">
                        Próbaidőszak
                      </span>
                    )}
                  </div>
                </div>

                {/* Alsó sáv: Összeg és Levonás dátuma */}
                <div className="pt-3 border-t border-border flex items-end justify-between">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                      Következő levonás
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      {sub.nextBillingDate}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold text-foreground block">
                      {formatMoney(sub.amount, sub.currency)}
                    </span>
                    {sub.currency !== 'HUF' && (
                      <span className="text-[10px] text-muted-foreground block">
                        ~{formatMoney(monthlyHuf, 'HUF')} / hó
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (

        /* Táblázat Nézet */
        <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/40 border-b border-border text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3 px-4">Szolgáltatás</th>
                  <th className="py-3 px-4">Kategória</th>
                  <th className="py-3 px-4">Összeg</th>
                  <th className="py-3 px-4">Ciklus</th>
                  <th className="py-3 px-4">Havi egyenérték</th>
                  <th className="py-3 px-4">Következő levonás</th>
                  <th className="py-3 px-4">Fizetési mód</th>
                  <th className="py-3 px-4">Státusz</th>
                  <th className="py-3 px-4 text-right">Műveletek</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sorted.map((sub) => {
                  const monthlyHuf = Math.round(getMonthlyEquivalentHuf(sub));
                  return (
                    <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-semibold text-foreground">
                        <div className="flex items-center gap-2.5">
                          <ServiceIcon name={sub.icon} domain={sub.domain} color={sub.color} className="w-7 h-7 shrink-0 p-1.5" />
                          <span>{sub.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{sub.category}</td>
                      <td className="py-3 px-4 font-bold text-foreground">
                        {formatMoney(sub.amount, sub.currency)}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {sub.billingCycle === 'monthly' ? 'Havi' : sub.billingCycle === 'yearly' ? 'Éves' : sub.billingCycle === 'quarterly' ? 'Negyedéves' : 'Heti'}
                      </td>
                      <td className="py-3 px-4 font-medium text-foreground">
                        {formatMoney(monthlyHuf, 'HUF')}
                      </td>
                      <td className="py-3 px-4 text-foreground">{sub.nextBillingDate}</td>
                      <td className="py-3 px-4 text-muted-foreground">{sub.paymentMethod || '-'}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            sub.status === 'archived'
                              ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                              : sub.isActive
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {sub.status === 'archived' ? t('archivedSub') : sub.isActive ? t('activeSub') : t('pausedSub')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                        onClick={() => {
                          if (confirm(`Biztosan ${sub.status === 'archived' ? 'visszaállítod' : 'archiválod'} ezt az előfizetést?`)) {
                            onArchive(sub);
                          }
                        }}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
                        title={sub.status === 'archived' ? 'Visszaállítás' : 'Archiválás'}
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                      <button
                            onClick={() => {
                              if (confirm(`Biztosan ${sub.status === 'archived' ? 'visszaállítod' : 'archiválod'} ezt az előfizetést?`)) {
                                onArchive(sub);
                              }
                            }}
                            className="p-1 rounded text-muted-foreground hover:text-amber-500"
                            title={sub.status === 'archived' ? 'Visszaállítás' : 'Archiválás'}
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onToggleStatus(sub)}
                            className="p-1 rounded text-muted-foreground hover:text-emerald-500"
                            title="Státusz váltása"
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEdit(sub)}
                            className="p-1 rounded text-muted-foreground hover:text-foreground"
                            title="Szerkesztés"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Biztosan törölni szeretnéd a(z) ${sub.name} előfizetést?`)) {
                                onDelete(sub.id);
                              }
                            }}
                            className="p-1 rounded text-muted-foreground hover:text-destructive"
                            title="Törlés"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
