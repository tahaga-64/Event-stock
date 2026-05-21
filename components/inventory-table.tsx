'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { InventoryItem } from '@/types/db';
import { StatusBadge } from './status-badge';
import { getStatus } from '@/lib/inventory';

export function InventoryTable({ items, eventAppBaseUrl }: { items: InventoryItem[]; eventAppBaseUrl: string }) {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const [onlyLow, setOnlyLow] = useState(false);

  const categories = Array.from(new Set(items.map((x) => x.category_name)));

  const filtered = useMemo(() => {
    return [...items]
      .filter((i) => i.name.toLowerCase().includes(q.toLowerCase()))
      .filter((i) => category === 'all' || i.category_name === category)
      .filter((i) => !onlyLow || getStatus(i) !== '正常')
      .sort((a, b) => a.current_stock - b.current_stock);
  }, [items, q, category, onlyLow]);

  return (
    <section className="space-y-4">
      <div className="card space-y-3">
        <div className="flex items-center gap-2 rounded-xl border px-3 py-2">
          <Search size={16} className="text-slate-400" /><input placeholder="アイテム検索" className="w-full bg-transparent outline-none" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <select className="rounded-xl border px-3 py-2" onChange={(e) => setCategory(e.target.value)}>
            <option value="all">全カテゴリ</option>
            {categories.map((cat) => <option key={cat}>{cat}</option>)}
          </select>
          <label className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm"><input type="checkbox" checked={onlyLow} onChange={(e) => setOnlyLow(e.target.checked)} />不足のみ</label>
        </div>
      </div>
      <div className="space-y-3">
        {filtered.map((item) => (
          <article key={item.id} className="card space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold">{item.name}</h3><StatusBadge item={item} />
            </div>
            <p className="text-sm text-slate-500">カテゴリ: {item.category_name} / 使用イベント: {item.used_events_count}</p>
            <p className="text-sm">在庫 {item.current_stock} / 最低必要 {item.minimum_stock}</p>
            <div className="flex gap-2">
              <Link href={`/items/${item.id}/edit`} className="rounded-lg border px-3 py-1 text-sm">編集</Link>
              <a href={`${eventAppBaseUrl}?item=${encodeURIComponent(item.name)}&qty=${item.minimum_stock - item.current_stock}`} target="_blank" className="rounded-lg bg-rose-600 px-3 py-1 text-sm text-white">購入申請</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
