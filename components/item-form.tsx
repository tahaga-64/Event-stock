'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import type { InventoryItemInput } from '@/types/db';

type ItemFormProps = {
  mode: 'create' | 'edit';
  initial?: InventoryItemInput;
};

const emptyForm: InventoryItemInput = {
  name: '',
  current_stock: 0,
  minimum_stock: 0,
  category_name: '',
  used_events_count: 0,
  memo: ''
};

export function ItemForm({ mode, initial }: ItemFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<InventoryItemInput>(initial ?? emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const shortage = useMemo(() => Math.max(form.minimum_stock - form.current_stock, 0), [form.minimum_stock, form.current_stock]);

  const save = async () => {
    if (!form.name.trim()) return setError('アイテム名は必須です');
    if (!form.category_name.trim()) return setError('カテゴリ名は必須です');

    setSaving(true);
    setError('');

    const supabase = getSupabaseBrowser();
    const payload = {
      name: form.name.trim(),
      current_stock: Number(form.current_stock),
      minimum_stock: Number(form.minimum_stock),
      category_name: form.category_name.trim(),
      used_events_count: Number(form.used_events_count),
      memo: form.memo.trim()
    };

    const res = mode === 'create'
      ? await supabase.from('inventory_items').insert(payload)
      : await supabase.from('inventory_items').update(payload).eq('id', initial?.id ?? '');

    if (res.error) {
      setError(res.error.message);
      setSaving(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="card space-y-4">
      <h1 className="text-xl font-bold">{mode === 'create' ? '在庫を追加' : '在庫を編集'}</h1>
      <div className="space-y-2">
        <label htmlFor="item-name" className="text-sm font-medium">アイテム名</label>
        <input id="item-name" className="w-full rounded-xl border px-3 py-3" placeholder="例）延長コード" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div className="space-y-2">
        <label htmlFor="category-name" className="text-sm font-medium">カテゴリ</label>
        <input id="category-name" className="w-full rounded-xl border px-3 py-3" placeholder="例）電源・配線" value={form.category_name} onChange={(e) => setForm({ ...form, category_name: e.target.value })} />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="current-stock" className="text-sm font-medium">現在庫</label>
          <input id="current-stock" type="number" className="w-full rounded-xl border px-3 py-3" value={form.current_stock} onChange={(e) => setForm({ ...form, current_stock: Number(e.target.value) })} />
        </div>
        <div className="space-y-2">
          <label htmlFor="minimum-stock" className="text-sm font-medium">最低必要在庫</label>
          <input id="minimum-stock" type="number" className="w-full rounded-xl border px-3 py-3" value={form.minimum_stock} onChange={(e) => setForm({ ...form, minimum_stock: Number(e.target.value) })} />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="used-events-count" className="text-sm font-medium">使用イベント回数（任意）</label>
        <input id="used-events-count" type="number" className="w-full rounded-xl border px-3 py-3" value={form.used_events_count} onChange={(e) => setForm({ ...form, used_events_count: Number(e.target.value) })} />
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">不足予定数: <strong>{shortage}</strong> 個</div>
      <div className="space-y-2">
        <label className="text-sm font-medium">メモ</label>
        <textarea className="w-full rounded-xl border px-3 py-2" rows={4} placeholder="保管場所や注意点を記録" value={form.memo} onChange={(e) => setForm({ ...form, memo: e.target.value })} />
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <button disabled={saving} className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50" onClick={save}>{saving ? '保存中...' : mode === 'create' ? '追加する' : '更新する'}</button>
    </div>
  );
}
