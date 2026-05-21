'use client';

import { createBrowserClient } from '@supabase/auth-helpers-nextjs';

export default function LoginPage() {
  const login = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${location.origin}/dashboard` } });
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6">
      <div className="card w-full space-y-4 text-center">
        <h1 className="text-2xl font-bold">イベント在庫管理</h1>
        <p className="text-sm text-slate-500">Googleアカウントでログインしてください</p>
        <button onClick={login} className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white">Googleでログイン</button>
      </div>
    </main>
  );
}
