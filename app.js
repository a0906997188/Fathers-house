/* =========================================================
   阿爸的家園 — 線上點餐與營養諮詢平台（純前端示範）
   資料以 localStorage 保存，無需後端，可直接部署至 GitHub Pages
   ========================================================= */
(() => {
  'use strict';

  /* ---------------- 資料：分類 ---------------- */
  const CATEGORIES = [
    { id: 'muscle',  name: '💪 增肌減脂',   desc: '高蛋白、低碳水，精準控制熱量', bg: 'linear-gradient(135deg,#FFE3B3,#FFC46B)' },
    { id: 'gut',     name: '🌿 調整腸胃',   desc: '溫潤纖維、好消化好吸收',       bg: 'linear-gradient(135deg,#DFF5E3,#A8E0B5)' },
    { id: 'sport',   name: '🏃 運動營養',   desc: '運動前後的能量與蛋白質補給',   bg: 'linear-gradient(135deg,#D6ECFA,#95CBEF)' },
    { id: 'pregnant',name: '🤰 孕期營養',   desc: '葉酸、鈣、鐵與優質蛋白質',     bg: 'linear-gradient(135deg,#FDE2E4,#F7B7BE)' },
    { id: 'senior',  name: '👴 銀髮族保養', desc: '軟嫩好咀嚼，少油少鹽',         bg: 'linear-gradient(135deg,#EFE6FA,#CDB8EE)' },
    { id: 'kids',    name: '🧒 兒童健康成長', desc: '均衡營養，小朋友也愛吃',     bg: 'linear-gradient(135deg,#FFF5C2,#FFE070)' },
    { id: 'drinks',  name: '🥤 人氣飲品與點心', desc: '活力果汁、養生甜湯',       bg: 'linear-gradient(135deg,#FFE0D1,#FFB38F)' },
  ];

  /* ---------------- 資料：客製化選項 ---------------- */
  const OPTION_GROUPS = {
    portion: { title: '份量調整', type: 'radio', choices: [
      { n: '標準份量', p: 0 }, { n: '大份量（蛋白質加量）', p: 40 }, { n: '小份量（輕盈）', p: -10 } ] },
    staple: { title: '主食選擇', type: 'radio', choices: [
      { n: '糙米飯', p: 0 }, { n: '藜麥飯', p: 15 }, { n: '烤地瓜', p: 10 }, { n: '主食減半', p: 0 } ] },
    sweet: { title: '甜度', type: 'radio', choices: [
      { n: '正常甜', p: 0 }, { n: '少糖', p: 0 }, { n: '半糖', p: 0 }, { n: '微糖', p: 0 }, { n: '無糖', p: 0 } ] },
    ice: { title: '冰塊', type: 'radio', choices: [
      { n: '正常冰', p: 0 }, { n: '少冰', p: 0 }, { n: '去冰', p: 0 }, { n: '常溫', p: 0 } ] },
    temp: { title: '溫度', type: 'radio', choices: [
      { n: '熱', p: 0 }, { n: '溫', p: 0 }, { n: '冰', p: 0 } ] },
    mealAdd: { title: '加料', type: 'check', choices: [
      { n: '舒肥雞胸', p: 45 }, { n: '水煮蛋', p: 15 }, { n: '酪梨', p: 30 }, { n: '加量蔬菜', p: 20 } ] },
    drinkAdd: { title: '加料', type: 'check', choices: [
      { n: '奇亞籽', p: 15 }, { n: '乳清蛋白', p: 30 }, { n: '燕麥', p: 10 }, { n: '椰果', p: 10 } ] },
    soupAdd: { title: '加料', type: 'check', choices: [
      { n: '山藥', p: 20 }, { n: '枸杞', p: 10 }, { n: '蓮子', p: 15 } ] },
  };
  const OPTION_SETS = {
    meal:      ['portion', 'staple', 'mealAdd'],
    warm:      ['portion', 'temp', 'soupAdd'],
    drink:     ['sweet', 'ice', 'drinkAdd'],
    warmDrink: ['sweet', 'temp', 'drinkAdd'],
    dessert:   ['sweet', 'temp'],
    snack:     [],
  };

  /* ---------------- 資料：商品 ----------------
     set: true 代表可使用「$49 套餐體驗價」 */
  const PRODUCTS = [
    // 增肌減脂
    { id: 'm1', cat: 'muscle', name: '舒肥雞胸能量餐盒', emoji: '🍱', price: 160, kcal: 520, protein: 42, carb: 48, fat: 12, opt: 'meal', set: true, hot: true,
      desc: '低溫舒肥雞胸搭配糙米與五色時蔬，一盒滿足增肌所需蛋白質。', ing: '雞胸肉、糙米、花椰菜、玉米筍、紅蘿蔔、溏心蛋、橄欖油' },
    { id: 'm2', cat: 'muscle', name: '炙燒鮭魚藜麥碗', emoji: '🐟', price: 220, kcal: 580, protein: 35, carb: 46, fat: 24, opt: 'meal', set: true,
      desc: '富含 Omega-3 的炙燒鮭魚，搭配高纖藜麥與酪梨。', ing: '挪威鮭魚、藜麥、酪梨、毛豆、紫甘藍、和風醬' },
    { id: 'm3', cat: 'muscle', name: '低脂牛腱溫沙拉', emoji: '🥗', price: 190, kcal: 430, protein: 38, carb: 22, fat: 16, opt: 'meal',
      desc: '慢燉牛腱切片，低脂高鐵，搭配溫蔬與優格醬。', ing: '牛腱、羽衣甘藍、烤南瓜、小番茄、希臘優格醬' },
    { id: 'm4', cat: 'muscle', name: '高蛋白可可燕麥飲', emoji: '🍫', price: 95, kcal: 260, protein: 25, carb: 28, fat: 5, opt: 'drink',
      desc: '無糖可可結合乳清蛋白與燕麥，健身後的美味補給。', ing: '乳清蛋白、無糖可可粉、燕麥奶、燕麥' },
    // 調整腸胃
    { id: 'g1', cat: 'gut', name: '山藥小米養胃粥', emoji: '🥣', price: 110, kcal: 320, protein: 9, carb: 58, fat: 4, opt: 'warm', hot: true,
      desc: '慢火熬煮的小米與日本山藥，溫潤順口不傷胃。', ing: '小米、日本山藥、紅棗、薑片' },
    { id: 'g2', cat: 'gut', name: '益生菌優格燕麥杯', emoji: '🥛', price: 85, kcal: 240, protein: 12, carb: 32, fat: 6, opt: 'dessert',
      desc: '活性益生菌優格層疊燕麥與季節水果，幫助消化。', ing: '無糖優格、燕麥、奇異果、藍莓、蜂蜜' },
    { id: 'g3', cat: 'gut', name: '南瓜鮮蔬溫湯', emoji: '🎃', price: 90, kcal: 180, protein: 5, carb: 30, fat: 4, opt: 'warm',
      desc: '金黃南瓜與根莖蔬菜熬成濃湯，富含膳食纖維。', ing: '南瓜、洋蔥、紅蘿蔔、馬鈴薯、鮮奶' },
    { id: 'g4', cat: 'gut', name: '地瓜高纖蔬食餐', emoji: '🍠', price: 150, kcal: 450, protein: 18, carb: 66, fat: 11, opt: 'meal', set: true,
      desc: '烤地瓜、豆腐與多樣蔬菜，給腸道滿滿的纖維。', ing: '黃金地瓜、板豆腐、秋葵、香菇、海帶芽' },
    // 運動營養
    { id: 's1', cat: 'sport', name: '乳清蛋白香草奶昔', emoji: '🥤', price: 120, kcal: 220, protein: 30, carb: 14, fat: 4, opt: 'drink', hot: true,
      desc: '每杯 30g 乳清蛋白，運動後 30 分鐘黃金補充。', ing: '分離乳清蛋白、低脂鮮奶、香草' },
    { id: 's2', cat: 'sport', name: '香蕉花生能量飲', emoji: '🍌', price: 90, kcal: 310, protein: 12, carb: 40, fat: 11, opt: 'drink',
      desc: '香蕉快速補充肝醣，花生醬提供優質脂肪。', ing: '香蕉、無糖花生醬、燕麥奶、肉桂' },
    { id: 's3', cat: 'sport', name: '運動恢復電解飲', emoji: '🧃', price: 65, kcal: 90, protein: 0, carb: 22, fat: 0, opt: 'drink',
      desc: '椰子水基底，補充流汗流失的電解質。', ing: '椰子水、檸檬、海鹽、蜂蜜' },
    { id: 's4', cat: 'sport', name: '堅果能量棒（2 入）', emoji: '🥜', price: 70, kcal: 280, protein: 10, carb: 26, fat: 15, opt: 'snack',
      desc: '無添加糖，運動前的方便能量補給。', ing: '杏仁、腰果、椰棗、燕麥、南瓜籽' },
    // 孕期營養
    { id: 'p1', cat: 'pregnant', name: '鮮魚豆腐葉酸餐', emoji: '🍲', price: 200, kcal: 540, protein: 34, carb: 52, fat: 18, opt: 'meal', set: true, hot: true,
      desc: '鱸魚、豆腐與深綠色蔬菜，補充葉酸與鈣質。', ing: '金目鱸魚、嫩豆腐、菠菜、地瓜葉、五穀飯' },
    { id: 'p2', cat: 'pregnant', name: '黑芝麻核桃牛奶', emoji: '🥛', price: 85, kcal: 280, protein: 11, carb: 22, fat: 16, opt: 'warmDrink',
      desc: '高鈣黑芝麻搭配核桃，溫和補充好油脂。', ing: '黑芝麻、核桃、鮮奶、黑糖' },
    { id: 'p3', cat: 'pregnant', name: '紅棗枸杞燉雞湯', emoji: '🍵', price: 180, kcal: 350, protein: 28, carb: 14, fat: 18, opt: 'warm',
      desc: '小火慢燉 4 小時，溫補不燥熱。', ing: '土雞腿、紅棗、枸杞、黃耆、薑' },
    // 銀髮族保養
    { id: 'e1', cat: 'senior', name: '嫩煮雞肉蔬菜燉飯', emoji: '🍚', price: 150, kcal: 460, protein: 26, carb: 60, fat: 10, opt: 'meal', set: true,
      desc: '米飯燉得軟嫩，雞肉切丁，好咀嚼好入口。', ing: '雞腿肉、白米、南瓜、紅蘿蔔、高麗菜' },
    { id: 'e2', cat: 'senior', name: '鮮蔬蒸蛋豆腐餐', emoji: '🥚', price: 130, kcal: 380, protein: 22, carb: 40, fat: 13, opt: 'meal',
      desc: '滑嫩蒸蛋與豆腐，補充好吸收的蛋白質。', ing: '雞蛋、嫩豆腐、蝦仁、青江菜、白飯' },
    { id: 'e3', cat: 'senior', name: '黑豆漿燕麥糊', emoji: '🍶', price: 70, kcal: 220, protein: 10, carb: 30, fat: 6, opt: 'warmDrink',
      desc: '黑豆漿與燕麥細磨成糊，溫暖又飽足。', ing: '黑豆、燕麥、黑芝麻' },
    // 兒童健康成長
    { id: 'k1', cat: 'kids', name: '彩虹蔬菜雞肉飯糰', emoji: '🍙', price: 95, kcal: 380, protein: 18, carb: 54, fat: 9, opt: 'snack',
      desc: '把蔬菜藏進可愛飯糰裡，挑食寶貝也愛吃。', ing: '雞肉鬆、玉米、紅蘿蔔、毛豆、海苔' },
    { id: 'k2', cat: 'kids', name: '牛奶蒸蛋布丁', emoji: '🍮', price: 60, kcal: 180, protein: 7, carb: 22, fat: 7, opt: 'dessert',
      desc: '鮮奶與雞蛋蒸出的天然布丁，補鈣又好吃。', ing: '鮮奶、雞蛋、少量蔗糖' },
    { id: 'k3', cat: 'kids', name: '小勇士鮮魚寶寶餐', emoji: '🐠', price: 160, kcal: 480, protein: 26, carb: 58, fat: 14, opt: 'meal', set: true,
      desc: '去刺鮮魚排、蔬菜與水果，成長必需營養一次到位。', ing: '鯛魚排、白飯、綠花椰、玉米、蘋果片' },
    // 飲品與點心
    { id: 'd1', cat: 'drinks', name: '陽光芒果活力果汁', emoji: '🥭', price: 80, kcal: 160, protein: 2, carb: 38, fat: 0, opt: 'drink', hot: true,
      desc: '台灣愛文芒果現打，滿滿夏日陽光的味道。', ing: '愛文芒果、柳橙、百香果' },
    { id: 'd2', cat: 'drinks', name: '綠拿鐵蔬果昔', emoji: '🥬', price: 85, kcal: 140, protein: 3, carb: 30, fat: 1, opt: 'drink',
      desc: '羽衣甘藍、蘋果與香蕉，清爽排毒好喝。', ing: '羽衣甘藍、蘋果、香蕉、檸檬' },
    { id: 'd3', cat: 'drinks', name: '酪梨香蕉思慕昔', emoji: '🥑', price: 95, kcal: 290, protein: 6, carb: 30, fat: 16, opt: 'drink',
      desc: '綿密酪梨搭配香蕉，健康的天然甜味。', ing: '酪梨、香蕉、燕麥奶、蜂蜜' },
    { id: 'd4', cat: 'drinks', name: '桂圓紅棗養生甜湯', emoji: '🍯', price: 70, kcal: 230, protein: 3, carb: 52, fat: 1, opt: 'dessert',
      desc: '阿爸的古早味，暖心又暖胃。', ing: '桂圓、紅棗、白木耳、黑糖' },
    { id: 'd5', cat: 'drinks', name: '綠豆薏仁湯', emoji: '🍧', price: 60, kcal: 200, protein: 7, carb: 40, fat: 1, opt: 'dessert',
      desc: '消暑退火的夏日經典甜湯。', ing: '綠豆、薏仁、二砂糖' },
  ];
  const productById = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
  const catById = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));

  /* ---------------- 資料：優惠券 ---------------- */
  const COUPONS = {
    TRY49:    { label: '$49', title: '套餐體驗價 49 元', desc: '任選一份標示「體驗價 $49」的套餐，享體驗價 $49（加料另計），每人限體驗乙次。', type: 'try49' },
    SUMMER50: { label: '折$50', title: '夏日滿額折 $50', desc: '消費滿 $350 現折 $50。', type: 'amount', min: 350, value: 50 },
    FIT90:    { label: '9 折', title: '健康目標 9 折', desc: '全品項 9 折，最高折抵 $80。', type: 'percent', rate: 0.1, max: 80 },
  };

  const PACKAGING_FEE = 5;      // 每份包材費
  const DELIVERY_FEE = 39;      // 外送費
  const FREE_DELIVERY = 499;    // 滿額免運
  const STORES = ['阿爸的家園 台北信義店', '阿爸的家園 新北板橋店', '阿爸的家園 台中勤美店'];

  const GOALS = {
    lose:     { name: '減脂',   kcal: 1600, protein: 100, cats: ['muscle', 'gut'],     tip: '每餐優先吃蛋白質與蔬菜，主食可選「主食減半」，搭配每週 3 次運動效果更好。' },
    gain:     { name: '增肌',   kcal: 2400, protein: 140, cats: ['muscle', 'sport'],   tip: '每公斤體重攝取 1.6–2g 蛋白質，運動後 30 分鐘內補充蛋白飲。' },
    gut:      { name: '腸胃調理', kcal: 1800, protein: 70, cats: ['gut', 'senior'],    tip: '少量多餐、細嚼慢嚥，多攝取溫熱的膳食纖維與益生菌。' },
    pregnant: { name: '孕期營養', kcal: 2100, protein: 80, cats: ['pregnant', 'gut'],  tip: '孕中後期每日約增加 300 大卡，注意葉酸、鈣與鐵質的補充。' },
    senior:   { name: '銀髮保養', kcal: 1700, protein: 75, cats: ['senior', 'gut'],    tip: '銀髮族更需要足夠蛋白質預防肌少症，選擇軟嫩好咀嚼的料理。' },
    kids:     { name: '兒童成長', kcal: 1600, protein: 50, cats: ['kids', 'drinks'],   tip: '成長期需要均衡的鈣質與蛋白質，以天然食物取代含糖零食。' },
  };

  /* ---------------- 狀態與儲存 ---------------- */
  const STORAGE_KEY = 'abaHome.v1';
  const defaultState = () => ({
    mode: 'delivery',
    address: '',
    store: STORES[0],
    cart: [],
    orders: [],
    wallet: {},          // { CODE: { claimedAt, used } }
    profile: { name: '', phone: '' },
    health: { goal: 'lose', kcal: 1600, protein: 100, weights: [] },
    consults: [],
  });
  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return Object.assign(defaultState(), JSON.parse(raw));
    } catch (e) { /* 無法讀取時使用預設值 */ }
    return defaultState();
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* 隱私模式等 */ }
  }

  /* ---------------- 工具 ---------------- */
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const money = n => '$' + Math.round(n).toLocaleString('zh-TW');
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmtTime = ts => new Date(ts).toLocaleString('zh-TW', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
  const isToday = ts => new Date(ts).toDateString() === new Date().toDateString();

  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  /* =========================================================
     菜單渲染
     ========================================================= */
  function cardHTML(p) {
    const cat = catById[p.cat];
    return `
      <article class="card" tabindex="0" data-pid="${p.id}" aria-label="${esc(p.name)}，${money(p.price)}">
        <div class="thumb" style="background:${cat.bg}">
          <span class="emoji" aria-hidden="true">${p.emoji}</span>
          ${p.set ? '<span class="tag-set">體驗價 $49</span>' : ''}
          ${p.hot ? '<span class="tag-hot">人氣</span>' : ''}
        </div>
        <div class="card-body">
          <h3>${esc(p.name)}</h3>
          <p class="card-desc">${esc(p.desc)}</p>
          <div class="nutri">
            ${p.protein ? `<span>蛋白質 ${p.protein}g</span>` : ''}
            <span class="kcal">${p.kcal} kcal</span>
            ${p.kcal <= 250 ? '<span>低卡</span>' : ''}
          </div>
          <div class="card-foot">
            <span class="price"><small>$</small>${p.price}</span>
            <button type="button" class="add-btn" data-quick="${p.id}" aria-label="加入購物車：${esc(p.name)}">+</button>
          </div>
        </div>
      </article>`;
  }

  function renderMenu() {
    const kw = $('#searchInput').value.trim().toLowerCase();
    let visibleCount = 0;
    $('#menuSections').innerHTML = CATEGORIES.map(c => {
      const items = PRODUCTS.filter(p => p.cat === c.id &&
        (!kw || (p.name + p.desc + p.ing + c.name).toLowerCase().includes(kw)));
      visibleCount += items.length;
      if (!items.length) return '';
      return `
        <section class="menu-section" id="cat-${c.id}" data-cat="${c.id}">
          <div class="section-head"><h2>${c.name}</h2><p>${c.desc}</p></div>
          <div class="grid">${items.map(cardHTML).join('')}</div>
        </section>`;
    }).join('');
    $('#emptySearch').hidden = visibleCount > 0;
    $('#emptyKeyword').textContent = kw;
    observeSections();
  }

  function renderCatNav() {
    $('#catScroll').innerHTML = CATEGORIES.map((c, i) =>
      `<button type="button" class="cat-pill${i === 0 ? ' active' : ''}" data-target="${c.id}">${c.name}</button>`).join('');
  }

  // Scroll spy：滾動時自動標示目前分類
  let sectionObserver;
  function observeSections() {
    if (!('IntersectionObserver' in window)) return;
    if (sectionObserver) sectionObserver.disconnect();
    sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActivePill(entry.target.dataset.cat);
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    $$('.menu-section').forEach(s => sectionObserver.observe(s));
  }
  function setActivePill(id) {
    $$('.cat-pill').forEach(b => {
      const on = b.dataset.target === id;
      b.classList.toggle('active', on);
      if (on) b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    });
  }

  /* =========================================================
     彈出視窗
     ========================================================= */
  let modalOnClose = null;
  let lastFocus = null;
  function openModal(html, { wide = false, onClose = null } = {}) {
    lastFocus = document.activeElement;
    $('#modalContent').innerHTML = html;
    $('#modal').classList.toggle('wide', wide);
    $('#modal').scrollTop = 0;
    $('#modalBackdrop').hidden = false;
    document.body.classList.add('no-scroll');
    modalOnClose = onClose;
    setTimeout(() => $('#modalClose').focus(), 30);
  }
  function closeModal() {
    if ($('#modalBackdrop').hidden) return;
    $('#modalBackdrop').hidden = true;
    $('#modalContent').innerHTML = '';
    if (!$('#cartDrawer').classList.contains('open')) document.body.classList.remove('no-scroll');
    const cb = modalOnClose; modalOnClose = null;
    if (cb) cb();
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }
  const modalOpen = () => !$('#modalBackdrop').hidden;

  /* =========================================================
     商品詳情與客製化
     ========================================================= */
  function openProduct(pid, editKey = null) {
    const p = productById[pid];
    if (!p) return;
    const cat = catById[p.cat];
    const editing = editKey ? state.cart.find(i => i.key === editKey) : null;
    const groups = OPTION_SETS[p.opt];

    const groupsHTML = groups.map(gk => {
      const g = OPTION_GROUPS[gk];
      const sel = editing ? editing.sel[gk] : null;
      return `
        <div class="opt-group">
          <div class="opt-title"><h3>${g.title}</h3>${g.type === 'radio' ? '<span class="req">必選</span>' : '<span>可複選</span>'}</div>
          <div class="opt-list">
            ${g.choices.map((c, i) => {
              const checked = g.type === 'radio'
                ? (sel != null ? sel === i : i === 0)
                : (Array.isArray(sel) && sel.includes(i));
              return `<label class="opt">
                  <input type="${g.type === 'radio' ? 'radio' : 'checkbox'}" name="${gk}" value="${i}" ${checked ? 'checked' : ''} />
                  <span class="opt-name">${c.n}</span>
                  <span class="opt-price">${c.p ? (c.p > 0 ? '+' : '−') + '$' + Math.abs(c.p) : ''}</span>
                </label>`;
            }).join('')}
          </div>
        </div>`;
    }).join('');

    openModal(`
      <div class="pd-hero" style="background:${cat.bg}">
        <span class="emoji" aria-hidden="true">${p.emoji}</span>
        ${p.set ? '<span class="tag-set">可用 $49 體驗券</span>' : ''}
      </div>
      <form class="modal-pad" id="pdForm">
        <div class="pd-head">
          <h2>${esc(p.name)}</h2>
          <span class="pd-price">${money(p.price)}</span>
        </div>
        <p class="pd-desc">${esc(p.desc)}</p>
        <div class="nutri-table">
          <div><b>${p.kcal}</b><small>熱量 kcal</small></div>
          <div><b>${p.protein}g</b><small>蛋白質</small></div>
          <div><b>${p.carb}g</b><small>碳水化合物</small></div>
          <div><b>${p.fat}g</b><small>脂肪</small></div>
        </div>
        <p class="ingredients"><b>成分：</b>${esc(p.ing)}</p>
        ${groupsHTML}
        <div class="opt-group">
          <div class="opt-title"><h3>客製化備註</h3><span>選填</span></div>
          <textarea class="note" name="note" maxlength="80" placeholder="例如：不要香菜、醬料分開放">${esc(editing ? editing.note : '')}</textarea>
        </div>
        <div class="pd-foot">
          <div class="stepper lg">
            <button type="button" data-step="-1" aria-label="減少數量">−</button>
            <span id="pdQty">${editing ? editing.qty : 1}</span>
            <button type="button" data-step="1" aria-label="增加數量">+</button>
          </div>
          <button type="submit" class="btn btn-primary" id="pdSubmit"></button>
        </div>
      </form>`);

    const form = $('#pdForm');
    let qty = editing ? editing.qty : 1;
    const readSel = () => {
      const sel = {};
      groups.forEach(gk => {
        const g = OPTION_GROUPS[gk];
        if (g.type === 'radio') sel[gk] = +(form.querySelector(`input[name="${gk}"]:checked`)?.value ?? 0);
        else sel[gk] = $$(`input[name="${gk}"]:checked`, form).map(i => +i.value);
      });
      return sel;
    };
    const refresh = () => {
      $('#pdQty').textContent = qty;
      const unit = unitPrice(p, readSel());
      $('#pdSubmit').textContent = `${editing ? '更新' : '加入購物車'}・${money(unit * qty)}`;
    };
    form.addEventListener('change', refresh);
    form.addEventListener('click', e => {
      const b = e.target.closest('[data-step]');
      if (!b) return;
      qty = Math.max(1, Math.min(20, qty + +b.dataset.step));
      refresh();
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const sel = readSel();
      const note = form.note.value.trim();
      if (editing) removeFromCart(editing.key, true);
      addToCart(p.id, sel, qty, note);
      closeModal();
      toast(editing ? '已更新品項' : `已加入「${p.name}」× ${qty}`);
    });
    refresh();
  }

  function defaultSel(p) {
    const sel = {};
    OPTION_SETS[p.opt].forEach(gk => { sel[gk] = OPTION_GROUPS[gk].type === 'radio' ? 0 : []; });
    return sel;
  }
  function unitPrice(p, sel) {
    let price = p.price;
    OPTION_SETS[p.opt].forEach(gk => {
      const g = OPTION_GROUPS[gk];
      const v = sel[gk];
      if (g.type === 'radio') price += g.choices[v]?.p || 0;
      else (v || []).forEach(i => { price += g.choices[i]?.p || 0; });
    });
    return price;
  }
  function optText(p, sel) {
    const parts = [];
    OPTION_SETS[p.opt].forEach(gk => {
      const g = OPTION_GROUPS[gk];
      const v = sel[gk];
      if (g.type === 'radio') parts.push(g.choices[v]?.n);
      else (v || []).forEach(i => parts.push('+' + g.choices[i]?.n));
    });
    return parts.filter(Boolean).join('、');
  }

  /* =========================================================
     購物車
     ========================================================= */
  function addToCart(pid, sel, qty = 1, note = '') {
    const p = productById[pid];
    const key = pid + '|' + JSON.stringify(sel) + '|' + note;
    const exist = state.cart.find(i => i.key === key);
    if (exist) exist.qty = Math.min(99, exist.qty + qty);
    else state.cart.push({ key, pid, sel, qty, note });
    save();
    renderCart();
    const badge = $('#cartBadge');
    badge.classList.remove('bump'); void badge.offsetWidth; badge.classList.add('bump');
  }
  function removeFromCart(key, silent = false) {
    state.cart = state.cart.filter(i => i.key !== key);
    save();
    if (!silent) renderCart();
  }
  function changeQty(key, d) {
    const item = state.cart.find(i => i.key === key);
    if (!item) return;
    item.qty += d;
    if (item.qty <= 0) removeFromCart(key);
    else { save(); renderCart(); }
  }
  const cartCount = () => state.cart.reduce((s, i) => s + i.qty, 0);

  /* 金額計算（含優惠券檢查） */
  function calc(items, mode, code) {
    const lines = items.map(i => {
      const p = productById[i.pid];
      return { ...i, p, unit: unitPrice(p, i.sel) };
    }).filter(l => l.p);
    const subtotal = lines.reduce((s, l) => s + l.unit * l.qty, 0);
    const qty = lines.reduce((s, l) => s + l.qty, 0);
    const packaging = qty * PACKAGING_FEE;
    const delivery = mode === 'delivery' && subtotal > 0 && subtotal < FREE_DELIVERY ? DELIVERY_FEE : 0;
    let discount = 0, couponMsg = '', couponOk = false;
    if (code) {
      const c = COUPONS[code];
      if (!c) couponMsg = '查無此優惠碼';
      else if (c.type === 'try49') {
        if (state.wallet.TRY49?.used) couponMsg = '此體驗券每人限用乙次，您已使用過囉';
        else {
          const sets = lines.filter(l => l.p.set);
          if (!sets.length) couponMsg = '購物車中沒有「體驗價 $49」套餐';
          else {
            const best = Math.max(...sets.map(l => l.p.price));
            discount = best - 49; couponOk = true;
            couponMsg = `已套用：一份套餐體驗價 $49（折 ${money(discount)}）`;
          }
        }
      } else if (c.type === 'amount') {
        if (subtotal < c.min) couponMsg = `還差 ${money(c.min - subtotal)} 才能使用此券`;
        else { discount = c.value; couponOk = true; couponMsg = `已套用：${c.title}`; }
      } else if (c.type === 'percent') {
        discount = Math.min(Math.round(subtotal * c.rate), c.max); couponOk = true;
        couponMsg = `已套用：${c.title}（折 ${money(discount)}）`;
      }
    }
    const total = Math.max(0, subtotal + packaging + delivery - discount);
    return { lines, subtotal, qty, packaging, delivery, discount, total, couponMsg, couponOk };
  }

  function renderCart() {
    const count = cartCount();
    const badge = $('#cartBadge');
    badge.hidden = count === 0;
    badge.textContent = count;
    const c = calc(state.cart, state.mode, null);
    $('#fabCart').hidden = count === 0 || $('#cartDrawer').classList.contains('open');
    $('#fabCount').textContent = count;
    $('#fabTotal').textContent = money(c.subtotal);

    const body = $('#cartBody');
    if (!count) {
      body.innerHTML = `<div class="cart-empty"><p class="empty-emoji">🧺</p><p>購物車還是空的</p><p>挑幾道健康美味的餐點吧！</p></div>`;
      $('#cartFoot').innerHTML = `<button type="button" class="btn btn-outline btn-block" data-close-drawer>去逛逛菜單</button>`;
      return;
    }
    body.innerHTML = c.lines.map(l => `
      <div class="cart-item">
        <div class="cart-thumb" style="background:${catById[l.p.cat].bg}">${l.p.emoji}</div>
        <div class="cart-info">
          <h4>${esc(l.p.name)}</h4>
          <p class="cart-opts">${esc(optText(l.p, l.sel)) || '—'}</p>
          ${l.note ? `<p class="cart-note">備註：${esc(l.note)}</p>` : ''}
          <button type="button" class="btn-link" data-edit="${esc(l.key)}" style="border:none;background:none;padding:0;color:var(--blue);font-size:12px;font-weight:700">編輯</button>
        </div>
        <div class="cart-right">
          <span class="line-total">${money(l.unit * l.qty)}</span>
          <div class="stepper">
            <button type="button" data-dec="${esc(l.key)}" aria-label="減少">${l.qty === 1 ? '🗑' : '−'}</button>
            <span>${l.qty}</span>
            <button type="button" data-inc="${esc(l.key)}" aria-label="增加">+</button>
          </div>
        </div>
      </div>`).join('');

    const remain = FREE_DELIVERY - c.subtotal;
    $('#cartFoot').innerHTML = `
      <div class="mode-cards" style="margin-bottom:12px">
        <button type="button" class="mode-card ${state.mode === 'delivery' ? 'active' : ''}" data-set-mode="delivery"><b>🛵 外送到府</b><small>滿 $${FREE_DELIVERY} 免運</small></button>
        <button type="button" class="mode-card ${state.mode === 'pickup' ? 'active' : ''}" data-set-mode="pickup"><b>🏠 店面自取</b><small>可憑券現場兌換</small></button>
      </div>
      <div class="sum-row"><span>小計</span><span>${money(c.subtotal)}</span></div>
      <div class="sum-row"><span>包材費（$${PACKAGING_FEE} / 份）</span><span>${money(c.packaging)}</span></div>
      ${state.mode === 'delivery' ? `<div class="sum-row"><span>外送費</span><span>${c.delivery ? money(c.delivery) : '免運'}</span></div>` : ''}
      ${state.mode === 'delivery' && remain > 0 ? `<p class="mini-hint">再買 ${money(remain)} 即可免運費 🎉</p>` : ''}
      <div class="sum-row total"><span>總計</span><span>${money(c.total)}</span></div>
      <p class="mini-hint" style="color:var(--muted)">優惠碼可於結帳時輸入</p>
      <button type="button" class="btn btn-primary btn-block" id="goCheckout">前往結帳</button>`;
  }

  function openDrawer() {
    $('#cartDrawer').classList.add('open');
    $('#cartDrawer').setAttribute('aria-hidden', 'false');
    $('#drawerOverlay').hidden = false;
    $('#fabCart').hidden = true;
    document.body.classList.add('no-scroll');
    setTimeout(() => $('#closeDrawer').focus(), 50);
  }
  function closeDrawer() {
    $('#cartDrawer').classList.remove('open');
    $('#cartDrawer').setAttribute('aria-hidden', 'true');
    $('#drawerOverlay').hidden = true;
    if (!modalOpen()) document.body.classList.remove('no-scroll');
    renderCart();
  }

  /* =========================================================
     取餐方式 / 地址
     ========================================================= */
  function setMode(mode) {
    state.mode = mode;
    save();
    $$('.mode-switch button').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
    renderAddress();
    renderCart();
  }
  function renderAddress() {
    $('#addressText').textContent = state.mode === 'delivery'
      ? (state.address ? '送至：' + state.address : '設定外送地址')
      : '自取：' + state.store.replace('阿爸的家園 ', '');
  }
  function openAddress() {
    const isDel = state.mode === 'delivery';
    openModal(`
      <form class="modal-pad" id="addrForm">
        <h2>${isDel ? '🛵 外送地址' : '🏠 選擇自取門市'}</h2>
        <p class="modal-sub">${isDel ? '請輸入完整地址，方便外送夥伴準時送達' : '可於門市出示優惠券現場兌換'}</p>
        ${isDel
          ? `<div class="field"><label for="addrInput">地址</label><input id="addrInput" name="addr" value="${esc(state.address)}" placeholder="例如：台北市信義區松仁路 100 號 5 樓" required /></div>`
          : `<div class="field"><label for="storeSel">門市</label><select id="storeSel" name="store">${STORES.map(s => `<option ${s === state.store ? 'selected' : ''}>${s}</option>`).join('')}</select></div>`}
        <button class="btn btn-primary btn-block" type="submit">儲存</button>
      </form>`);
    $('#addrForm').addEventListener('submit', e => {
      e.preventDefault();
      if (isDel) state.address = e.target.addr.value.trim();
      else state.store = e.target.store.value;
      save(); renderAddress(); closeModal(); toast('已更新');
    });
  }

  /* =========================================================
     結帳
     ========================================================= */
  function openCheckout() {
    if (!state.cart.length) return;
    closeDrawer();
    const ck = { mode: state.mode, pay: 'cash', code: '', time: 'asap' };

    const usableCoupons = () => Object.keys(state.wallet).filter(k => COUPONS[k] && !state.wallet[k].used);

    const render = () => {
      const c = calc(state.cart, ck.mode, ck.code);
      const isDel = ck.mode === 'delivery';
      const prev = $('#ckForm') ? Object.fromEntries(new FormData($('#ckForm'))) : null;
      const val = (k, d) => esc(prev?.[k] ?? d);
      const html = `
        <form class="modal-pad" id="ckForm" novalidate>
          <h2>確認訂單</h2>
          <p class="modal-sub">共 ${c.qty} 份餐點</p>

          <p class="section-label">取餐方式</p>
          <div class="mode-cards">
            <button type="button" class="mode-card ${isDel ? 'active' : ''}" data-ck-mode="delivery"><b>🛵 外送到府</b><small>約 30–45 分鐘送達</small></button>
            <button type="button" class="mode-card ${!isDel ? 'active' : ''}" data-ck-mode="pickup"><b>🏠 店面自取</b><small>憑券現場兌換</small></button>
          </div>

          <p class="section-label">聯絡資訊</p>
          <div class="row2">
            <div class="field"><label for="ckName">姓名</label><input id="ckName" name="name" value="${val('name', state.profile.name)}" placeholder="王小明" autocomplete="name" /></div>
            <div class="field"><label for="ckPhone">手機</label><input id="ckPhone" name="phone" value="${val('phone', state.profile.phone)}" placeholder="0912345678" inputmode="tel" autocomplete="tel" /></div>
          </div>
          ${isDel
            ? `<div class="field"><label for="ckAddr">外送地址</label><input id="ckAddr" name="addr" value="${val('addr', state.address)}" placeholder="例如：台北市信義區松仁路 100 號 5 樓" autocomplete="street-address" /></div>`
            : `<div class="row2">
                <div class="field"><label for="ckStore">自取門市</label><select id="ckStore" name="store">${STORES.map(s => `<option ${s === (prev?.store ?? state.store) ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
                <div class="field"><label for="ckTime">取餐時間</label><select id="ckTime" name="time">
                  ${['盡快（約 15 分鐘）', '30 分鐘後', '1 小時後', '2 小時後'].map(t => `<option ${t === prev?.time ? 'selected' : ''}>${t}</option>`).join('')}
                </select></div>
              </div>`}

          <p class="section-label">付款方式（模擬）</p>
          <div class="pay-list">
            ${[['cash', isDel ? '💵 貨到付款' : '💵 現場付款'], ['linepay', '🟢 LINE Pay'], ['jko', '🔴 街口支付']].map(([k, n]) =>
              `<button type="button" class="chip ${ck.pay === k ? 'active' : ''}" data-pay="${k}">${n}</button>`).join('')}
          </div>

          <p class="section-label">優惠碼</p>
          <div class="coupon-row">
            <input name="code" id="ckCode" value="${esc(ck.code)}" placeholder="輸入優惠碼，例如 TRY49" autocomplete="off" />
            <button type="button" class="btn btn-blue btn-sm" id="applyCode">套用</button>
          </div>
          ${usableCoupons().length ? `<div class="coupon-chips">${usableCoupons().map(k => `<button type="button" class="chip" data-use-code="${k}">🎟 ${k}・${COUPONS[k].title}</button>`).join('')}</div>` : ''}
          ${ck.code ? `<p class="coupon-msg ${c.couponOk ? 'ok' : 'bad'}">${esc(c.couponMsg)} ${c.couponOk ? '' : ''}</p>` : ''}

          <div class="summary-box">
            <p class="summary-items">${c.lines.map(l => `${esc(l.p.name)} × ${l.qty}`).join('、')}</p>
            <div class="sum-row"><span>小計</span><span>${money(c.subtotal)}</span></div>
            <div class="sum-row"><span>包材費</span><span>${money(c.packaging)}</span></div>
            ${isDel ? `<div class="sum-row"><span>外送費</span><span>${c.delivery ? money(c.delivery) : '免運'}</span></div>` : ''}
            ${c.discount ? `<div class="sum-row discount"><span>優惠折抵（${ck.code}）</span><span>−${money(c.discount)}</span></div>` : ''}
            <div class="sum-row total"><span>應付金額</span><span>${money(c.total)}</span></div>
          </div>
          <button type="submit" class="btn btn-primary btn-block" style="margin-top:16px">確認下單・${money(c.total)}</button>
        </form>`;
      if ($('#ckForm')) {
        const scroll = $('#modal').scrollTop;
        $('#modalContent').innerHTML = html;
        $('#modal').scrollTop = scroll;
      } else openModal(html);
      bind();
    };

    const bind = () => {
      const form = $('#ckForm');
      form.addEventListener('click', e => {
        const t = e.target.closest('button');
        if (!t) return;
        if (t.dataset.ckMode) { ck.mode = t.dataset.ckMode; render(); }
        else if (t.dataset.pay) { ck.pay = t.dataset.pay; render(); }
        else if (t.dataset.useCode) { ck.code = t.dataset.useCode; render(); }
        else if (t.id === 'applyCode') { ck.code = $('#ckCode').value.trim().toUpperCase(); render(); }
      });
      $('#ckCode').addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); $('#applyCode').click(); }
      });
      form.addEventListener('submit', e => { e.preventDefault(); placeOrder(ck); });
    };
    render();
  }

  function setFieldError(input, msg) {
    const field = input.closest('.field');
    field.classList.add('invalid');
    let err = field.querySelector('.err');
    if (!err) { err = document.createElement('span'); err.className = 'err'; field.appendChild(err); }
    err.textContent = msg;
  }

  function placeOrder(ck) {
    const form = $('#ckForm');
    $$('.field', form).forEach(f => { f.classList.remove('invalid'); f.querySelector('.err')?.remove(); });
    const name = form.elements.name.value.trim();
    const phone = form.phone.value.trim();
    let ok = true, firstBad = null;
    const fail = (input, msg) => { setFieldError(input, msg); ok = false; firstBad = firstBad || input; };
    if (!name) fail(form.elements.name, '請輸入姓名');
    if (!/^09\d{8}$/.test(phone.replace(/[-\s]/g, ''))) fail(form.phone, '請輸入正確的手機號碼（09 開頭共 10 碼）');
    if (ck.mode === 'delivery' && !form.addr.value.trim()) fail(form.addr, '請輸入外送地址');
    if (!ok) { firstBad.focus(); return; }

    const c = calc(state.cart, ck.mode, ck.code);
    if (ck.code && !c.couponOk) {
      toast('優惠碼無法使用，請移除或更換');
      $('#ckCode').focus();
      return;
    }

    state.profile = { name, phone };
    if (ck.mode === 'delivery') state.address = form.addr.value.trim();
    else state.store = form.store.value;

    const order = {
      id: 'AB' + Date.now().toString().slice(-8),
      createdAt: Date.now(),
      mode: ck.mode,
      name, phone,
      addr: ck.mode === 'delivery' ? state.address : '',
      store: ck.mode === 'pickup' ? state.store : '',
      time: ck.mode === 'pickup' ? form.time.value : '',
      pay: ck.pay,
      code: c.couponOk ? ck.code : '',
      items: c.lines.map(l => ({ pid: l.pid, sel: l.sel, qty: l.qty, note: l.note, unit: l.unit, name: l.p.name, opts: optText(l.p, l.sel) })),
      subtotal: c.subtotal, packaging: c.packaging, delivery: c.delivery, discount: c.discount, total: c.total,
      kcal: c.lines.reduce((s, l) => s + l.p.kcal * l.qty, 0),
      protein: c.lines.reduce((s, l) => s + l.p.protein * l.qty, 0),
    };
    if (order.code) {
      state.wallet[order.code] = state.wallet[order.code] || { claimedAt: Date.now() };
      if (order.code === 'TRY49') state.wallet.TRY49.used = true;
    }
    state.orders.unshift(order);
    state.cart = [];
    save();
    renderCart();
    renderAddress();
    syncHeroCoupon();
    $$('.mode-switch button').forEach(b => b.classList.toggle('active', b.dataset.mode === state.mode));
    openTracking(order.id);
    toast('🎉 訂單已送出！');
  }

  /* =========================================================
     訂單追蹤（模擬進度：依下單後經過時間計算）
     ========================================================= */
  const STAGES = {
    delivery: [
      { n: '已接單', icon: '📝', at: 0,  emoji: '📝', msg: '店家已收到你的訂單' },
      { n: '備餐中', icon: '👨‍🍳', at: 5,  emoji: '👨‍🍳', msg: '阿爸正在用心準備你的餐點' },
      { n: '配送中', icon: '🛵', at: 15, emoji: '🛵', msg: '外送夥伴正在路上' },
      { n: '已完成', icon: '✅', at: 30, emoji: '🎉', msg: '餐點已送達，祝你用餐愉快！' },
    ],
    pickup: [
      { n: '已接單', icon: '📝', at: 0,  emoji: '📝', msg: '店家已收到你的訂單' },
      { n: '備餐中', icon: '👨‍🍳', at: 5,  emoji: '👨‍🍳', msg: '阿爸正在用心準備你的餐點' },
      { n: '可取餐', icon: '🛍', at: 15, emoji: '🛍', msg: '餐點已備妥，請至門市取餐' },
      { n: '已完成', icon: '✅', at: 30, emoji: '🎉', msg: '已完成取餐，謝謝光臨！' },
    ],
  };
  function stageIndex(order) {
    const sec = (Date.now() - order.createdAt) / 1000;
    const stages = STAGES[order.mode];
    let idx = 0;
    stages.forEach((s, i) => { if (sec >= s.at) idx = i; });
    return idx;
  }

  let trackTimer = null;
  function openTracking(orderId) {
    const order = state.orders.find(o => o.id === orderId);
    if (!order) return;
    const html = () => {
      const stages = STAGES[order.mode];
      const idx = stageIndex(order);
      const st = stages[idx];
      const remain = Math.max(0, stages[stages.length - 1].at - (Date.now() - order.createdAt) / 1000);
      return `
        <div class="track-head">
          <span class="track-emoji" aria-hidden="true">${st.emoji}</span>
          <p class="track-status">${st.n}</p>
          <p class="track-eta">${st.msg}${idx < stages.length - 1 ? `・預計 ${Math.ceil(remain)} 秒後完成（示範加速）` : ''}</p>
        </div>
        <div class="modal-pad" style="padding-top:0">
          <div class="steps">
            <div class="bar" style="width:${(idx / (stages.length - 1)) * 76}%"></div>
            ${stages.map((s, i) => `<div class="step ${i <= idx ? 'done' : ''} ${i === idx ? 'current' : ''}"><i>${i < idx ? '✓' : s.icon}</i>${s.n}</div>`).join('')}
          </div>
          <div class="order-meta">
            <p><span>訂單編號</span><span>${order.id}</span></p>
            <p><span>下單時間</span><span>${fmtTime(order.createdAt)}</span></p>
            <p><span>${order.mode === 'delivery' ? '外送地址' : '自取門市'}</span><span>${esc(order.mode === 'delivery' ? order.addr : order.store + '（' + order.time + '）')}</span></p>
            <p><span>餐點</span><span style="text-align:right">${order.items.map(i => `${esc(i.name)} × ${i.qty}`).join('<br>')}</span></p>
            ${order.discount ? `<p><span>優惠折抵</span><span style="color:var(--red)">−${money(order.discount)}（${order.code}）</span></p>` : ''}
            <p><span>應付金額</span><b>${money(order.total)}</b></p>
          </div>
          ${order.mode === 'pickup' && order.code === 'TRY49' ? '<p class="tip-box">🎟 取餐時請出示此畫面，即可於門市完成 $49 體驗券兌換。</p>' : ''}
          <button type="button" class="btn btn-outline btn-block" style="margin-top:16px" id="trackToMember">查看所有訂單</button>
        </div>`;
    };
    openModal(html(), { onClose: () => { clearInterval(trackTimer); trackTimer = null; } });
    const bindBtn = () => { const b = $('#trackToMember'); if (b) b.onclick = () => { closeModal(); openMember('orders'); }; };
    bindBtn();
    clearInterval(trackTimer);
    trackTimer = setInterval(() => {
      if (!modalOpen()) return clearInterval(trackTimer);
      $('#modalContent').innerHTML = html();
      bindBtn();
      if (stageIndex(order) === STAGES[order.mode].length - 1) clearInterval(trackTimer);
    }, 1000);
  }

  /* =========================================================
     優惠券
     ========================================================= */
  function claimCoupon(code, silent = false) {
    if (state.wallet[code]) { if (!silent) toast(state.wallet[code].used ? '此券已使用過囉' : '此券已在你的錢包中'); return false; }
    state.wallet[code] = { claimedAt: Date.now(), used: false };
    save();
    syncHeroCoupon();
    if (!silent) toast(`🎟 已領取「${COUPONS[code].title}」，結帳時輸入 ${code}`);
    return true;
  }
  function syncHeroCoupon() {
    const w = state.wallet.TRY49;
    const btn = $('#heroCoupon');
    btn.classList.toggle('claimed', !!w);
    btn.querySelector('.ticket-text small').textContent =
      !w ? '每人限體驗乙次・點我領取' : w.used ? '已使用・感謝體驗' : '已領取・結帳輸入 TRY49';
  }

  /* =========================================================
     會員中心
     ========================================================= */
  let memberTab = 'orders';
  function openMember(tab = memberTab) {
    memberTab = tab;
    openModal(`<div class="modal-pad" id="memberPane"></div>`, { wide: true, onClose: () => clearInterval(memberTimer) });
    renderMember();
    clearInterval(memberTimer);
    memberTimer = setInterval(() => {
      if (!modalOpen() || !$('#memberPane')) return clearInterval(memberTimer);
      if (memberTab === 'orders' && state.orders.some(o => stageIndex(o) < STAGES[o.mode].length - 1)) renderMember();
    }, 2000);
  }
  let memberTimer = null;

  function renderMember() {
    const pane = $('#memberPane');
    if (!pane) return;
    const name = state.profile.name || '健康夥伴';
    pane.innerHTML = `
      <div class="member-hello">
        <div class="avatar" aria-hidden="true">🧑</div>
        <div><h2>嗨，${esc(name)}！</h2><p class="modal-sub" style="margin:0">今天也一起讓身體成為想要的樣子 ☀️</p></div>
      </div>
      <div class="tabs" role="tablist">
        ${[['orders', '📦 訂單紀錄'], ['wallet', '🎟 優惠券錢包'], ['health', '🎯 健康目標']].map(([k, n]) =>
          `<button type="button" role="tab" class="tab ${memberTab === k ? 'active' : ''}" data-tab="${k}" aria-selected="${memberTab === k}">${n}</button>`).join('')}
      </div>
      <div id="memberBody">${memberTab === 'orders' ? ordersHTML() : memberTab === 'wallet' ? walletHTML() : healthHTML()}</div>`;
    if (memberTab === 'health') drawWeightChart();
  }

  function ordersHTML() {
    if (!state.orders.length) return `<p class="empty-note">還沒有訂單紀錄，快去點一份健康餐吧！</p>`;
    return state.orders.map(o => {
      const stages = STAGES[o.mode];
      const idx = stageIndex(o);
      const done = idx === stages.length - 1;
      return `
        <div class="order-card">
          <div class="order-card-head">
            <b>${o.mode === 'delivery' ? '🛵 外送' : '🏠 自取'}・${o.id}</b>
            <span class="status-pill ${done ? 'done' : ''}">${stages[idx].n}</span>
          </div>
          <p class="order-card-items">${fmtTime(o.createdAt)}｜${o.items.map(i => `${esc(i.name)} × ${i.qty}`).join('、')}</p>
          <div class="order-card-foot">
            <b>${money(o.total)}</b>
            <div class="btns">
              <button type="button" class="btn btn-outline btn-sm" data-track="${o.id}">${done ? '訂單明細' : '追蹤進度'}</button>
              <button type="button" class="btn btn-primary btn-sm" data-reorder="${o.id}">再點一次</button>
            </div>
          </div>
        </div>`;
    }).join('');
  }

  function walletHTML() {
    return `
      <p class="modal-sub">領取後於結帳頁輸入優惠碼或直接點選即可使用。</p>
      ${Object.entries(COUPONS).map(([code, c]) => {
        const w = state.wallet[code];
        const status = !w ? 'claim' : w.used ? 'used' : 'ready';
        return `
          <div class="wallet-card ${status === 'used' ? 'used' : ''}">
            <div class="wallet-left">${c.label}</div>
            <div class="wallet-right">
              <b>${c.title}</b>
              <small>${c.desc}</small>
              <span class="code">${code}</span>
            </div>
            <div class="wallet-actions">
              ${status === 'claim' ? `<button type="button" class="btn btn-primary btn-sm" data-claim="${code}">領取</button>`
                : status === 'used' ? '<small style="color:var(--muted)">已使用</small>'
                : '<small style="color:var(--green);font-weight:700">可使用</small>'}
            </div>
          </div>`;
      }).join('')}`;
  }

  function healthHTML() {
    const h = state.health;
    const g = GOALS[h.goal];
    const today = state.orders.filter(o => isToday(o.createdAt));
    const kcal = today.reduce((s, o) => s + (o.kcal || 0), 0);
    const protein = today.reduce((s, o) => s + (o.protein || 0), 0);
    const pct = (v, t) => Math.min(100, t ? (v / t) * 100 : 0);
    const recs = PRODUCTS.filter(p => g.cats.includes(p.cat)).slice(0, 6);
    return `
      <p class="section-label" style="margin-top:0">我的健康目標</p>
      <div class="goal-chips">
        ${Object.entries(GOALS).map(([k, v]) => `<button type="button" class="chip ${h.goal === k ? 'active' : ''}" data-goal="${k}">${v.name}</button>`).join('')}
      </div>
      <p class="tip-box">💡 ${g.tip}</p>
      <form id="targetForm" class="row2">
        <div class="field"><label for="tKcal">每日熱量目標（kcal）</label><input id="tKcal" name="kcal" type="number" min="800" max="5000" step="50" value="${h.kcal}" /></div>
        <div class="field"><label for="tPro">每日蛋白質目標（g）</label><input id="tPro" name="protein" type="number" min="20" max="300" step="5" value="${h.protein}" /></div>
      </form>

      <p class="section-label">今日由本店攝取</p>
      <div class="progress">
        <div class="progress-top"><span>🔥 熱量</span><span>${kcal} / ${h.kcal} kcal</span></div>
        <div class="progress-track"><div class="progress-fill" style="width:${pct(kcal, h.kcal)}%"></div></div>
      </div>
      <div class="progress">
        <div class="progress-top"><span>💪 蛋白質</span><span>${protein} / ${h.protein} g</span></div>
        <div class="progress-track"><div class="progress-fill blue" style="width:${pct(protein, h.protein)}%"></div></div>
      </div>

      <p class="section-label">體重紀錄</p>
      <form class="coupon-row" id="weightForm">
        <input name="w" type="number" step="0.1" min="10" max="300" placeholder="輸入今天的體重（kg）" style="text-transform:none" required />
        <button type="submit" class="btn btn-blue btn-sm">記錄</button>
      </form>
      <svg class="weight-chart" id="weightChart" viewBox="0 0 600 120" preserveAspectRatio="none" role="img" aria-label="體重趨勢圖" style="margin-top:10px"></svg>
      <div class="weight-list">${h.weights.slice(-8).reverse().map(w => `<span>${new Date(w.t).toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' })}：${w.v} kg</span>`).join('') || '尚無紀錄'}</div>

      <p class="section-label">為「${g.name}」推薦</p>
      <div class="rec-list">
        ${recs.map(p => `<button type="button" class="rec-item" data-open="${p.id}">
          <span class="cart-thumb" style="background:${catById[p.cat].bg}">${p.emoji}</span>
          <span><b>${esc(p.name)}</b><small>${money(p.price)}・${p.kcal} kcal</small></span>
        </button>`).join('')}
      </div>`;
  }

  function drawWeightChart() {
    const svg = $('#weightChart');
    if (!svg) return;
    const data = state.health.weights.slice(-14);
    if (data.length < 2) {
      svg.innerHTML = `<text x="300" y="66" text-anchor="middle" fill="#95A5A6" font-size="14">記錄兩筆以上即可看到趨勢</text>`;
      return;
    }
    const vals = data.map(d => d.v);
    const min = Math.min(...vals) - 1, max = Math.max(...vals) + 1;
    const x = i => 30 + (i / (data.length - 1)) * 540;
    const y = v => 100 - ((v - min) / (max - min)) * 80;
    const pts = data.map((d, i) => `${x(i)},${y(d.v)}`).join(' ');
    svg.innerHTML = `
      <polyline points="${x(0)},110 ${pts} ${x(data.length - 1)},110" fill="rgba(243,156,18,.15)" stroke="none"/>
      <polyline points="${pts}" fill="none" stroke="#F39C12" stroke-width="3" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
      ${data.map((d, i) => `<circle cx="${x(i)}" cy="${y(d.v)}" r="4" fill="#fff" stroke="#E67E22" stroke-width="2" vector-effect="non-scaling-stroke"/>`).join('')}`;
  }

  function reorder(orderId) {
    const o = state.orders.find(x => x.id === orderId);
    if (!o) return;
    o.items.forEach(i => { if (productById[i.pid]) addToCart(i.pid, i.sel, i.qty, i.note); });
    closeModal();
    openDrawer();
    toast('已將品項加入購物車');
  }

  /* =========================================================
     營養諮詢預約
     ========================================================= */
  function openConsult() {
    const minDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    openModal(`
      <form class="modal-pad" id="consultForm" novalidate>
        <h2>👨‍⚕️ 預約營養師諮詢</h2>
        <p class="modal-sub">填寫資料後，營養師將於 1 個工作天內與你聯繫（示範功能，不會實際送出）。</p>
        <div class="row2">
          <div class="field"><label for="cName">姓名</label><input id="cName" name="name" value="${esc(state.profile.name)}" /></div>
          <div class="field"><label for="cPhone">手機</label><input id="cPhone" name="phone" value="${esc(state.profile.phone)}" inputmode="tel" /></div>
        </div>
        <div class="row2">
          <div class="field"><label for="cGoal">諮詢主題</label><select id="cGoal" name="goal">${Object.values(GOALS).map(g => `<option>${g.name}</option>`).join('')}</select></div>
          <div class="field"><label for="cDate">希望日期</label><input id="cDate" name="date" type="date" min="${minDate}" value="${minDate}" /></div>
        </div>
        <div class="field"><label for="cMsg">想詢問的問題（選填）</label><textarea id="cMsg" name="msg" rows="3" maxlength="200" placeholder="例如：最近想減脂但常常覺得餓…"></textarea></div>
        <button type="submit" class="btn btn-primary btn-block">送出預約</button>
      </form>`);
    $('#consultForm').addEventListener('submit', e => {
      e.preventDefault();
      const f = e.target;
      $$('.field', f).forEach(x => { x.classList.remove('invalid'); x.querySelector('.err')?.remove(); });
      let ok = true;
      if (!f.elements.name.value.trim()) { setFieldError(f.elements.name, '請輸入姓名'); ok = false; }
      if (!/^09\d{8}$/.test(f.phone.value.replace(/[-\s]/g, ''))) { setFieldError(f.phone, '請輸入正確的手機號碼'); ok = false; }
      if (!ok) return;
      state.consults.push({ name: f.elements.name.value.trim(), phone: f.phone.value.trim(), goal: f.goal.value, date: f.date.value, msg: f.msg.value.trim(), t: Date.now() });
      save();
      closeModal();
      toast(`✅ 已預約 ${f.date.value} 的「${f.goal.value}」諮詢`);
    });
  }

  /* =========================================================
     事件綁定
     ========================================================= */
  function bindEvents() {
    // 菜單：點卡片看詳情，點 + 快速加入
    $('#menuSections').addEventListener('click', e => {
      const quick = e.target.closest('[data-quick]');
      if (quick) {
        e.stopPropagation();
        const p = productById[quick.dataset.quick];
        // 有必選以外的選項時仍可快速加入預設組合
        addToCart(p.id, defaultSel(p), 1, '');
        toast(`已加入「${p.name}」`);
        return;
      }
      const card = e.target.closest('.card');
      if (card) openProduct(card.dataset.pid);
    });
    $('#menuSections').addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('card')) {
        e.preventDefault();
        openProduct(e.target.dataset.pid);
      }
    });

    // 分類導覽
    $('#catScroll').addEventListener('click', e => {
      const b = e.target.closest('.cat-pill');
      if (!b) return;
      const sec = $('#cat-' + b.dataset.target);
      if (!sec) { $('#searchInput').value = ''; renderMenu(); }
      $('#cat-' + b.dataset.target)?.scrollIntoView({ behavior: 'smooth' });
      setActivePill(b.dataset.target);
    });

    // 搜尋
    let searchTimer;
    $('#searchInput').addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        renderMenu();
        if ($('#searchInput').value.trim()) $('#menu').scrollIntoView({ behavior: 'smooth' });
      }, 200);
    });

    // 外送/自取、地址
    $$('.mode-switch button').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
    $('#addressBtn').addEventListener('click', openAddress);

    // 購物車
    $('#cartBtn').addEventListener('click', openDrawer);
    $('#fabCart').addEventListener('click', openDrawer);
    $('#closeDrawer').addEventListener('click', closeDrawer);
    $('#drawerOverlay').addEventListener('click', closeDrawer);
    $('#cartDrawer').addEventListener('click', e => {
      const t = e.target.closest('button');
      if (!t) return;
      if (t.dataset.inc) changeQty(t.dataset.inc, 1);
      else if (t.dataset.dec) changeQty(t.dataset.dec, -1);
      else if (t.dataset.edit) {
        const item = state.cart.find(i => i.key === t.dataset.edit);
        if (item) openProduct(item.pid, item.key);
      }
      else if (t.dataset.setMode) setMode(t.dataset.setMode);
      else if (t.id === 'goCheckout') openCheckout();
      else if ('closeDrawer' in t.dataset) { closeDrawer(); $('#menu').scrollIntoView({ behavior: 'smooth' }); }
    });

    // 優惠券、會員、諮詢
    $('#heroCoupon').addEventListener('click', () => claimCoupon('TRY49'));
    $('#memberBtn').addEventListener('click', () => openMember());
    $('#consultBtn').addEventListener('click', openConsult);

    // 會員中心內的互動（委派）
    $('#modalContent').addEventListener('click', e => {
      const t = e.target.closest('button');
      if (!t || !$('#memberPane')) return;
      if (t.dataset.tab) { memberTab = t.dataset.tab; renderMember(); }
      else if (t.dataset.claim) { claimCoupon(t.dataset.claim); renderMember(); }
      else if (t.dataset.track) { const id = t.dataset.track; closeModal(); openTracking(id); }
      else if (t.dataset.reorder) reorder(t.dataset.reorder);
      else if (t.dataset.goal) {
        const g = GOALS[t.dataset.goal];
        state.health.goal = t.dataset.goal;
        state.health.kcal = g.kcal;
        state.health.protein = g.protein;
        save(); renderMember();
      }
      else if (t.dataset.open) { const id = t.dataset.open; closeModal(); openProduct(id); }
    });
    $('#modalContent').addEventListener('change', e => {
      if (e.target.closest('#targetForm')) {
        const f = $('#targetForm');
        state.health.kcal = Math.max(800, +f.kcal.value || 0);
        state.health.protein = Math.max(20, +f.protein.value || 0);
        save(); renderMember();
      }
    });
    $('#modalContent').addEventListener('submit', e => {
      if (e.target.id !== 'weightForm') return;
      e.preventDefault();
      const v = parseFloat(e.target.w.value);
      if (!(v > 10 && v < 300)) return;
      state.health.weights.push({ t: Date.now(), v: Math.round(v * 10) / 10 });
      save(); renderMember();
      toast('已記錄體重');
    });

    // 關閉視窗
    $('#modalClose').addEventListener('click', closeModal);
    $('#modalBackdrop').addEventListener('mousedown', e => { if (e.target.id === 'modalBackdrop') closeModal(); });
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      if (modalOpen()) closeModal();
      else if ($('#cartDrawer').classList.contains('open')) closeDrawer();
    });

    // Header 高度變動時更新 sticky 位置
    const syncHeader = () => document.documentElement.style.setProperty('--header-h', $('#topbar').offsetHeight + 'px');
    window.addEventListener('resize', syncHeader);
    syncHeader();
  }

  /* ---------------- 初始化 ---------------- */
  function init() {
    renderCatNav();
    renderMenu();
    renderCart();
    setMode(state.mode);
    syncHeroCoupon();
    bindEvents();
  }
  init();
})();
