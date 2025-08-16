import React, { useEffect, useRef } from 'react';

const PersianCalculator: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear container and add the HTML content
    containerRef.current.innerHTML = `
      <style>
        :root {
          --bg: #0f172a;
          --card: #111827;
          --muted: #9ca3af;
          --text: #e5e7eb;
          --accent: #10b981;
          --accent-2: #60a5fa;
          --danger: #f87171;
          --shadow: 0 10px 30px rgba(0,0,0,.35);
          --radius: 14px;
        }
        * { box-sizing: border-box }
        .calculator-container {
          background: radial-gradient(1000px 600px at 70% -100px, #1f2937 0%, #0b1020 40%, #070a13 100%), var(--bg);
          color: var(--text);
          font-family: Vazirmatn, IRANSans, "Segoe UI", Roboto, sans-serif;
          margin: 0; padding: 0;
          min-height: 100vh;
        }
        .container {
          max-width: 1100px; margin: 24px auto; padding: 16px;
        }
        header {
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
          margin-bottom: 16px;
        }
        .title {
          font-size: 1.35rem; font-weight: 800; letter-spacing: .2px;
          background: linear-gradient(90deg, #f0f9ff, #a7f3d0);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .cards {
          display: grid; gap: 16px;
          grid-template-columns: repeat(12, 1fr);
        }
        .card {
          grid-column: span 12;
          background: linear-gradient(180deg, rgba(255,255,255,.02), transparent 60%), #0b1222;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          padding: 16px;
        }
        @media (min-width: 880px) {
          .card--inputs { grid-column: span 7; }
          .card--results { grid-column: span 5; }
        }
        .section-title {
          font-size: 1.05rem; font-weight: 700; margin: 2px 0 12px;
          color: #e9f1ff;
        }
        .row { display: grid; gap: 12px; grid-template-columns: 1fr; margin-bottom: 12px; }
        @media (min-width: 680px) {
          .row--two { grid-template-columns: 1fr 1fr; }
        }
        .block {
          background: linear-gradient(180deg, rgba(255,255,255,.02), transparent 60%), #0a0f1d;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 12px; padding: 12px;
        }
        .block h4 {
          margin: 0 0 10px; font-size: .98rem; color: #d0e1ff; font-weight: 700;
        }
        .inline {
          display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 8px; align-items: end;
        }
        .inline label { font-size: .82rem; color: var(--muted); margin-bottom: 6px; display: block; }
        select, button {
          appearance: none; outline: none; border: none;
          border-radius: 10px; padding: 10px 12px; background: #121a2c; color: var(--text);
          border: 1px solid rgba(255,255,255,.08);
        }
        select { width: 100% }
        .calendar-toggle {
          display: inline-flex; background: #0c1222; border: 1px solid rgba(255,255,255,.08); border-radius: 10px; overflow: hidden;
        }
        .calendar-toggle button {
          padding: 8px 12px; background: transparent; border: none; color: var(--muted);
          cursor: pointer; transition: all .2s ease;
        }
        .calendar-toggle button.active { color: #071218; background: #a7f3d0; font-weight: 700; }
        .helper {
          font-size: .84rem; color: #cbd5e1; background: #0a1220; border: 1px dashed rgba(255,255,255,.1);
          padding: 10px; border-radius: 10px; margin-top: 8px;
        }
        .helper .weak { color: var(--muted); }
        .helper .equiv { margin-top: 4px; }
        .helper .error { color: var(--danger); font-weight: 700; }
        .actions {
          display: flex; flex-wrap: wrap; gap: 10px; margin-top: 6px;
        }
        .btn {
          cursor: pointer; font-weight: 700; letter-spacing: .2px;
          transition: transform .06s ease, box-shadow .2s ease, background .2s;
        }
        .btn:active { transform: translateY(1px) }
        .btn--primary { background: linear-gradient(90deg, #34d399, #10b981); color: #06121a; }
        .btn--ghost { background: transparent; color: #cffafe; border: 1px solid rgba(255,255,255,.18); }
        .btn--alt { background: linear-gradient(90deg, #93c5fd, #60a5fa); color: #06121a; }
        .btn--warn { background: linear-gradient(90deg, #fda4af, #fb7185); color: #2a0707; }
        .results .item {
          background: linear-gradient(180deg, rgba(255,255,255,.02), transparent 60%), #091126;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 12px; padding: 12px; margin-bottom: 10px;
        }
        .results .item h5 { margin: 0 0 8px; font-size: .98rem; color: #a7f3d0 }
        .results .date-line { font-weight: 700; color: #e2e8f0 }
        .results .equiv { font-size: .9rem; color: #cbd5e1 }
        .muted { color: var(--muted) }
        footer { margin-top: 10px; font-size: .82rem; color: var(--muted); text-align: center }
        .tiny { font-size: .78rem }
        .pill {
          display: inline-block; padding: 2px 8px; background: #0d162e; border: 1px solid rgba(255,255,255,.08); border-radius: 999px; color: #c7d2fe; font-size: .78rem;
        }
      </style>
      <div class="calculator-container">
        <div class="container">
          <header>
            <div class="title">محاسبه‌گر ایام عونا</div>
            <div class="actions">
              <button id="btnExample1" class="btn btn--alt">مثال ۱</button>
              <button id="btnExample2" class="btn btn--alt">مثال ۲</button>
            </div>
          </header>

          <div class="cards">
            <div class="card card--inputs">
              <div class="section-title">ورود تاریخ‌ها</div>

              <div class="row row--two">
                <div class="block" id="blockPrev">
                  <h4>تاریخ قاعدگی قبلی</h4>
                  <div class="calendar-toggle" data-for="prev">
                    <button class="active" data-cal="fa">شمسی</button>
                    <button data-cal="he">عبری</button>
                  </div>

                  <div class="inline" style="margin-top:10px">
                    <div>
                      <label>روز</label>
                      <select id="prevDay"></select>
                    </div>
                    <div>
                      <label>ماه</label>
                      <select id="prevMonth"></select>
                    </div>
                    <div>
                      <label>سال</label>
                      <select id="prevYear"></select>
                    </div>
                    <div>
                      <label class="weak">ابزار</label>
                      <button id="swapBtn" class="btn btn--ghost" title="جابجایی دو تاریخ">جابجایی</button>
                    </div>
                  </div>

                  <div id="prevHelper" class="helper tiny">
                    <div class="equiv">معادل: —</div>
                    <div class="weak">روز هفته: —</div>
                    <div class="error" style="display:none"></div>
                  </div>
                </div>

                <div class="block" id="blockCurr">
                  <h4>تاریخ قاعدگی جاری</h4>
                  <div class="calendar-toggle" data-for="curr">
                    <button class="active" data-cal="fa">شمسی</button>
                    <button data-cal="he">عبری</button>
                  </div>

                  <div class="inline" style="margin-top:10px">
                    <div>
                      <label>روز</label>
                      <select id="currDay"></select>
                    </div>
                    <div>
                      <label>ماه</label>
                      <select id="currMonth"></select>
                    </div>
                    <div>
                      <label>سال</label>
                      <select id="currYear"></select>
                    </div>
                    <div>
                      <label class="weak">ذخیره</label>
                      <button id="saveBtn" class="btn btn--primary" title="ذخیره ورودی‌ها و نتایج به‌صورت تصویر">ذخیره تصویر</button>
                    </div>
                  </div>

                  <div id="currHelper" class="helper tiny">
                    <div class="equiv">معادل: —</div>
                    <div class="weak">روز هفته: —</div>
                    <div class="error" style="display:none"></div>
                  </div>
                </div>
              </div>

              <div class="actions">
                <span class="pill">سال‌ها: سال جاری ±۲</span>
                <span class="pill">ورودی عبری: روز ۱ تا ۳۰</span>
                <span class="pill">محاسبه خودکار نتایج</span>
              </div>
            </div>

            <div class="card card--results">
              <div class="section-title">نتایج محاسبات</div>
              <div class="results" id="results">
                <div class="item" id="r1">
                  <h5>نتیجه ۱: ۳۰ روز پس از قاعدگی جاری (با احتساب روز خودش)</h5>
                  <div class="date-line">—</div>
                  <div class="equiv muted">—</div>
                </div>
                <div class="item" id="r2">
                  <h5>نتیجه ۲: قاعدگی جاری + فاصله دو قاعدگی اخیر</h5>
                  <div class="date-line">—</div>
                  <div class="equiv muted">—</div>
                </div>
                <div class="item" id="r3">
                  <h5>نتیجه ۳: همان روز تاریخ قاعدگی جاری در ماه بعد عبری</h5>
                  <div class="date-line">—</div>
                  <div class="equiv muted">—</div>
                  <div class="muted tiny" id="r3Note"></div>
                </div>
              </div>
              <div class="helper tiny" id="noteBox">
                مثال‌ها برای صحت‌سنجی:
                <div style="margin-top:6px">
                  - مثال ۱: قبلی ۱۱ اسفند ۱۴۰۳ ≡ ۱ ادار ۵۷۸۵ | جاری ۱۲ فروردین ۱۴۰۴ ≡ ۳ نیسان ۵۷۸۵
                </div>
                <div>
                  - مثال ۲: قبلی ۱۸ خشوان ۵۷۸۶ ≡ ۱۸ آبان ۱۴۰۴ | جاری ۹ کیسلو ۵۷۸۶ ≡ ۸ آذر ۱۴۰۴
                </div>
              </div>
            </div>
          </div>

          <footer>
            ساخته‌شده برای محاسبات عونا — سبک، فارسی، و قابل‌استفاده در موبایل/کامپیوتر.
          </footer>
        </div>
      </div>
    `;

    // Add the JavaScript functionality
    const script = document.createElement('script');
    script.textContent = `
      (() => {
        // -------------------------
        // داده‌ها و ابزارهای عمومی
        // -------------------------
        const MS = 86400000;

        const faMonths = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
        // ترتیب عبری (سال مذهبی) مطابق درخواست: نیسان تا ادار/ادار ب
        const heMonthsFA = ["نیسان","ایار","سیوان","تموز","آو","الول","تیشری","خشوان","کیسلو","طوت","شواط","ادار","ادار ب"];

        // نگاشت نام انگلیسی عبری به اندیس ترتیب مذهبی
        function heEnglishMonthToIndexAndFA(name) {
          const n = name.toLowerCase();
          if (n.startsWith("nisan")) return {i:1, fa:"نیسان"};
          if (n.startsWith("iyyar") || n.startsWith("iyar") || n.startsWith("iyyar") || n.startsWith("iyy")) return {i:2, fa:"ایار"};
          if (n.startsWith("sivan")) return {i:3, fa:"سیوان"};
          if (n.startsWith("tammuz")) return {i:4, fa:"تموز"};
          if (n === "av") return {i:5, fa:"آو"};
          if (n.startsWith("elul")) return {i:6, fa:"الول"};
          if (n.startsWith("tishri") || n.startsWith("tishrei")) return {i:7, fa:"تیشری"};
          if (n.startsWith("heshvan") || n.startsWith("cheshvan")) return {i:8, fa:"خشوان"};
          if (n.startsWith("kislev")) return {i:9, fa:"کیسلو"};
          if (n.startsWith("tevet") || n.startsWith("teveth")) return {i:10, fa:"طوت"};
          if (n.startsWith("shevat")) return {i:11, fa:"شواط"};
          if (n === "adar i" || n === "adar i.") return {i:12, fa:"ادار"};
          if (n === "adar ii" || n === "adar ii.") return {i:13, fa:"ادار ب"};
          if (n === "adar") return {i:12, fa:"ادار"};
          // fallback
          return {i:12, fa:"ادار"};
        }

        const faDigits = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];
        function toFa(num) {
          return String(num).replace(/\\d/g, d => faDigits[+d]);
        }
        function fromFa(str) {
          return String(str).replace(/[۰-۹]/g, d => String(faDigits.indexOf(d))).replace(/[^\\d\\-]/g,'');
        }

        const fmtFaWeekday = new Intl.DateTimeFormat('fa-IR', { weekday:'long' });
        const fmtFaPersian = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year:'numeric', month:'numeric', day:'numeric' });
        const fmtHeEn = new Intl.DateTimeFormat('en-US-u-ca-hebrew', { year:'numeric', month:'long', day:'numeric' });

        function getFaWeekday(d){ return fmtFaWeekday.format(d); }

        // تبدیل گِرِگوریَن -> شمسی (اعداد و نام ماه فارسی)
        function formatPersianFromG(d) {
          const parts = fmtFaPersian.formatToParts(d);
          const y = +fromFa(parts.find(p=>p.type==='year').value);
          const m = +fromFa(parts.find(p=>p.type==='month').value);
          const day = +fromFa(parts.find(p=>p.type==='day').value);
          return {
            y, m, d: day,
            monthName: faMonths[m-1],
            weekday: getFaWeekday(d),
            text: \`\${getFaWeekday(d)} \${toFa(day)} \${faMonths[m-1]} \${toFa(y)}\`
          };
        }

        // تبدیل گِرِگوریَن -> عبری (نام انگلیسی -> اندیس/نام فارسی)
        function formatHebrewFromG(d) {
          const parts = fmtHeEn.formatToParts(d);
          const y = +parts.find(p=>p.type==='year').value;
          const day = +parts.find(p=>p.type==='day').value;
          const mNameEn = parts.find(p=>p.type==='month').value;
          const {i: monthIndex, fa: monthFA} = heEnglishMonthToIndexAndFA(mNameEn);
          return {
            y, mIndex: monthIndex, d: day,
            monthName: monthFA,
            weekday: getFaWeekday(d),
            text: \`\${getFaWeekday(d)} \${toFa(day)} \${monthFA} \${toFa(y)}\`
          };
        }

        // یافتن تاریخ گِرِگوریَن از ورودی شمسی با جستجو در بازه‌ای مطمئن
        function gregorianFromPersian(y, m, day) {
          // بازه تقریبی: از 1 ژانویه (y+621) تا 31 دسامبر (y+622)
          const start = new Date(y+621, 0, 1);
          const end = new Date(y+622, 11, 31);
          for (let t = start.getTime(); t <= end.getTime(); t += MS) {
            const d = new Date(t);
            const p = formatPersianFromG(d);
            if (p.y === y && p.m === m && p.d === day) return d;
          }
          return null;
        }

        // یافتن تاریخ گِرِگوریَن از ورودی عبری با جستجو در بازه‌ای مطمئن
        function gregorianFromHebrew(y, mIndex, day) {
          // سال عبری تقریباً = میلادی + 3760/3761
          const g = y - 3760;
          const start = new Date(g-1, 0, 1);
          const end = new Date(g+1, 11, 31);
          for (let t = start.getTime(); t <= end.getTime(); t += MS) {
            const d = new Date(t);
            const h = formatHebrewFromG(d);
            if (h.y === y && h.mIndex === mIndex && h.d === day) return d;
          }
          return null;
        }

        // طول ماه شمسی (برای تنظیم روزها): 1..6 = 31، 7..11 = 30، 12 = 29/30
        const faMonthFixedLengths = [31,31,31,31,31,31,30,30,30,30,30];
        const persianLeapCache = new Map();
        function isPersianLeap(y) {
          if (persianLeapCache.has(y)) return persianLeapCache.get(y);
          const has30Esfand = !!gregorianFromPersian(y, 12, 30);
          persianLeapCache.set(y, has30Esfand);
          return has30Esfand;
        }
        function persianMonthLength(y, m) {
          if (m >=1 && m <= 11) return faMonthFixedLengths[m-1];
          return isPersianLeap(y) ? 30 : 29;
        }

        // افزودن روز به تاریخ گِرِگوریَن
        function addDays(d, n) {
          const r = new Date(d.getTime());
          r.setDate(r.getDate() + n);
          return r;
        }

        // اختلاف روزی بین دو تاریخ (d2 - d1)
        function diffDays(d2, d1) {
          const a = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
          const b = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
          return Math.round((a-b)/MS);
        }

        // یافتن «همان روز عبری» در ماه بعد (با قاعده ۳۰→۱ اگر ماه بعد ۲۹ روزه باشد)
        function hebrewSameDayNextMonthFromG(gDate) {
          const h0 = formatHebrewFromG(gDate);
          const targetDay = Math.min(30, h0.d); // ورودی عبری 1..30
          // پیدا کردن اول ماه بعد
          let cur = addDays(gDate, 1);
          let nextRosh = null;
          while (true) {
            const h = formatHebrewFromG(cur);
            if (h.d === 1 && !(h.mIndex === h0.mIndex && h.y === h0.y)) { nextRosh = new Date(cur); break; }
            cur = addDays(cur, 1);
          }
          // اولِ ماهِ بعدِ بعد
          cur = addDays(nextRosh, 1);
          let afterNextRosh = null;
          while (true) {
            const h = formatHebrewFromG(cur);
            const nextH = formatHebrewFromG(nextRosh);
            if (h.d === 1 && !(h.mIndex === nextH.mIndex && h.y === nextH.y)) { afterNextRosh = new Date(cur); break; }
            cur = addDays(cur, 1);
          }
          const nextMonthLength = diffDays(afterNextRosh, nextRosh); // 29 یا 30
          if (targetDay <= nextMonthLength) {
            return addDays(nextRosh, targetDay - 1);
          } else {
            // قاعده‌ی خواسته‌شده: اگر روز ۳۰ وجود نداشت، روز اولِ ماهِ بعدِ بعد
            return new Date(afterNextRosh);
          }
        }

        // قالب خروجی دوبل (شمسی + عبری)
        function dualDisplay(gDate) {
          const P = formatPersianFromG(gDate);
          const H = formatHebrewFromG(gDate);
          return {
            faText: P.text,
            heText: \`\${toFa(H.d)} \${H.monthName} \${toFa(H.y)}\`,
            weekday: P.weekday,
            lineFa: P.text,
            lineHe: \`\${H.monthName} \${toFa(H.d)}، \${toFa(H.y)}\`
          };
        }

        // -------------------------
        // وضعیت و المان‌ها
        // -------------------------
        const state = {
          prev: { cal: 'fa', y: null, m: 1, d: 1, g: null },
          curr: { cal: 'fa', y: null, m: 1, d: 1, g: null }
        };

        const els = {
          // prev
          prevDay: document.getElementById('prevDay'),
          prevMonth: document.getElementById('prevMonth'),
          prevYear: document.getElementById('prevYear'),
          prevHelper: document.getElementById('prevHelper'),
          // curr
          currDay: document.getElementById('currDay'),
          currMonth: document.getElementById('currMonth'),
          currYear: document.getElementById('currYear'),
          currHelper: document.getElementById('currHelper'),
          // actions
          swapBtn: document.getElementById('swapBtn'),
          saveBtn: document.getElementById('saveBtn'),
          btnExample1: document.getElementById('btnExample1'),
          btnExample2: document.getElementById('btnExample2'),
          // results
          r1: document.querySelector('#r1 .date-line'),
          r1e: document.querySelector('#r1 .equiv'),
          r2: document.querySelector('#r2 .date-line'),
          r2e: document.querySelector('#r2 .equiv'),
          r3: document.querySelector('#r3 .date-line'),
          r3e: document.querySelector('#r3 .equiv'),
          r3Note: document.getElementById('r3Note'),
          noteBox: document.getElementById('noteBox'),
        };

        // -------------------------
        // ساخت گزینه‌های ورودی
        // -------------------------
        function currentPersianYear() {
          const p = formatPersianFromG(new Date());
          return p.y;
        }
        function currentHebrewYear() {
          const h = formatHebrewFromG(new Date());
          return h.y;
        }

        function fillDays(select, maxDay) {
          const cur = +fromFa(select.value || '1');
          select.innerHTML = '';
          for (let d = 1; d <= maxDay; d++) {
            const opt = document.createElement('option');
            opt.value = String(d);
            opt.textContent = toFa(d);
            if (d === Math.min(cur, maxDay)) opt.selected = true;
            select.appendChild(opt);
          }
        }

        function fillMonths(select, cal) {
          select.innerHTML = '';
          const months = cal === 'fa' ? faMonths : heMonthsFA;
          months.forEach((name, i) => {
            const opt = document.createElement('option');
            opt.value = String(i+1);
            opt.textContent = name;
            select.appendChild(opt);
          });
        }

        function fillYears(select, cal) {
          select.innerHTML = '';
          const nowY = cal === 'fa' ? currentPersianYear() : currentHebrewYear();
          const years = [];
          for (let y = nowY-2; y <= nowY+2; y++) years.push(y);
          years.forEach(y => {
            const opt = document.createElement('option');
            opt.value = String(y);
            opt.textContent = toFa(y);
            select.appendChild(opt);
          });
          // انتخاب سال جاری
          select.value = String(nowY);
        }

        function setupBlock(which) {
          const isFa = state[which].cal === 'fa';
          const dayEl = els[which+'Day'];
          const monthEl = els[which+'Month'];
          const yearEl = els[which+'Year'];

          fillMonths(monthEl, isFa ? 'fa' : 'he');
          fillYears(yearEl, isFa ? 'fa' : 'he');
          if (isFa) {
            const y = +fromFa(yearEl.value);
            const m = +monthEl.value;
            fillDays(dayEl, persianMonthLength(y, m));
          } else {
            fillDays(dayEl, 30);
          }
        }

        function updateHelper(which) {
          const cal = state[which].cal;
          const dayEl = els[which+'Day'];
          const monthEl = els[which+'Month'];
          const yearEl = els[which+'Year'];
          const helper = els[which+'Helper'];
          const day = +fromFa(dayEl.value);
          const month = +monthEl.value;
          const year = +fromFa(yearEl.value);

          let g = null;
          let equivFa = '—';
          let w = '—';
          let error = '';

          if (cal === 'fa') {
            g = gregorianFromPersian(year, month, day);
            if (!g) {
              error = 'تاریخ شمسی نامعتبر است (روز/ماه/سال را بررسی کنید).';
            } else {
              const H = formatHebrewFromG(g);
              equivFa = \`\${toFa(H.d)} \${H.monthName} \${toFa(H.y)}\`;
              w = getFaWeekday(g);
            }
          } else {
            g = gregorianFromHebrew(year, month, day);
            if (!g) {
              error = 'تاریخ عبری نامعتبر است (روز/ماه/سال را بررسی کنید).';
            } else {
              const P = formatPersianFromG(g);
              equivFa = \`\${toFa(P.d)} \${P.monthName} \${toFa(P.y)}\`;
              w = getFaWeekday(g);
            }
          }

          state[which].d = day; state[which].m = month; state[which].y = year; state[which].g = g;

          const eq = helper.querySelector('.equiv');
          const wk = helper.querySelector('.weak');
          const er = helper.querySelector('.error');
          eq.textContent = 'معادل: ' + (g ? equivFa : '—');
          wk.textContent = 'روز هفته: ' + (g ? w : '—');
          er.style.display = error ? '' : 'none';
          er.textContent = error;

          computeResults();
        }

        function computeResults() {
          const gPrev = state.prev.g;
          const gCurr = state.curr.g;

          const clear = () => {
            els.r1.textContent = '—'; els.r1e.textContent = '—';
            els.r2.textContent = '—'; els.r2e.textContent = '—';
            els.r3.textContent = '—'; els.r3e.textContent = '—'; els.r3Note.textContent = '';
          };
          if (!gPrev || !gCurr) { clear(); return; }

          // نتیجه ۱: +29 روز
          const r1d = addDays(gCurr, 29);
          const R1 = dualDisplay(r1d);
          els.r1.textContent = R1.lineFa;
          els.r1e.textContent = \`معادل عبری: \${R1.lineHe}\`;

          // نتیجه ۲: اختلاف دو قاعدگی
          const delta = Math.max(0, diffDays(gCurr, gPrev));
          const r2d = addDays(gCurr, delta);
          const R2 = dualDisplay(r2d);
          els.r2.textContent = R2.lineFa + \` (\${toFa(delta)} روز بعد)\`;
          els.r2e.textContent = \`معادل عبری: \${R2.lineHe}\`;

          // نتیجه ۳: همان روز عبری در ماه بعد (قاعده ۳۰→۱ در ماه ۲۹‌روزه)
          const r3d = hebrewSameDayNextMonthFromG(gCurr);
          const R3 = dualDisplay(r3d);
          els.r3.textContent = R3.lineFa;
          els.r3e.textContent = \`معادل عبری: \${R3.lineHe}\`;
          // یادداشت در صورت اعمال قاعده ۳۰→۱
          const h0 = formatHebrewFromG(gCurr);
          const appliedRule = (h0.d === 30) && (formatHebrewFromG(r3d).d === 1);
          els.r3Note.textContent = appliedRule ? 'یادداشت: ماه عبری بعد ۲۹ روزه بود؛ بنابراین روز اولِ ماهِ بعدِ بعد انتخاب شد.' : '';
        }

        // تغییر تقویم (شمسی/عبری)
        function attachCalendarToggle(forWhich) {
          const wrap = document.querySelector(\`.calendar-toggle[data-for="\${forWhich}"]\`);
          wrap.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
              wrap.querySelectorAll('button').forEach(b => b.classList.remove('active'));
              btn.classList.add('active');
              state[forWhich].cal = btn.dataset.cal;
              setupBlock(forWhich);
              updateHelper(forWhich);
            });
          });
        }

        // رویدادهای ورودی‌ها
        function attachIO(which) {
          const d = els[which+'Day'], m = els[which+'Month'], y = els[which+'Year'];
          m.addEventListener('change', () => {
            if (state[which].cal === 'fa') {
              const yy = +fromFa(y.value), mm = +m.value;
              fillDays(d, persianMonthLength(yy, mm));
            }
            updateHelper(which);
          });
          y.addEventListener('change', () => {
            if (state[which].cal === 'fa') {
              const yy = +fromFa(y.value), mm = +m.value;
              fillDays(d, persianMonthLength(yy, mm));
            } else {
              fillDays(d, 30);
            }
            updateHelper(which);
          });
          d.addEventListener('change', () => updateHelper(which));
        }

        // دکمه جابجایی
        els.swapBtn.addEventListener('click', () => {
          const p = state.prev, c = state.curr;
          // تعویض وضعیت
          const tmp = JSON.parse(JSON.stringify(p));
          state.prev = c; state.curr = tmp;

          // باز-رندر ورودی‌ها طبق وضعیت جدید
          // prev
          document.querySelector('.calendar-toggle[data-for="prev"] button[data-cal="fa"]').classList.toggle('active', state.prev.cal==='fa');
          document.querySelector('.calendar-toggle[data-for="prev"] button[data-cal="he"]').classList.toggle('active', state.prev.cal==='he');
          setupBlock('prev');
          els.prevYear.value = String(state.prev.y ?? (state.prev.cal==='fa'?currentPersianYear():currentHebrewYear()));
          els.prevMonth.value = String(state.prev.m ?? 1);
          fillDays(els.prevDay, state.prev.cal==='fa' ? persianMonthLength(+fromFa(els.prevYear.value), +els.prevMonth.value) : 30);
          els.prevDay.value = String(state.prev.d ?? 1);

          // curr
          document.querySelector('.calendar-toggle[data-for="curr"] button[data-cal="fa"]').classList.toggle('active', state.curr.cal==='fa');
          document.querySelector('.calendar-toggle[data-for="curr"] button[data-cal="he"]').classList.toggle('active', state.curr.cal==='he');
          setupBlock('curr');
          els.currYear.value = String(state.curr.y ?? (state.curr.cal==='fa'?currentPersianYear():currentHebrewYear()));
          els.currMonth.value = String(state.curr.m ?? 1);
          fillDays(els.currDay, state.curr.cal==='fa' ? persianMonthLength(+fromFa(els.currYear.value), +els.currMonth.value) : 30);
          els.currDay.value = String(state.curr.d ?? 1);

          updateHelper('prev'); updateHelper('curr');
        });

        // ذخیره تصویر: ترسیم متن‌ها روی Canvas
        els.saveBtn.addEventListener('click', () => {
          const gPrev = state.prev.g, gCurr = state.curr.g;
          if (!gPrev || !gCurr) { alert('ابتدا هر دو تاریخ را معتبر وارد کنید.'); return; }

          const Pprev = dualDisplay(gPrev);
          const Pcurr = dualDisplay(gCurr);

          const r1d = addDays(gCurr, 29), R1 = dualDisplay(r1d);
          const delta = Math.max(0, diffDays(gCurr, gPrev));
          const r2d = addDays(gCurr, delta), R2 = dualDisplay(r2d);
          const r3d = hebrewSameDayNextMonthFromG(gCurr), R3 = dualDisplay(r3d);

          const W = 1080, H = 720;
          const cnv = document.createElement('canvas');
          cnv.width = W; cnv.height = H;
          const ctx = cnv.getContext('2d');

          // پس‌زمینه
          const grd = ctx.createLinearGradient(0,0,0,H);
          grd.addColorStop(0, '#0b1020'); grd.addColorStop(1, '#0a0f1d');
          ctx.fillStyle = grd; ctx.fillRect(0,0,W,H);

          // عنوان
          ctx.fillStyle = '#a7f3d0'; ctx.font = 'bold 28px sans-serif';
          ctx.fillText('محاسبه‌گر ایام عونا', 40, 50);

          ctx.fillStyle = '#cbd5e1'; ctx.font = 'bold 22px sans-serif';
          ctx.fillText('ورودی‌ها', 40, 90);

          ctx.font = '18px sans-serif'; ctx.fillStyle = '#e5e7eb';
          ctx.fillText('قاعدگی قبلی:', 40, 125);
          ctx.fillText(Pprev.lineFa + '  |  عبری: ' + Pprev.lineHe, 180, 125);

          ctx.fillText('قاعدگی جاری:', 40, 155);
          ctx.fillText(Pcurr.lineFa + '  |  عبری: ' + Pcurr.lineHe, 180, 155);

          // خط جداکننده
          ctx.strokeStyle = 'rgba(255,255,255,.2)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(40, 185); ctx.lineTo(W-40, 185); ctx.stroke();

          // نتایج
          ctx.fillStyle = '#cbd5e1'; ctx.font = 'bold 22px sans-serif';
          ctx.fillText('نتایج', 40, 220);

          ctx.font = 'bold 18px sans-serif'; ctx.fillStyle = '#a7f3d0';
          ctx.fillText('نتیجه ۱:', 40, 255);
          ctx.fillStyle = '#e5e7eb'; ctx.font = '18px sans-serif';
          ctx.fillText(R1.lineFa, 120, 255);
          ctx.fillStyle = '#93c5fd';
          ctx.fillText('عبری: ' + R1.lineHe, 120, 280);

          ctx.fillStyle = '#a7f3d0'; ctx.font = 'bold 18px sans-serif';
          ctx.fillText('نتیجه ۲:', 40, 320);
          ctx.fillStyle = '#e5e7eb'; ctx.font = '18px sans-serif';
          ctx.fillText(R2.lineFa + \`  (\${toFa(delta)} روز بعد)\`, 120, 320);
          ctx.fillStyle = '#93c5fd';
          ctx.fillText('عبری: ' + R2.lineHe, 120, 345);

          ctx.fillStyle = '#a7f3d0'; ctx.font = 'bold 18px sans-serif';
          ctx.fillText('نتیجه ۳:', 40, 385);
          ctx.fillStyle = '#e5e7eb'; ctx.font = '18px sans-serif';
          ctx.fillText(R3.lineFa, 120, 385);
          ctx.fillStyle = '#93c5fd';
          ctx.fillText('عبری: ' + R3.lineHe, 120, 410);

          // واترمارک کوچک
          ctx.fillStyle = '#94a3b8'; ctx.font = '14px sans-serif';
          ctx.fillText('ساخته‌شده برای محاسبات عونا — نسخه سبک', 40, H-30);

          const a = document.createElement('a');
          a.download = 'eyam-ona.png';
          a.href = cnv.toDataURL('image/png');
          a.click();
        });

        // مثال‌ها
        function loadExample1() {
          // مثال ۱:
          // قبلی: 11 اسفند 1403 ≡ 1 ادار 5785
          // جاری: 12 فروردین 1404 ≡ 3 نیسان 5785
          // prev - shamsi
          document.querySelector('.calendar-toggle[data-for="prev"] button[data-cal="fa"]').click();
          els.prevYear.value = String(1403);
          els.prevMonth.value = String(12);
          fillDays(els.prevDay, persianMonthLength(1403, 12));
          els.prevDay.value = String(11);
          updateHelper('prev');
          // curr - shamsi
          document.querySelector('.calendar-toggle[data-for="curr"] button[data-cal="fa"]').click();
          els.currYear.value = String(1404);
          els.currMonth.value = String(1);
          fillDays(els.currDay, persianMonthLength(1404, 1));
          els.currDay.value = String(12);
          updateHelper('curr');
        }

        function loadExample2() {
          // مثال ۲:
          // قبلی: 18 خشوان 5786 ≡ 18 آبان 1404
          // جاری: 9 کیسلو 5786 ≡ 8 آذر 1404
          // prev - hebrew (خشوان=8)
          document.querySelector('.calendar-toggle[data-for="prev"] button[data-cal="he"]').click();
          els.prevYear.value = String(5786);
          els.prevMonth.value = String(8);
          fillDays(els.prevDay, 30);
          els.prevDay.value = String(18);
          updateHelper('prev');
          // curr - hebrew (کیسلو=9)
          document.querySelector('.calendar-toggle[data-for="curr"] button[data-cal="he"]').click();
          els.currYear.value = String(5786);
          els.currMonth.value = String(9);
          fillDays(els.currDay, 30);
          els.currDay.value = String(9);
          updateHelper('curr');
        }

        els.btnExample1.addEventListener('click', loadExample1);
        els.btnExample2.addEventListener('click', loadExample2);

        // مقداردهی اولیه
        attachCalendarToggle('prev');
        attachCalendarToggle('curr');
        attachIO('prev');
        attachIO('curr');

        // حالت شروع: هر دو شمسی با تاریخ امروز و امروز-۳۰
        state.prev.cal = 'fa'; state.curr.cal = 'fa';
        setupBlock('prev'); setupBlock('curr');

        // امروز در شمسی
        const todayG = new Date();
        const todayP = formatPersianFromG(todayG);
        const prevGuessG = addDays(todayG, -30);
        const prevP = formatPersianFromG(prevGuessG);

        els.currYear.value = String(todayP.y);
        els.currMonth.value = String(todayP.m);
        fillDays(els.currDay, persianMonthLength(todayP.y, todayP.m));
        els.currDay.value = String(todayP.d);

        els.prevYear.value = String(prevP.y);
        els.prevMonth.value = String(prevP.m);
        fillDays(els.prevDay, persianMonthLength(prevP.y, prevP.m));
        els.prevDay.value = String(prevP.d);

        updateHelper('prev'); updateHelper('curr');
      })();
    `;
    
    containerRef.current.appendChild(script);
  }, []);

  return <div ref={containerRef}></div>;
};

export default PersianCalculator;