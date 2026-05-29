/* ══════════════════════════════════════════
   ST-Fin Educational Site — Shared JS
   ══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Mobile Nav Toggle ── */
  const toggle = document.querySelector('.nav-toggle');
  const mobile = document.querySelector('.nav-mobile');
  if (toggle && mobile) {
    toggle.addEventListener('click', () => {
      mobile.classList.toggle('open');
      toggle.textContent = mobile.classList.contains('open') ? '✕' : '☰';
    });
    mobile.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobile.classList.remove('open');
        toggle.textContent = '☰';
      });
    });
  }

  /* ── Active Nav Link ── */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── Scroll Fade-in ── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('fade-up');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.observe').forEach(el => observer.observe(el));

  /* ── Accordions ── */
  document.querySelectorAll('.accordion-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.accordion-item');
      const body = item.querySelector('.accordion-body');
      const inner = body.querySelector('.accordion-body-inner');
      const isOpen = item.classList.contains('open');

      // Close all siblings
      item.parentElement.querySelectorAll('.accordion-item').forEach(sib => {
        sib.classList.remove('open');
        sib.querySelector('.accordion-body').style.maxHeight = '0';
      });

      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = inner.scrollHeight + 'px';
      }
    });
  });

  /* ── Tabs ── */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.tabs-container');
      group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      group.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const target = group.querySelector('#' + btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  /* ── ICS Triangle Calculator (interactive demo) ── */
  const calcDemo = document.getElementById('triangle-calc');
  if (calcDemo) {
    const sliders = {
      price:    calcDemo.querySelector('#calc-price'),
      anchor:   calcDemo.querySelector('#calc-anchor'),
      bars:     calcDemo.querySelector('#calc-bars'),
      lookback: calcDemo.querySelector('#calc-lookback'),
      sigma:    calcDemo.querySelector('#calc-sigma')
    };

    function updateCalc() {
      const P  = parseFloat(sliders.price.value);
      const A  = parseFloat(sliders.anchor.value);
      const B  = parseInt(sliders.bars.value);
      const L  = parseInt(sliders.lookback.value);
      const S  = parseFloat(sliders.sigma.value);

      // Update displayed values
      Object.keys(sliders).forEach(k => {
        const el = calcDemo.querySelector('#val-' + k);
        if (el) el.textContent = sliders[k].value;
      });

      if (S <= 0 || A <= 0 || P <= 0 || L <= 0) return;

      const yA = Math.log(A) / S;
      const yT = Math.log(P) / S;
      const dy = yT - yA;
      const dx = B / L;

      const theta = dx > 0 ? Math.atan(dy / dx) * (180 / Math.PI) : 0;
      const area = 0.5 * Math.abs(dy) * Math.abs(dx);
      const centroid = (2 * yA + yT) / 3;

      calcDemo.querySelector('#out-angle').textContent    = theta.toFixed(2) + '°';
      calcDemo.querySelector('#out-distance').textContent = dy.toFixed(4);
      calcDemo.querySelector('#out-area').textContent     = area.toFixed(4);
      calcDemo.querySelector('#out-centroid').textContent  = centroid.toFixed(4);

      // Color code angle
      const angleEl = calcDemo.querySelector('#out-angle');
      angleEl.style.color = theta > 0 ? '#26a69a' : theta < 0 ? '#ef5350' : '#b0b0c0';
    }

    Object.values(sliders).forEach(s => {
      if (s) s.addEventListener('input', updateCalc);
    });
    updateCalc();
  }

  /* ── Quorum Simulator ── */
  const quorumDemo = document.getElementById('quorum-sim');
  if (quorumDemo) {
    const slotToggles = quorumDemo.querySelectorAll('.slot-toggle');
    const minInput = quorumDemo.querySelector('#quorum-min');

    function updateQuorum() {
      const active = [];
      slotToggles.forEach((t, i) => {
        if (t.classList.contains('on')) active.push(i);
      });

      const min = parseInt(minInput.value);
      quorumDemo.querySelector('#val-quorum-min').textContent = min;
      quorumDemo.querySelector('#quorum-active').textContent = active.length;

      const passing = active.filter(() => Math.random() > 0.4).length;
      quorumDemo.querySelector('#quorum-passing').textContent = passing;

      const needed = Math.min(min, active.length);
      const fires = active.length > 0 && passing >= needed;
      const resultEl = quorumDemo.querySelector('#quorum-result');
      resultEl.textContent = fires ? 'SIGNAL FIRES' : 'NO SIGNAL';
      resultEl.style.color = fires ? '#26a69a' : '#ef5350';
    }

    slotToggles.forEach(t => {
      t.addEventListener('click', () => {
        t.classList.toggle('on');
        updateQuorum();
      });
    });

    if (minInput) minInput.addEventListener('input', updateQuorum);
    updateQuorum();
  }

  /* ── Combinatorial Counter ── */
  const comboDemo = document.getElementById('combo-counter');
  if (comboDemo) {
    const slotsInput = comboDemo.querySelector('#combo-slots');

    function updateCombo() {
      const n = parseInt(slotsInput.value);
      comboDemo.querySelector('#val-combo-slots').textContent = n;

      // Single slot: 20 vars × 5 conds × 7 sides = 700
      const single = 700;
      // C(700, n) approximation — show exact for small n
      let combos;
      if (n === 1) combos = 700;
      else if (n === 2) combos = 245350;
      else if (n === 3) combos = 57411900;
      else if (n === 4) combos = 10090141425;
      else if (n === 5) combos = 1420691912640;
      else {
        // Approximate using C(700,n)
        combos = 1;
        for (let i = 0; i < n; i++) {
          combos *= (700 - i) / (i + 1);
        }
        combos = Math.round(combos);
      }

      const el = comboDemo.querySelector('#combo-result');
      el.textContent = combos.toLocaleString();
    }

    if (slotsInput) slotsInput.addEventListener('input', updateCombo);
    if (slotsInput) updateCombo();
  }

});
