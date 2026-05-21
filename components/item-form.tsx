'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase';

export function ItemForm({ mode, initial }: { mode: 'create' | 'edit'; initial?: any }) {
  const router = useRouter();
  const [form, setForm] = useState(initial ?? { name: '', current_stock: 0, minimum_stock: 0, category_id: '', memo: '' });
  const [error, setError] = useState('');

  const save = async () => {
    if (!form.name) return setError('アイテム名は必須です');
    const supabase = getSupabaseBrowser();
    const payload = { ...form, current_stock: Number(form.current_stock), minimum_stock: Number(form.minimum_stock) };
    const res = mode === 'create'
      ? await supabase.from('inventory_items').insert(payload)
      : await supabase.from('inventory_items').update(payload).eq('id', initial.id);
    if (res.error) return setError(res.error.message);
    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="card space-y-3">
      <input className="w-full rounded-xl border px-3 py-2" placeholder="アイテム名" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input className="w-full rounded-xl border px-3 py-2" placeholder="カテゴリID" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} />
      <div className="grid grid-cols-2 gap-2">
        <input type="number" className="w-full rounded-xl border px-3 py-2" placeholder="現在庫" value={form.current_stock} onChange={(e) => setForm({ ...form, current_stock: Number(e.target.value) })} />
        <input type="number" className="w-full rounded-xl border px-3 py-2" placeholder="最低必要" value={form.minimum_stock} onChange={(e) => setForm({ ...form, minimum_stock: Number(e.target.value) })} />
      </div>
      <textarea className="w-full rounded-xl border px-3 py-2" rows={4} placeholder="メモ" value={form.memo} onChange={(e) => setForm({ ...form, memo: e.target.value })} />
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <button className="w-full rounded-xl bg-blue-600 px-4 py-3 text-white" onClick={save}>{mode === 'create' ? '追加する' : '更新する'}</button>
    </div>
  );
}
