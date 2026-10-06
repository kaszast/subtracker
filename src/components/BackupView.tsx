'use client';

import React, { useState } from 'react';
import { Subscription } from '@/types';
import { 
  Download, 
  Upload, 
  FileJson, 
  FileSpreadsheet, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  HardDrive
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface BackupViewProps {
  subscriptions: Subscription[];
  onRefreshData: () => Promise<void>;
}

export const BackupView: React.FC<BackupViewProps> = ({
  subscriptions,
  onRefreshData
}) => {
  const { t } = useLanguage();
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('replace');
  const [isImporting, setIsImporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 1. JSON Exportálás
  const handleExportJson = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      count: subscriptions.length,
      subscriptions
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elofizetesek_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 2. CSV Exportálás
  const handleExportCsv = () => {
    const headers = [
      'ID', 'Név', 'Összeg', 'Deviza', 'Ciklus', 'Következő levonás',
      'Kategória', 'Fizetési mód', 'Aktív', 'Próbaidőszak', 'Próba lejárata', 'Jegyzet', 'URL'
    ];

    const rows = subscriptions.map(sub => [
      sub.id,
      `"${sub.name.replace(/"/g, '""')}"`,
      sub.amount,
      sub.currency,
      sub.billingCycle,
      sub.nextBillingDate,
      `"${sub.category.replace(/"/g, '""')}"`,
      `"${(sub.paymentMethod || '').replace(/"/g, '""')}"`,
      sub.isActive ? '1' : '0',
      sub.isTrial ? '1' : '0',
      sub.trialEndDate || '',
      `"${(sub.notes || '').replace(/"/g, '""')}"`,
      `"${(sub.url || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elofizetesek_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 3. JSON Importálás
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (importMode === 'replace') {
      const confirmed = confirm(t('backupConfirm'));
      if (!confirmed) {
        event.target.value = '';
        return;
      }
    }

    try {
      setIsImporting(true);
      setStatusMessage(null);

      const fileText = await file.text();
      const parsed = JSON.parse(fileText);

      const res = await fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptions: parsed.subscriptions || parsed,
          mode: importMode
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Importálási hiba történt');
      }

      setStatusMessage({
        type: 'success',
        text: `{t('successImport')}: ${data.count} db előfizetés betöltve!`
      });

      await onRefreshData();
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: `{t('errorImport')}: ${err.message}`
      });
    } finally {
      setIsImporting(false);
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Cím és leírás */}
      <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              {t('backupTitle')}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('backupDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* Állapot visszajelzés */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-semibold ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
              : 'bg-destructive/10 border-destructive/30 text-destructive'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* 2 Oszlop: Export & Import */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Export kártya */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="border-b border-border pb-3 mb-4">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Download className="w-4 h-4 text-primary" />
                {t('exportData')}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('currentSaved')} {subscriptions.length} db
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-secondary/30 border border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <FileJson className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">{t('downloadBackup')}</div>
                    <div className="text-[11px] text-muted-foreground">{t('formatDesc')}</div>
                  </div>
                </div>
                <button
                  onClick={handleExportJson}
                  className="px-3 py-1.5 rounded-lg bg-primary hover:bg-accent text-primary-foreground text-xs font-semibold shadow-sm transition-colors"
                >
                  {t('download')}
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-secondary/30 border border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">{t('csvTitle')}</div>
                    <div className="text-[11px] text-muted-foreground">{t('csvDesc')}</div>
                  </div>
                </div>
                <button
                  onClick={handleExportCsv}
                  className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-foreground text-xs font-semibold shadow-sm transition-colors"
                >
                  {t('download')}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border mt-4 text-[11px] text-muted-foreground">
            {t('jsonPreserve')}
          </div>
        </div>

        {/* Import kártya */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="border-b border-border pb-3 mb-4">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-500" />
                {t('restoreBackup')}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('restoreDesc')}
              </p>
            </div>

            {/* Mód választó */}
            <div className="p-3 rounded-xl bg-secondary/30 border border-border mb-4 space-y-2">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                {t('readMode')}
              </span>
              
              <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                <input
                  type="radio"
                  name="importMode"
                  value="replace"
                  checked={importMode === 'replace'}
                  onChange={() => setImportMode('replace')}
                  className="text-primary focus:ring-primary"
                />
                <span><strong>{t('backupOverwrite')}</strong> {t('backupOverwriteDesc')}</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                <input
                  type="radio"
                  name="importMode"
                  value="merge"
                  checked={importMode === 'merge'}
                  onChange={() => setImportMode('merge')}
                  className="text-primary focus:ring-primary"
                />
                <span><strong>{t('backupMerge')}</strong> {t('backupMergeDesc')}</span>
              </label>
            </div>

            {/* Fájl feltöltő doboz */}
            <label className="border-2 border-dashed border-border hover:border-primary/60 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-secondary/10 hover:bg-secondary/30">
              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
              <span className="text-xs font-semibold text-foreground">
                {isImporting ? 'Feldolgozás...' : t('clickToSelect')}
              </span>
              <span className="text-[11px] text-muted-foreground mt-0.5">
                {t('jsonSupported')}
              </span>
              <input
                type="file"
                accept=".json"
                disabled={isImporting}
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="pt-4 border-t border-border mt-4 text-[11px] text-muted-foreground flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-primary" />
            {t('autoRefresh')}
          </div>
        </div>

      </div>

    </div>
  );
};
