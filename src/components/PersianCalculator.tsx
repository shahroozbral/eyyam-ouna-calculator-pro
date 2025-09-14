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

        // ذخیره تصویر: ترسیم متن‌ها روی Canvas با طراحی زیبا و راست به چپ
        els.saveBtn.addEventListener('click', () => {
          const gPrev = state.prev.g, gCurr = state.curr.g;
          if (!gPrev || !gCurr) { alert('ابتدا هر دو تاریخ را معتبر وارد کنید.'); return; }

          const Pprev = dualDisplay(gPrev);
          const Pcurr = dualDisplay(gCurr);

          const r1d = addDays(gCurr, 29), R1 = dualDisplay(r1d);
          const delta = Math.max(0, diffDays(gCurr, gPrev));
          const r2d = addDays(gCurr, delta), R2 = dualDisplay(r2d);
          const r3d = nextHebrewMonthSameDay(gCurr), R3 = dualDisplay(r3d);

          const cnv = document.createElement('canvas');
          const W = 1000, H = 700;
          cnv.width = W; cnv.height = H;
          const ctx = cnv.getContext('2d');
          
          // پلی‌فیل برای roundRect در مرورگرهای قدیمی
          if (!ctx.roundRect) {
            ctx.roundRect = function(x, y, w, h, r) {
              this.beginPath();
              this.moveTo(x + r, y);
              this.lineTo(x + w - r, y);
              this.quadraticCurveTo(x + w, y, x + w, y + r);
              this.lineTo(x + w, y + h - r);
              this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
              this.lineTo(x + r, y + h);
              this.quadraticCurveTo(x, y + h, x, y + h - r);
              this.lineTo(x, y + r);
              this.quadraticCurveTo(x, y, x + r, y);
              this.closePath();
            };
          }

          // تابع رسم متن RTL با موقعیت درست
          const drawRTLText = (text, x, y, fontSize = 16, fontWeight = 'normal', color = '#ffffff') => {
            ctx.fillStyle = color;
            ctx.font = \`\${fontWeight} \${fontSize}px Arial, sans-serif\`;
            ctx.textAlign = 'right';
            ctx.fillText(text, x, y);
          };

          // تابع رسم آیکون زیبا
          const drawIcon = (x, y, size, color) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, size/2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.beginPath();
            ctx.arc(x - size/4, y - size/4, size/6, 0, Math.PI * 2);
            ctx.fill();
          };
          
          // پس‌زمینه زیبا با گرادیان پیچیده
          const bgGradient = ctx.createRadialGradient(W/2, H/3, 0, W/2, H/3, W);
          bgGradient.addColorStop(0, '#1a1a2e');
          bgGradient.addColorStop(0.3, '#16213e');
          bgGradient.addColorStop(0.6, '#0f172a');
          bgGradient.addColorStop(1, '#020617');
          ctx.fillStyle = bgGradient;
          ctx.fillRect(0, 0, W, H);

          // پترن نقطه‌ای درخشان
          ctx.fillStyle = 'rgba(167, 243, 208, 0.05)';
          for(let x = 0; x < W; x += 40) {
            for(let y = 0; y < H; y += 40) {
              ctx.beginPath();
              ctx.arc(x, y, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          // خطوط تزئینی در پس‌زمینه
          ctx.strokeStyle = 'rgba(167, 243, 208, 0.1)';
          ctx.lineWidth = 1;
          for(let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(W - i * 200, 0);
            ctx.lineTo(W - i * 200 - 100, H);
            ctx.stroke();
          }

          // سایه برای کارت اصلی
          ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
          ctx.shadowBlur = 30;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 15;

          // کارت اصلی با گرادیان پیچیده
          const cardGradient = ctx.createLinearGradient(0, 80, 0, H-80);
          cardGradient.addColorStop(0, 'rgba(30, 41, 59, 0.95)');
          cardGradient.addColorStop(0.5, 'rgba(15, 23, 42, 0.9)');
          cardGradient.addColorStop(1, 'rgba(2, 6, 23, 0.95)');
          ctx.fillStyle = cardGradient;
          ctx.roundRect(50, 80, W-100, H-160, 25);
          ctx.fill();

          // حاشیه درخشان کارت
          const borderGradient = ctx.createLinearGradient(0, 80, 0, H-80);
          borderGradient.addColorStop(0, 'rgba(167, 243, 208, 0.6)');
          borderGradient.addColorStop(0.5, 'rgba(34, 197, 94, 0.4)');
          borderGradient.addColorStop(1, 'rgba(167, 243, 208, 0.6)');
          ctx.strokeStyle = borderGradient;
          ctx.lineWidth = 3;
          ctx.roundRect(50, 80, W-100, H-160, 25);
          ctx.stroke();

          // ریست سایه
          ctx.shadowColor = 'transparent';

          // آیکون و عنوان اصلی
          drawIcon(W-120, 130, 40, '#34d399');
          const titleGradient = ctx.createLinearGradient(W-80, 0, W-300, 0);
          titleGradient.addColorStop(0, '#a7f3d0');
          titleGradient.addColorStop(1, '#34d399');
          drawRTLText('محاسبه‌گر ایام عونا', W-80, 140, 36, 'bold', titleGradient);

          // خط تزئینی زیر عنوان
          const decorGradient = ctx.createLinearGradient(W-80, 0, W-500, 0);
          decorGradient.addColorStop(0, '#a7f3d0');
          decorGradient.addColorStop(0.5, '#34d399');
          decorGradient.addColorStop(1, 'transparent');
          ctx.strokeStyle = decorGradient;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(W-80, 155);
          ctx.lineTo(W-500, 155);
          ctx.stroke();

          // بخش ورودی‌ها با آیکون
          drawIcon(W-120, 200, 25, '#60a5fa');
          drawRTLText('ورودی‌ها', W-80, 210, 26, 'bold', '#e2e8f0');

          // کارت ورودی قبلی با سایه
          ctx.shadowColor = 'rgba(59, 130, 246, 0.3)';
          ctx.shadowBlur = 15;
          const prevCardGrad = ctx.createLinearGradient(0, 240, 0, 310);
          prevCardGrad.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
          prevCardGrad.addColorStop(1, 'rgba(59, 130, 246, 0.05)');
          ctx.fillStyle = prevCardGrad;
          ctx.roundRect(100, 240, W-200, 70, 15);
          ctx.fill();
          
          ctx.shadowColor = 'transparent';
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
          ctx.lineWidth = 2;
          ctx.roundRect(100, 240, W-200, 70, 15);
          ctx.stroke();
          
          drawIcon(W-130, 260, 20, '#60a5fa');
          drawRTLText('قاعدگی قبلی:', W-80, 265, 20, 'bold', '#93c5fd');
          drawRTLText(\`\${Pprev.lineFa}\`, W-80, 290, 16, 'normal', '#dbeafe');
          drawRTLText(\`عبری: \${Pprev.lineHe}\`, W-330, 290, 14, 'normal', '#bfdbfe');

          // کارت ورودی جاری با سایه
          ctx.shadowColor = 'rgba(34, 197, 94, 0.3)';
          ctx.shadowBlur = 15;
          const currCardGrad = ctx.createLinearGradient(0, 330, 0, 400);
          currCardGrad.addColorStop(0, 'rgba(34, 197, 94, 0.2)');
          currCardGrad.addColorStop(1, 'rgba(34, 197, 94, 0.05)');
          ctx.fillStyle = currCardGrad;
          ctx.roundRect(100, 330, W-200, 70, 15);
          ctx.fill();
          
          ctx.shadowColor = 'transparent';
          ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
          ctx.lineWidth = 2;
          ctx.roundRect(100, 330, W-200, 70, 15);
          ctx.stroke();
          
          drawIcon(W-130, 350, 20, '#34d399');
          drawRTLText('قاعدگی جاری:', W-80, 355, 20, 'bold', '#6ee7b7');
          drawRTLText(\`\${Pcurr.lineFa}\`, W-80, 380, 16, 'normal', '#d1fae5');
          drawRTLText(\`عبری: \${Pcurr.lineHe}\`, W-330, 380, 14, 'normal', '#a7f3d0');

          // خط جداکننده مدرن
          const sepGrad = ctx.createLinearGradient(100, 0, W-100, 0);
          sepGrad.addColorStop(0, 'transparent');
          sepGrad.addColorStop(0.1, 'rgba(167, 243, 208, 0.1)');
          sepGrad.addColorStop(0.5, 'rgba(167, 243, 208, 0.6)');
          sepGrad.addColorStop(0.9, 'rgba(167, 243, 208, 0.1)');
          sepGrad.addColorStop(1, 'transparent');
          ctx.strokeStyle = sepGrad;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(100, 430);
          ctx.lineTo(W-100, 430);
          ctx.stroke();

          // عنوان نتایج
          drawIcon(W-120, 470, 25, '#f59e0b');
          drawRTLText('نتایج محاسبات', W-80, 480, 26, 'bold', '#fbbf24');

          // نتایج با طراحی مدرن
          const results = [
            { title: 'نتیجه ۱ - ۳۰ روز بعد:', data: R1, color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)', y: 510 },
            { title: \`نتیجه ۲ - \${toFa(delta)} روز بعد:\`, data: R2, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)', y: 590 },
            { title: 'نتیجه ۳ - ماه عبری بعد:', data: R3, color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)', y: 670 }
          ];

          results.forEach((result, index) => {
            ctx.shadowColor = \`\${result.color}30\`;
            ctx.shadowBlur = 10;
            
            ctx.fillStyle = result.bg;
            ctx.roundRect(100, result.y, W-200, 65, 12);
            ctx.fill();
            
            ctx.shadowColor = 'transparent';
            ctx.strokeStyle = \`\${result.color}80\`;
            ctx.lineWidth = 2;
            ctx.roundRect(100, result.y, W-200, 65, 12);
            ctx.stroke();
            
            drawIcon(W-130, result.y + 20, 18, result.color);
            drawRTLText(result.title, W-80, result.y + 25, 18, 'bold', result.color);
            drawRTLText(\`\${result.data.lineFa}\`, W-80, result.y + 50, 15, 'normal', '#f1f5f9');
            drawRTLText(\`عبری: \${result.data.lineHe}\`, W-350, result.y + 50, 13, 'normal', '#cbd5e1');
          });

          // واترمارک زیبا
          ctx.textAlign = 'center';
          drawRTLText('ساخته‌شده برای محاسبات عونا — طراحی زیبا و کاربردی', W/2, H-30, 14, 'normal', 'rgba(148, 163, 184, 0.8)');

          const a = document.createElement('a');
          a.download = 'eyam-ona-rtl-beautiful.png';
          a.href = cnv.toDataURL('image/png', 0.95);
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