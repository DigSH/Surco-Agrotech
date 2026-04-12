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

  // â”€â”€ AI Chat simulation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  (function() {
    const chat = document.getElementById('aichat');
    if (!chat) return;

    const convs = [
      [
        { r:'u', t:'Â¿CÃ³mo va mi papa en el Lote Norte hoy?' },
        { r:'a', lines:['ðŸ“ Papa Pastusa Â· Lote Norte', 'ðŸŒ¡ï¸ TuberizaciÃ³n â€” GDD: 847 Â°CÂ·dÃ­a', 'ðŸ’§ Humedad suelo: 82% â€” Ã“ptima', 'âš ï¸ Condiciones favorables para tizÃ³n esta semana.'] },
        { r:'u', t:'Â¿QuÃ© me recomiendas hacer?' },
        { r:'a', lines:['ðŸ” Realiza monitoreo visual hoy.', 'ðŸ“… Revisa el lote antes del jueves.', 'ðŸŒ¬ï¸ Buen momento: viento < 10 km/h', 'ðŸ“‹ Registro guardado en cuaderno.'] },
      ],
      [
        { r:'u', t:'Â¿Necesito regar el lote maÃ±ana?' },
        { r:'a', lines:['ðŸ’§ No es necesario por ahora.', 'Humedad actual: 82% â€” Ã“ptima', 'ðŸŒ§ï¸ Lluvia prevista: 12 mm maÃ±ana', 'ðŸ“… PrÃ³ximo riego recomendado: jueves.'] },
        { r:'u', t:'Â¿CuÃ¡ndo puedo cosechar?' },
        { r:'a', lines:['ðŸŒ± Madurez estimada: 18 dÃ­as.', 'GDD restantes: ~240 Â°CÂ·dÃ­a', 'ðŸ” Monitorea el lote cada 3 dÃ­as.', 'ðŸ“Š Reporte disponible en tu cuaderno.'] },
      ],
      [
        { r:'u', t:'DetectÃ© manchas en las hojas, Â¿quÃ© es?' },
        { r:'a', lines:['ðŸ”¬ Imagen analizada con TFLite.', 'DiagnÃ³stico: TizÃ³n tardÃ­o 87%', 'ðŸ“‹ Alerta registrada en monitoreo.', 'ðŸ§‘â€ðŸŒ¾ Consulta a tu tÃ©cnico de campo.'] },
        { r:'u', t:'Â¿Afecta la producciÃ³n esperada?' },
        { r:'a', lines:['ðŸ“‰ Impacto estimado: 8â€“12%', 'si se actÃºa antes del viernes.', 'ðŸ’° Presupuesto del lote: en rango.', 'ðŸ“Š Varianza registrada en economÃ­a.'] },
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
        d.innerHTML = '<div class="cmsg-ai-tag">Surco Â· Asesor IA</div>' +
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
