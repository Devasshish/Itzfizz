(function () {
  'use strict';

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  function generateSkyline() {
    const skyContainer = document.querySelector('.sky');
    if (!skyContainer) return;

    let rectsSvg = '';
    let currentX = 0;
    let iteration = 0;

    while (currentX < 1600) {
      const width = 28 + Math.abs(Math.sin(iteration * 7.3)) * 46;
      const height = 30 + Math.abs(Math.sin(iteration * 3.1 + 1)) * 140;

      rectsSvg += `<rect x="${currentX.toFixed(0)}" y="${(200 - height).toFixed(0)}" width="${width.toFixed(0)}" height="${height.toFixed(0)}"/>`;
      currentX += width + 4;
      iteration++;
    }

    skyContainer.innerHTML = `<svg viewBox="0 0 1600 200" preserveAspectRatio="none" fill="#14130F" fill-opacity=".1">${rectsSvg}</svg>`;
  }

  generateSkyline();

  function generateStars() {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer) return;

    let starsHtml = '';
    const starCount = 42;
    for (let i = 0; i < starCount; i++) {
      const left = (Math.random() * 96 + 2).toFixed(1);
      const top = (Math.random() * 92 + 3).toFixed(1);
      const size = (Math.random() * 2 + 1.2).toFixed(1);
      const dur = (Math.random() * 2.5 + 2).toFixed(1);
      const delay = (Math.random() * 3).toFixed(1);
      const opacity = (Math.random() * 0.5 + 0.35).toFixed(2);
      starsHtml += `<span class="star" style="left:${left}%;top:${top}%;width:${size}px;height:${size}px;--dur:${dur}s;animation-delay:${delay}s;opacity:${opacity};"></span>`;
    }
    starsContainer.innerHTML = starsHtml;
  }

  generateStars();

  function splitText(element, byWord = false) {
    if (!element) return;
    const text = element.textContent.trim();
    element.textContent = '';

    const segments = byWord ? text.split(' ') : text.split('');
    segments.forEach((segment, index, array) => {
      const span = document.createElement('span');
      span.className = byWord ? 'w' : 'ch';
      if (segment === ' ') {
        span.innerHTML = '&nbsp;';
      } else {
        span.textContent = segment;
      }
      element.appendChild(span);

      if (byWord && index < array.length - 1) {
        element.appendChild(document.createTextNode(' '));
      }
    });
  }

  document.querySelectorAll('[data-split]').forEach(function (el) {
    splitText(el, false);
  });

  const panelHeading = document.querySelector('.panel h2');
  if (panelHeading) {
    splitText(panelHeading, true);
  }

  if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function () {
    const ctx = gsap.context(function () {
      const isDesktop = window.matchMedia('(min-width: 821px)').matches;

      const introTimeline = gsap.timeline({
        defaults: { ease: 'power3.out' }
      });

      gsap.set('.statement-wake', { autoAlpha: 0, x: -20 });
      gsap.set('.wake-lines .w-line', { scaleX: 0, transformOrigin: 'left' });

      introTimeline
        .from('header > *', {
          y: -16,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08
        }, 0.1)
        .from('.ch', {
          yPercent: 115,
          opacity: 0,
          rotate: 4,
          duration: 0.85,
          stagger: 0.035
        }, 0.25)
        .from('.car-scroll', {
          x: -30,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out'
        }, 0.35)
        .from('.metrics li', {
          y: 26,
          opacity: 0,
          duration: 0.5,
          stagger: 0.12
        }, '-=0.5');

      document.querySelectorAll('.num').forEach(function (counterEl) {
        const targetValue = Number(counterEl.dataset.to) || 0;
        const countObj = { value: 0 };

        gsap.to(countObj, {
          value: targetValue,
          duration: 1.4,
          delay: 0.9,
          ease: 'power2.out',
          onUpdate: function () {
            counterEl.textContent = Math.round(countObj.value);
          }
        });
      });

      const statusPulseEl = document.querySelector('.status-pulse');
      const statusTextEl = document.querySelector('.status-text');
      const statusState = { progress: 0 };

      const masterScrollTimeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: '.stage',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          invalidateOnRefresh: true
        }
      });

      masterScrollTimeline
        .to('.progress', {
          scaleX: 1,
          duration: 1
        }, 0)

        .to(statusState, {
          progress: 1,
          duration: 0.75,
          onUpdate: function () {
            const prog = masterScrollTimeline.progress();
            if (prog >= 0.30) {

              if (statusPulseEl) {
                statusPulseEl.style.background = '#7CF6FF';
                statusPulseEl.style.boxShadow = '0 0 10px #7CF6FF';
              }
              if (statusTextEl) {
                statusTextEl.textContent = 'Night drive, crafting the future';
              }
            } else {
              if (statusPulseEl) {
                statusPulseEl.style.background = 'var(--accent)';
                statusPulseEl.style.boxShadow = 'none';
              }
              if (statusTextEl) {
                statusTextEl.textContent = 'Creative studio, taking new projects';
              }
            }
          }
        }, 0)

        .to('.car-scroll', {
          x: isDesktop ? '38vw' : '24vw',
          rotation: -0.6,
          scale: isDesktop ? 1.08 : 1.03,
          transformOrigin: '50% 100%',
          duration: 0.16,
          ease: 'power1.out'
        }, 0)
        .to('.car-scroll', {
          x: isDesktop ? '48vw' : '30vw',
          duration: 0.64,
          ease: 'none'
        }, 0.16)
        .to('.wheel', {
          rotation: 1440,
          transformOrigin: '50% 50%',
          duration: 0.8
        }, 0)
        .to('.road-dashes', {
          x: -800,
          duration: 1
        }, 0)
        .to('.sky', {
          xPercent: -30,
          duration: 1
        }, 0)

        .to('.sun-wrap', {
          y: isDesktop ? '76vh' : '65vh',
          xPercent: 6,
          duration: 0.32,
          ease: 'power1.in'
        }, 0.06)
        .to('.sun', {
          backgroundColor: '#FF2A00',
          boxShadow: '0 0 40px rgba(255, 42, 0, 0.5)',
          duration: 0.16
        }, 0.08)
        .to('.sun', {
          backgroundColor: '#4A0E00',
          boxShadow: '0 0 10px rgba(74, 14, 0, 0.15)',
          opacity: 0,
          duration: 0.12
        }, 0.24)
        .to('.sun-halo', {
          opacity: 0.85,
          scale: 1.2,
          duration: 0.14
        }, 0.08)
        .to('.sun-halo', {
          opacity: 0,
          scale: 1.35,
          duration: 0.12
        }, 0.22)

        .to('.sunset-glow', {
          opacity: 1,
          duration: 0.18,
          ease: 'sine.out'
        }, 0.08)
        .to('.sunset-glow', {
          opacity: 0,
          duration: 0.16,
          ease: 'sine.in'
        }, 0.26)

        .to('.speed-lines .s-line', {
          scaleX: 1.6,
          stagger: 0.02,
          duration: 0.14,
          transformOrigin: 'left'
        }, 0.02)
        .to('.statement-wake', {
          autoAlpha: 1,
          x: 0,
          duration: 0.14,
          ease: 'power2.out'
        }, 0.03)
        .to('.wake-lines .w-line', {
          scaleX: 1,
          stagger: 0.03,
          duration: 0.14,
          ease: 'power2.out'
        }, 0.03)
        .to('.statement-wake', {
          autoAlpha: 0,
          y: -15,
          duration: 0.14
        }, 0.22)
        .to('.speed', {
          opacity: 0,
          duration: 0.14
        }, 0.22)

        .to('h1', {
          scale: 0.82,
          yPercent: -10,
          opacity: 0,
          duration: 0.3
        }, 0.05)
        .to('.metrics', {
          opacity: 0,
          y: 36,
          duration: 0.22
        }, 0.08)
        .to('.note, .cue', {
          opacity: 0,
          duration: 0.12
        }, 0.02)

        .to('.night-sky', {
          opacity: 1,
          duration: 0.26,
          ease: 'power1.inOut'
        }, 0.18)
        .to('.ground-layer', {
          backgroundColor: '#0A0A0D',
          borderColor: 'rgba(239, 235, 227, 0.22)',
          duration: 0.26
        }, 0.18)
        .to('header', {
          color: '#EFEBE3',
          duration: 0.16
        }, 0.28)
        .to('.road-dashes', {
          opacity: 0.35,
          duration: 0.15
        }, 0.32)

        .fromTo('.moon',
          {
            opacity: 0,
            scale: 0.82,
            y: isDesktop ? '15vh' : '10vh'
          },
          {
            opacity: 0.24,

            scale: 0.9,
            y: isDesktop ? '6vh' : '4vh',
            duration: 0.14,
            ease: 'sine.out'
          },
          0.14
        )
        .to('.moon', {
          opacity: 1,

          scale: 1,
          y: 0,
          duration: 0.22,
          ease: 'power2.out'
        }, 0.28)
        .fromTo('.moon-halo',
          { opacity: 0, scale: 0.65 },
          { opacity: 1, scale: 1, duration: 0.24, ease: 'sine.out' },
          0.30
        )

        .fromTo('.stars',
          { opacity: 0 },
          { opacity: 1, duration: 0.24 },
          0.28
        )

        .to('.beam', {
          opacity: 1,
          duration: 0.12
        }, 0.40)

        .to('.panel-left', {
          opacity: 1,
          y: 0,
          duration: 0.20,
          ease: 'power2.out'
        }, 0.44)
        .to('.caps', {
          opacity: 1,
          y: 0,
          duration: 0.20,
          ease: 'power2.out'
        }, 0.48)
        .to('.caps li', {
          '--p': 1,
          stagger: 0.08,
          duration: 0.14
        }, 0.52)

        .to('.wheel', {
          rotation: '+=360',
          duration: 0.2
        }, 0.8)
        .to('.car-scroll', {
          x: isDesktop ? '34vw' : '16vw',
          scale: isDesktop ? 1.12 : 1.06,
          duration: 0.2
        }, 0.8);
    });

    return function () {
      ctx.revert();
    };
  });
})();
