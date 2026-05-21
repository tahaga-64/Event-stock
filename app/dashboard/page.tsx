import Link from 'next/link';
import { getSupabaseServer } from '@/lib/supabase';
import { InventoryTable } from '@/components/inventory-table';
import { InventoryItem } from '@/types/db';
import { getStatus } from '@/lib/inventory';

export default async function DashboardPage() {
  const supabase = getSupabaseServer();
  const { data } = await supabase.from('inventory_items_view').select('*').order('updated_at', { ascending: false });
  const items = ((data ?? []) as InventoryItem[]);
  const lowCount = items.filter((x) => getStatus(x) !== '正常').length;

  return (
    <main className="mx-auto max-w-2xl space-y-4 p-4">
      <header className="card flex items-center justify-between">
        <div><h1 className="text-xl font-bold">在庫ダッシュボード</h1><p className="text-sm text-slate-500">不足アイテム {lowCount} 件</p></div>
        <Link href="/items/new" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">追加</Link>
      </header>
      {lowCount > 0 && <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-rose-700">在庫不足があります。購入申請を確認してください。</div>}
      <InventoryTable items={items} eventAppBaseUrl={process.env.NEXT_PUBLIC_EVENT_APP_URL ?? 'https://example-event-app.com/purchase'} />
    </main>
  );
}
