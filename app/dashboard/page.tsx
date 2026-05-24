import Link from 'next/link';
import { getSupabaseServer } from '@/lib/supabase-server';
import { InventoryTable } from '@/components/inventory-table';
import { InventoryItem } from '@/types/db';
import { getStatus } from '@/lib/inventory';

export default async function DashboardPage() {
  const supabase = getSupabaseServer();
  const { data } = await supabase.from('inventory_items_view').select('*').order('updated_at', { ascending: false });
  const items = (data ?? []) as InventoryItem[];
  const lowCount = items.filter((x) => getStatus(x) !== '正常').length;

  return (
    <main className="mx-auto max-w-3xl space-y-4 p-4 sm:p-6">
      <header className="card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">EX事業部 在庫管理</h1>
          <p className="text-sm text-slate-500">不足アイテム {lowCount} 件 / 合計 {items.length} 件</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/event-app" className="rounded-xl border px-4 py-2 text-sm font-semibold">イベント管理へ</Link>
          <Link href="/items/new" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">在庫を追加</Link>
        </div>
      </header>
      {lowCount > 0 && <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-rose-700">在庫不足があります。購入申請を確認してください。</div>}
      <InventoryTable items={items} eventAppBaseUrl={process.env.NEXT_PUBLIC_EVENT_APP_URL ?? 'https://example.com/event-app'} />
    </main>
  );
}
