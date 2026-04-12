  // Scroll reveal
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('on'), i * 50);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach(el => io.observe(el));

  // Nav scroll
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 20), { passive: true });

  // Tilt effect on interactive cards
  const tiltCards = document.querySelectorAll('.bc, .ai-card, .cov-card, .tech-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `translateY(-4px) perspective(700px) rotateX(${-y*5}deg) rotateY(${x*5}deg) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  // Stagger bento cards
  document.querySelectorAll('.bc').forEach((c, i) => { c.style.transitionDelay = `${(i % 5) * 55}ms`; });

  // ── AI Chat simulation ────────────────────────────────────────────────
  (function() {
    const chat = document.getElementById('aichat');
    if (!chat) return;

    const convs = [
      [
        { r:'u', t:'¿Cómo va mi papa en el Lote Norte hoy?' },
        { r:'a', lines:['📍 Papa Pastusa · Lote Norte', '🌡️ Tuberización – GDD: 847 °C·día', '💧 Humedad suelo: 82% – Óptima', '⚠️ Condiciones favorables para tizón esta semana.'] },
        { r:'u', t:'¿Qué me recomiendas hacer?' },
        { r:'a', lines:['🔍 Realiza monitoreo visual hoy.', '📅 Revisa el lote antes del jueves.', '🌬️ Buen momento: viento < 10 km/h', '📋 Registro guardado en cuaderno.'] },
      ],
      [
        { r:'u', t:'¿Necesito regar el lote mañana?' },
        { r:'a', lines:['💧 No es necesario por ahora.', 'Humedad actual: 82% – Óptima', '🌧️ Lluvia prevista: 12 mm mañana', '📅 Próximo riego recomendado: jueves.'] },
        { r:'u', t:'¿Cuándo puedo cosechar?' },
        { r:'a', lines:['🌱 Madurez estimada: 18 días.', 'GDD restantes: ~240 °C·día', '🔍 Monitorea el lote cada 3 días.', '📊 Reporte disponible en tu cuaderno.'] },
      ],
      [
        { r:'u', t:'Detecté manchas en las hojas, ¿qué es?' },
        { r:'a', lines:['🔬 Imagen analizada con TFLite.', 'Diagnóstico: Tizón tardío 87%', '📋 Alerta registrada en monitoreo.', '🧑‍🌾 Consulta a tu técnico de campo.'] },
        { r:'u', t:'¿Afecta la producción esperada?' },
        { r:'a', lines:['📉 Impacto estimado: 8–12%', 'si se actúa antes del viernes.', '💰 Presupuesto del lote: en rango.', '📊 Varianza registrada en economía.'] },
      ],
    ];

    let ci = 0, mi = 0;
    let typEl = null;

    function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

    function addTyping() {
      typEl = document.createElement('div');
      typEl.className = 'ctyping';
      typEl.innerHTML = '<span></span><span></span><span></span>';
      chat.appendChild(typEl);
      requestAnimationFrame(() => typEl.classList.add('show'));
    }
    function removeTyping() { if (typEl) { typEl.remove(); typEl = null; } }

    function addBubble(msg) {
      const d = document.createElement('div');
      if (msg.r === 'u') {
        d.className = 'cmsg cmsg-user';
        d.textContent = msg.t;
      } else {
        d.className = 'cmsg cmsg-ai';
        d.innerHTML = '<div class="cmsg-ai-tag">Surco · Asesor IA</div>' +
          msg.lines.join('<br>');
      }
      chat.appendChild(d);
      requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('show')));
    }

    // keep only last N bubbles visible
    function trim() {
      const msgs = chat.querySelectorAll('.cmsg');
      if (msgs.length > 6) msgs[0].remove();
    }

    async function run() {
      while (true) {
        const conv = convs[ci];
        const msg  = conv[mi];

        if (msg.r === 'a') {
          addTyping();
          await delay(1500);
          removeTyping();
          addBubble(msg);
        } else {
          addBubble(msg);
        }
        trim();

        mi++;
        if (mi >= conv.length) {
          await delay(4200);
          // fade out all messages
          chat.querySelectorAll('.cmsg').forEach(el => {
            el.style.transition = 'opacity .5s';
            el.style.opacity = '0';
          });
          await delay(600);
          chat.innerHTML = '';
          ci = (ci + 1) % convs.length;
          mi = 0;
          await delay(400);
        } else {
          await delay(msg.r === 'u' ? 900 : 1300);
        }
      }
    }

    setTimeout(run, 800);
  })();

  // Hero image slider
  const sliderImgs = document.querySelectorAll('#heroSlider img');
  let current = 0;
  setInterval(() => {
    sliderImgs[current].classList.remove('active');
    current = (current + 1) % sliderImgs.length;
    sliderImgs[current].classList.add('active');
  }, 3000);
