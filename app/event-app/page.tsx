import Link from 'next/link';

export default function EventAppPage() {
  const targetUrl = process.env.NEXT_PUBLIC_EVENT_APP_URL ?? 'https://example.com/event-app';

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl items-center p-4 sm:p-6">
      <section className="card w-full space-y-4">
        <h1 className="text-2xl font-bold">イベント管理アプリへ移動</h1>
        <p className="text-sm text-slate-600">イベント管理アプリのURLは後から環境変数で設定できます。現在は仮URLを使用しています。</p>
        <a href={targetUrl} target="_blank" className="block rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white">イベント管理アプリを開く</a>
        <Link href="/dashboard" className="block rounded-xl border px-4 py-3 text-center font-semibold">在庫管理へ戻る</Link>
      </section>
    </main>
  );
}
