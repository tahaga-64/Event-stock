const pages = [
  ["/", "Dashboard", "EventStock のホームです。"],
  ["/inventory", "Inventory List", "在庫アイテム一覧、数量、最小在庫、購入ステータスを確認します。"],
  ["/InventoryDetail", "Inventory Detail", "アイテム詳細・在庫推移・メモ・関連イベントを確認します。"],
  ["/inventory/new", "Inventory Form", "在庫アイテムの新規追加・編集フォームです。"],
  ["/events", "Events", "イベントごとに必要備品と割当状況を管理します。"],
  ["/categories", "Categories", "備品カテゴリを追加・編集し、管理しやすく分類します。"],
  ["/settings", "Settings", "通知設定・表示設定・在庫閾値の既定値を管理します。"],
];

const nav = document.getElementById('nav');
const app = document.getElementById('app');

function render() {
  const path = window.location.pathname;
  const current = pages.find(([p]) => p === path) || pages[0];

  nav.innerHTML = pages.map(([p, name]) => `<a class="${p===current[0]?'active':''}" href="${p}">${name}</a>`).join('');

  app.innerHTML = `
    <section class="card">
      <h2>${current[1]} | EventStock</h2>
      <p>${current[1]} on EventStock. イベント運営に特化した、シンプルで直感的な在庫・備品管理アプリ。不足アイテムの可視化と購入管理を一元化し、イベント準備を効率化します。</p>
      <h3>Pages</h3>
      <ul>${pages.map(([,name]) => `<li>${name}</li>`).join('')}</ul>
      <hr/>
      <p>${current[2]}</p>
    </section>`;
}

render();
