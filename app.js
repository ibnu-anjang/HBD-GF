/**
 * ============================================================================
 * ROMANTIC 1:1 BIRTHDAY INTERACTIVE ENGINE (app.js)
 * ============================================================================
 * Mengatur:
 * - State perpindahan 8 Scene dengan mulus
 * - Countdown ke 9 November 2026 00:00 WIB (atau Preview 5 detik)
 * - Partikel bintang & Heart Bokeh di Scene 3 + Confetti di Scene 2
 * - Efek ketik surat otomatis (Scene 4) & teks penutup (Scene 8)
 * - Galeri Polaroid dengan fallback jujur jika foto belum dimasukkan
 * - Custom Video Player Portrait dengan fitur Auto-Pause BGM
 * - BGM Player dengan fallback synthesizer piano romantis jika MP3 belum ada
 */

(function () {
  "use strict";

  const CFG = window.HBD_CONFIG || {};
  let currentScene = 1;
  let countdownTimerId = null;
  let isCountdownUnlocked = false;

  // Typewriter state (Scene 4)
  let letterTypingTimer = null;
  let isLetterTyped = false;

  // Closing rotating typewriter state (Scene 8)
  let closingTypeTimer = null;

  // Video & BGM coordination state
  let bgmIsPlaying = false;
  let bgmWasPlayingBeforeVideo = false;
  let usingFallbackSynth = false;
  let synthIntervalId = null;
  let audioCtx = null;

  // Simulated video playback state when moment.mp4 is not yet placed
  let isVideoFileMissing = false;
  let simVideoPlaying = false;
  let simVideoTime = 0;
  const simVideoDuration = 10;
  let simVideoTimer = null;

  // Canvas Ambient Particles & Confetti
  const canvas = document.getElementById("ambient-canvas");
  const ctx = canvas ? canvas.getContext("2d") : null;
  let stars = [];
  let heartBokehs = [];
  let burstParticles = [];
  let ambientMode = "stars"; // "stars" | "hearts"

  // ==========================================================================
  // 1. INITIALIZATION & HYDRATION FROM CONFIG.JS
  // ==========================================================================
  function initApp() {
    hydrateStaticTexts();
    renderHeroPolaroids();
    renderMemoriesGallery();
    initCountdown();
    initGiftScene();
    initSceneNavigation();
    initVideoPlayer();
    initMusicController();
    initAmbientCanvas();
  }

  function hydrateStaticTexts() {
    if (CFG.scene1) {
      setText("s1-eyebrow", CFG.scene1.eyebrow);
      setText("s1-title-italic", CFG.scene1.titleItalic);
      setText("s1-title-regular", CFG.scene1.titleRegular);
      setText("s1-subtitle", CFG.scene1.subtitle);
    }
    if (CFG.scene2) {
      setText("s2-eyebrow", CFG.scene2.eyebrow);
      setText("s2-instruction", CFG.scene2.instruction);
    }
    if (CFG.scene3) {
      setText("s3-eyebrow", CFG.scene3.eyebrow);
      setText("s3-title-line1", CFG.scene3.titleLine1);
      setText("s3-title-line2", CFG.scene3.titleLine2);
      setText("s3-subtitle", CFG.scene3.subtitle);
      setText("s3-btn-label", CFG.scene3.buttonText);
    }
    if (CFG.scene4) {
      setText("s4-title", CFG.scene4.title);
      setText("s4-btn-label", CFG.scene4.buttonText);
    }
    if (CFG.scene5) {
      setText("s5-title", CFG.scene5.title);
      setText("s5-subtitle", CFG.scene5.subtitle);
      setText("s5-btn-label", CFG.scene5.buttonText);
    }
    if (CFG.scene6) {
      setText("s6-title", CFG.scene6.title);
      setText("s6-subtitle", CFG.scene6.subtitle);
      setText("s6-btn-label", CFG.scene6.buttonText);
    }
    if (CFG.scene7) {
      setText("s7-title", CFG.scene7.title);
      setText("s7-subtitle", CFG.scene7.subtitle);
      setText("s7-message", CFG.scene7.message);
      setText("s7-btn-label", CFG.scene7.buttonText);
    }
    if (CFG.scene8) {
      setText("s8-line1", CFG.scene8.line1);
      setText("s8-line2", CFG.scene8.line2);
      setText("s8-signoff", CFG.scene8.signoff);
      setText("s8-replay-label", CFG.scene8.replayButtonText);
    }
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el && typeof value === "string") {
      el.textContent = value;
    }
  }

  // ==========================================================================
  // 2. SCENE TRANSITION CONTROLLER
  // ==========================================================================
  function goToScene(targetNumber) {
    const prevEl = document.getElementById("scene-" + currentScene);
    const nextEl = document.getElementById("scene-" + targetNumber);
    if (!nextEl) return;

    // Pause video if leaving Scene 6
    if (currentScene === 6 && targetNumber !== 6) {
      pauseVideoPlayback(true);
    }

    // Stop closing typewriter if leaving Scene 8
    if (currentScene === 8 && targetNumber !== 8 && closingTypeTimer) {
      clearTimeout(closingTypeTimer);
      closingTypeTimer = null;
    }

    if (prevEl && prevEl !== nextEl) {
      prevEl.classList.remove("is-active");
      setTimeout(() => {
        prevEl.hidden = true;
        showNextScene(nextEl, targetNumber);
      }, 320);
    } else {
      showNextScene(nextEl, targetNumber);
    }
  }

  function showNextScene(nextEl, targetNumber) {
    currentScene = targetNumber;
    nextEl.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Ambient Heart Bokeh specifically on Scene 3 (Hero)
    if (targetNumber === 3) {
      ambientMode = "hearts";
      document.body.classList.add("is-hero-bokeh");
    } else {
      ambientMode = "stars";
      document.body.classList.remove("is-hero-bokeh");
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        nextEl.classList.add("is-active");
      });
    });

    // Trigger scene-specific choreography
    if (targetNumber === 4) {
      startLetterTypewriter();
    } else if (targetNumber === 8) {
      startClosingTypewriter();
    }
  }

  function initSceneNavigation() {
    const btnReadLetter = document.getElementById("btn-read-letter");
    const btnToMemories = document.getElementById("btn-to-memories");
    const btnToVideo = document.getElementById("btn-to-video");
    const btnToWishes = document.getElementById("btn-to-wishes");
    const btnToClosing = document.getElementById("btn-to-closing");
    const btnReplay = document.getElementById("btn-replay");
    const btnSkipTyping = document.getElementById("btn-skip-typing");

    if (btnReadLetter) {
      btnReadLetter.addEventListener("click", () => goToScene(4));
    }
    if (btnToMemories) {
      btnToMemories.addEventListener("click", () => goToScene(5));
    }
    if (btnToVideo) {
      btnToVideo.addEventListener("click", () => goToScene(6));
    }
    if (btnToWishes) {
      btnToWishes.addEventListener("click", () => goToScene(7));
    }
    if (btnToClosing) {
      btnToClosing.addEventListener("click", () => goToScene(8));
    }
    if (btnReplay) {
      btnReplay.addEventListener("click", () => {
        resetExperienceAndReplay();
      });
    }
    if (btnSkipTyping) {
      btnSkipTyping.addEventListener("click", () => {
        completeLetterInstantly();
      });
    }
  }

  // ==========================================================================
  // 3. SCENE 1: COUNTDOWN LOGIC (9 NOV 2026 00:00 OR PREVIEW 5s)
  // ==========================================================================
  function initCountdown() {
    if (countdownTimerId) {
      clearInterval(countdownTimerId);
    }

    const usePreview = Boolean(CFG.previewMode);
    const previewSecs = Number(CFG.previewSeconds) > 0 ? Number(CFG.previewSeconds) : 5;
    const deadlineMs = usePreview
      ? Date.now() + previewSecs * 1000
      : new Date(CFG.targetDate || "2026-11-09T00:00:00+07:00").getTime();

    const btnOpenGift = document.getElementById("btn-open-gift");
    if (btnOpenGift && !btnOpenGift.dataset.bound) {
      btnOpenGift.dataset.bound = "true";
      btnOpenGift.addEventListener("click", () => {
        if (!isCountdownUnlocked) {
          const hintEl = document.getElementById("s1-hint-text");
          if (hintEl) {
            hintEl.textContent = "Sabar yaa, tunggu hitung mundurnya selesai dulu...";
          }
          return;
        }
        // Start background music automatically on first user gesture
        if (!bgmIsPlaying) {
          startBgmPlayback();
        }
        goToScene(2);
      });
    }

    function tick() {
      const now = Date.now();
      const diff = Math.max(0, deadlineMs - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.ceil((diff / 1000) % 60);

      setText("cd-days", String(days).padStart(2, "0"));
      setText("cd-hours", String(hours).padStart(2, "0"));
      setText("cd-minutes", String(minutes).padStart(2, "0"));
      setText("cd-seconds", String(diff === 0 ? 0 : seconds === 60 ? 59 : seconds).padStart(2, "0"));

      if (diff <= 0) {
        clearInterval(countdownTimerId);
        unlockCountdownGift();
      } else {
        lockCountdownGift();
      }
    }

    tick();
    countdownTimerId = setInterval(tick, 250);
  }

  function lockCountdownGift() {
    isCountdownUnlocked = false;
    const btn = document.getElementById("btn-open-gift");
    const statusText = document.getElementById("s1-status-text");
    const btnLabel = document.getElementById("btn-open-gift-label");
    const hintText = document.getElementById("s1-hint-text");
    const lockIcon = document.getElementById("btn-gift-icon-lock");

    if (statusText && CFG.scene1) statusText.textContent = CFG.scene1.waitingStatus;
    if (btnLabel && CFG.scene1) btnLabel.textContent = CFG.scene1.waitingButton;
    if (hintText && CFG.scene1) {
      hintText.hidden = false;
      hintText.textContent = CFG.scene1.waitingHint;
    }
    if (btn) {
      btn.classList.add("is-locked");
      btn.classList.remove("is-ready");
      btn.setAttribute("aria-disabled", "true");
    }
    if (lockIcon) {
      lockIcon.innerHTML =
        '<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>';
    }
  }

  function unlockCountdownGift() {
    isCountdownUnlocked = true;
    const btn = document.getElementById("btn-open-gift");
    const statusText = document.getElementById("s1-status-text");
    const btnLabel = document.getElementById("btn-open-gift-label");
    const hintText = document.getElementById("s1-hint-text");
    const lockIcon = document.getElementById("btn-gift-icon-lock");
    const statusIcon = document.getElementById("s1-status-icon");

    if (statusText && CFG.scene1) statusText.textContent = CFG.scene1.readyStatus;
    if (btnLabel && CFG.scene1) btnLabel.textContent = CFG.scene1.readyButton;
    if (hintText) hintText.hidden = true;

    if (statusIcon) {
      statusIcon.innerHTML =
        '<path d="M12 2L14.39 8.26L21 9.27L16.15 13.74L17.45 20.3L12 17.07L6.55 20.3L7.85 13.74L3 9.27L9.61 8.26L12 2Z"/>';
    }
    if (lockIcon) {
      lockIcon.innerHTML =
        '<path d="M12 2L14.39 8.26L21 9.27L16.15 13.74L17.45 20.3L12 17.07L6.55 20.3L7.85 13.74L3 9.27L9.61 8.26L12 2Z"/>';
    }

    if (btn) {
      btn.classList.remove("is-locked");
      btn.classList.add("is-ready");
      btn.setAttribute("aria-disabled", "false");
    }
  }

  // ==========================================================================
  // 4. SCENE 2: GIFT BOX UNWRAPPING + PARTICLE BURST
  // ==========================================================================
  function initGiftScene() {
    const giftBtn = document.getElementById("gift-trigger-btn");
    if (!giftBtn) return;

    giftBtn.addEventListener("click", () => {
      if (giftBtn.classList.contains("is-opening")) return;
      giftBtn.classList.add("is-opening");
      spawnConfettiBurst();

      if (!bgmIsPlaying) {
        startBgmPlayback();
      }

      setTimeout(() => {
        goToScene(3);
        setTimeout(() => {
          giftBtn.classList.remove("is-opening");
        }, 500);
      }, 880);
    });
  }

  // ==========================================================================
  // 5. SCENE 3 & SCENE 5: POLAROID RENDERING WITH HONEST PLACEHOLDERS (R-23)
  // ==========================================================================
  function renderHeroPolaroids() {
    const topCluster = document.getElementById("hero-polaroids-top");
    const bottomCluster = document.getElementById("hero-polaroids-bottom");
    if (!topCluster || !bottomCluster) return;

    const list = (CFG.scene3 && Array.isArray(CFG.scene3.floatingPolaroids))
      ? CFG.scene3.floatingPolaroids
      : [];

    topCluster.innerHTML = "";
    bottomCluster.innerHTML = "";

    list.forEach((item, idx) => {
      const card = document.createElement("div");
      card.className = "mini-polaroid";

      const frame = document.createElement("div");
      frame.className = "mini-polaroid-frame";

      function showHeroFallback() {
        frame.innerHTML = "";
        const tag = document.createElement("span");
        tag.className = "polaroid-fallback-tag";
        tag.textContent = item.caption || "[FOTO " + (idx + 1) + "]";
        frame.appendChild(tag);
      }

      if (item.src && item.src.trim() !== "") {
        const img = document.createElement("img");
        img.alt = item.caption || "Foto Kenangan " + (idx + 1);
        img.addEventListener("error", showHeroFallback);
        img.src = item.src;
        frame.appendChild(img);
      } else {
        showHeroFallback();
      }

      card.appendChild(frame);

      // First 3 go to top cluster (above hero text on mobile, left side on desktop)
      // Remaining 3 go to bottom cluster (below CTA on mobile, right side on desktop)
      if (idx < 3) {
        topCluster.appendChild(card);
      } else {
        bottomCluster.appendChild(card);
      }
    });
  }

  function renderMemoriesGallery() {
    const grid = document.getElementById("memories-grid");
    if (!grid) return;

    const moments = (CFG.scene5 && Array.isArray(CFG.scene5.moments))
      ? CFG.scene5.moments
      : [];

    grid.innerHTML = "";

    moments.forEach((moment, idx) => {
      const photosList = Array.isArray(moment.photos) ? moment.photos : [];
      const coverSrc = moment.cover || (photosList[0] || "");
      const titleText = moment.title || "Momen " + String(idx + 1).padStart(2, "0");

      // Wrapper button that holds the fanned stack layers + main front polaroid
      const stackBtn = document.createElement("button");
      stackBtn.type = "button";
      stackBtn.className = "moment-stack-btn";
      stackBtn.setAttribute("aria-label", "Buka album " + titleText + " (" + photosList.length + " foto)");

      // Add fanned polaroid stack layers behind the front card proportional to photo count (up to 4 back sheets)
      const extraSheetsCount = Math.min(4, Math.max(0, photosList.length - 1));
      for (let s = extraSheetsCount; s >= 1; s--) {
        const layer = document.createElement("span");
        layer.className = "polaroid-stack-layer layer-" + s;
        layer.setAttribute("aria-hidden", "true");
        stackBtn.appendChild(layer);
      }

      const card = document.createElement("div");
      card.className = "memory-polaroid-card";

      const photoBox = document.createElement("div");
      photoBox.className = "memory-photo-box";

      function showMemoryFallback() {
        photoBox.innerHTML = "";
        const wrap = document.createElement("div");
        wrap.className = "memory-placeholder-box";

        const badge = document.createElement("span");
        badge.className = "memory-placeholder-tag";
        badge.textContent = "[MOMEN " + String(idx + 1).padStart(2, "0") + "]";

        const hint = document.createElement("span");
        hint.className = "memory-placeholder-hint";
        hint.textContent = moment.folder || "assets/moments/momen-" + String(idx + 1).padStart(2, "0");

        wrap.appendChild(badge);
        wrap.appendChild(hint);
        photoBox.appendChild(wrap);
      }

      if (coverSrc && coverSrc.trim() !== "") {
        const img = document.createElement("img");
        img.alt = titleText;
        img.loading = "lazy";
        img.addEventListener("error", showMemoryFallback);
        img.src = coverSrc;
        photoBox.appendChild(img);
      } else {
        showMemoryFallback();
      }

      card.appendChild(photoBox);

      const cap = document.createElement("p");
      cap.className = "memory-caption";
      cap.textContent = titleText;
      card.appendChild(cap);

      stackBtn.appendChild(card);

      stackBtn.addEventListener("click", () => {
        openMomentModal(moment, idx);
      });

      grid.appendChild(stackBtn);
    });

    initMomentModalEvents();
  }

  let momentModalBound = false;
  let activeModalPhotos = [];
  let activeModalTitle = "";
  let activeModalIndex = 0;
  let modalFadeTimer = null;

  function initMomentModalEvents() {
    if (momentModalBound) return;
    momentModalBound = true;

    const modal = document.getElementById("moment-modal");
    const closeBtn = document.getElementById("moment-modal-close");
    const prevBtn = document.getElementById("moment-prev-btn");
    const nextBtn = document.getElementById("moment-next-btn");
    const stage = document.getElementById("moment-viewer-stage");

    if (closeBtn) {
      closeBtn.addEventListener("click", closeMomentModal);
    }
    if (prevBtn) {
      prevBtn.addEventListener("click", () => stepModalPhoto(-1));
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => stepModalPhoto(1));
    }
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          closeMomentModal();
        }
      });
    }
    document.addEventListener("keydown", (e) => {
      if (!modal || modal.hidden) return;
      if (e.key === "Escape") {
        closeMomentModal();
      } else if (e.key === "ArrowLeft") {
        stepModalPhoto(-1);
      } else if (e.key === "ArrowRight") {
        stepModalPhoto(1);
      }
    });

    // Touch & Pointer Swipe Left / Right Gesture for Mobile & Desktop
    if (stage) {
      let startX = 0;
      let startY = 0;
      let tracking = false;

      stage.addEventListener("touchstart", (e) => {
        if (!e.touches || e.touches.length === 0) return;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        tracking = true;
      }, { passive: true });

      stage.addEventListener("touchend", (e) => {
        if (!tracking || !e.changedTouches || e.changedTouches.length === 0) return;
        tracking = false;
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;
        if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy)) {
          if (dx < 0) {
            stepModalPhoto(1);
          } else {
            stepModalPhoto(-1);
          }
        }
      }, { passive: true });
    }
  }

  function openMomentModal(moment, idx) {
    const modal = document.getElementById("moment-modal");
    const titleEl = document.getElementById("moment-modal-title");
    const closeBtn = document.getElementById("moment-modal-close");
    const prevBtn = document.getElementById("moment-prev-btn");
    const nextBtn = document.getElementById("moment-next-btn");
    const hintEl = document.getElementById("moment-swipe-hint");

    if (!modal) return;

    activeModalPhotos = Array.isArray(moment.photos) ? moment.photos : [];
    activeModalTitle = moment.title || "Momen " + String(idx + 1).padStart(2, "0");
    activeModalIndex = 0;

    if (titleEl) titleEl.textContent = activeModalTitle;

    const hasMultiple = activeModalPhotos.length > 1;
    if (prevBtn) prevBtn.hidden = !hasMultiple;
    if (nextBtn) nextBtn.hidden = !hasMultiple;
    if (hintEl) hintEl.hidden = !hasMultiple;

    renderModalDots();
    updateModalSlide(0, false);

    modal.hidden = false;
    if (closeBtn) {
      closeBtn.focus();
    }
  }

  function renderModalDots() {
    const dotsWrap = document.getElementById("moment-dots");
    if (!dotsWrap) return;
    dotsWrap.innerHTML = "";
    if (activeModalPhotos.length <= 1) return;

    activeModalPhotos.forEach((_, idx) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "moment-dot" + (idx === activeModalIndex ? " is-active" : "");
      dot.setAttribute("aria-label", "Lihat foto " + (idx + 1));
      dot.addEventListener("click", () => {
        if (idx !== activeModalIndex) {
          updateModalSlide(idx, true);
        }
      });
      dotsWrap.appendChild(dot);
    });
  }

  function stepModalPhoto(delta) {
    if (activeModalPhotos.length <= 1) return;
    const nextIdx = (activeModalIndex + delta + activeModalPhotos.length) % activeModalPhotos.length;
    updateModalSlide(nextIdx, true);
  }

  function updateModalSlide(targetIdx, withFade) {
    activeModalIndex = targetIdx;
    const imgEl = document.getElementById("moment-active-img");
    const countEl = document.getElementById("moment-modal-count");
    const captionEl = document.getElementById("moment-active-caption");
    const dotsWrap = document.getElementById("moment-dots");

    if (countEl) {
      countEl.textContent = (targetIdx + 1) + " / " + activeModalPhotos.length;
    }
    if (captionEl) {
      captionEl.textContent = activeModalTitle + " (" + (targetIdx + 1) + "/" + activeModalPhotos.length + ")";
    }
    if (dotsWrap) {
      const dots = dotsWrap.querySelectorAll(".moment-dot");
      dots.forEach((d, dIdx) => d.classList.toggle("is-active", dIdx === targetIdx));
    }

    if (!imgEl) return;
    const nextSrc = activeModalPhotos[targetIdx] || "";

    if (modalFadeTimer) {
      clearTimeout(modalFadeTimer);
      modalFadeTimer = null;
    }

    if (withFade) {
      imgEl.classList.add("is-fading");
      modalFadeTimer = setTimeout(() => {
        imgEl.src = nextSrc;
        imgEl.alt = activeModalTitle + " - Foto " + (targetIdx + 1);
        imgEl.onload = () => {
          imgEl.classList.remove("is-fading");
        };
        setTimeout(() => {
          imgEl.classList.remove("is-fading");
        }, 60);
      }, 180);
    } else {
      imgEl.classList.remove("is-fading");
      imgEl.src = nextSrc;
      imgEl.alt = activeModalTitle + " - Foto " + (targetIdx + 1);
    }
  }

  function closeMomentModal() {
    const modal = document.getElementById("moment-modal");
    if (modal) {
      modal.hidden = true;
    }
  }

  // ==========================================================================
  // 6. SCENE 4: TYPEWRITER LOVE LETTER ENGINE
  // ==========================================================================
  function startLetterTypewriter() {
    const greetingEl = document.getElementById("s4-greeting-text");
    const greetingHeart = document.getElementById("s4-greeting-heart");
    const bodyEl = document.getElementById("letter-typed-body");
    const scrollBox = document.getElementById("letter-scroll-box");
    const skipBtn = document.getElementById("btn-skip-typing");

    if (!greetingEl || !bodyEl || !CFG.scene4) return;

    if (isLetterTyped) return;

    if (letterTypingTimer) {
      clearTimeout(letterTypingTimer);
    }

    greetingEl.textContent = CFG.scene4.greeting || "HAPPY BIRTHDAY SAYANGKUUU";
    if (greetingHeart) greetingHeart.hidden = false;
    bodyEl.innerHTML = "";
    if (skipBtn) skipBtn.classList.remove("is-done");

    const paragraphs = Array.isArray(CFG.scene4.paragraphs) ? CFG.scene4.paragraphs : [];
    const speed = Number(CFG.scene4.typeSpeedMs) || 26;

    let pIndex = 0;
    let charIndex = 0;
    let activeTextSpan = null;
    let userScrolledUp = false;
    let isAutoScrolling = false;

    const cursorSpan = document.createElement("span");
    cursorSpan.className = "typewriter-cursor";
    cursorSpan.textContent = "|";

    if (scrollBox) {
      scrollBox.scrollTop = 0;
      scrollBox.onscroll = function () {
        if (isAutoScrolling) return;
        const distanceFromBottom =
          scrollBox.scrollHeight - scrollBox.scrollTop - scrollBox.clientHeight;
        // Jika user scroll ke atas lebih dari 45px, jangan paksa tarik ke bawah
        userScrolledUp = distanceFromBottom > 45;
      };
    }

    function syncScrollToBottom() {
      if (!scrollBox || userScrolledUp) return;
      const targetTop = scrollBox.scrollHeight - scrollBox.clientHeight;
      if (targetTop > scrollBox.scrollTop) {
        isAutoScrolling = true;
        scrollBox.scrollTop = targetTop;
        requestAnimationFrame(() => {
          isAutoScrolling = false;
        });
      }
    }

    function typeNextChar() {
      if (pIndex >= paragraphs.length) {
        isLetterTyped = true;
        if (skipBtn) skipBtn.classList.add("is-done");
        return;
      }

      const currentParagraphText = paragraphs[pIndex];
      if (!activeTextSpan) {
        const p = document.createElement("p");
        activeTextSpan = document.createElement("span");
        p.appendChild(activeTextSpan);
        p.appendChild(cursorSpan);
        bodyEl.appendChild(p);
      }

      charIndex++;
      activeTextSpan.textContent = currentParagraphText.slice(0, charIndex);
      syncScrollToBottom();

      if (charIndex < currentParagraphText.length) {
        letterTypingTimer = setTimeout(typeNextChar, speed);
      } else {
        pIndex++;
        charIndex = 0;
        activeTextSpan = null;
        letterTypingTimer = setTimeout(typeNextChar, speed * 9);
      }
    }

    typeNextChar();
  }

  function completeLetterInstantly() {
    if (letterTypingTimer) {
      clearTimeout(letterTypingTimer);
      letterTypingTimer = null;
    }
    const bodyEl = document.getElementById("letter-typed-body");
    const skipBtn = document.getElementById("btn-skip-typing");
    const paragraphs = (CFG.scene4 && Array.isArray(CFG.scene4.paragraphs)) ? CFG.scene4.paragraphs : [];

    if (!bodyEl) return;
    bodyEl.innerHTML = "";

    paragraphs.forEach((text, idx) => {
      const p = document.createElement("p");
      p.textContent = text;
      if (idx === paragraphs.length - 1) {
        const cursorSpan = document.createElement("span");
        cursorSpan.className = "typewriter-cursor";
        cursorSpan.textContent = "|";
        p.appendChild(cursorSpan);
      }
      bodyEl.appendChild(p);
    });

    isLetterTyped = true;
    if (skipBtn) skipBtn.classList.add("is-done");
  }

  // ==========================================================================
  // 7. SCENE 6: CUSTOM PORTRAIT VIDEO PLAYER + AUTO-PAUSE BGM
  // ==========================================================================
  function initVideoPlayer() {
    const videoEl = document.getElementById("memory-video");
    const frameCard = document.getElementById("video-frame-card");
    const placeholderState = document.getElementById("video-placeholder-state");
    const centerPlayBtn = document.getElementById("video-center-play");
    const barToggleBtn = document.getElementById("video-bar-toggle");
    const timeLabel = document.getElementById("video-time-label");
    const seekSlider = document.getElementById("video-seek-slider");
    const playlistTabs = document.getElementById("video-playlist-tabs");

    if (!videoEl || !CFG.scene6) return;

    if (frameCard) {
      const isLandscape = CFG.scene6.orientation === "landscape";
      frameCard.classList.toggle("is-landscape", isLandscape);
      frameCard.classList.toggle("is-portrait", !isLandscape);
    }

    const videosList = Array.isArray(CFG.scene6.videos) && CFG.scene6.videos.length > 0
      ? CFG.scene6.videos
      : (CFG.scene6.videoSrc ? [{ title: "Video 1", src: CFG.scene6.videoSrc }] : []);

    let activeVideoIdx = 0;

    function loadVideoAtIndex(index, autoPlayAfterLoad) {
      activeVideoIdx = index;
      pauseVideoPlayback(false);
      if (seekSlider) seekSlider.value = "0";

      if (playlistTabs) {
        const buttons = playlistTabs.querySelectorAll(".video-tab-btn");
        buttons.forEach((btn, bIdx) => {
          const isCurrent = bIdx === index;
          btn.classList.toggle("is-active", isCurrent);
          btn.setAttribute("aria-selected", isCurrent ? "true" : "false");
        });
      }

      const item = videosList[index];
      const src = item && item.src ? item.src.trim() : "";

      if (!src) {
        isVideoFileMissing = true;
        if (placeholderState) placeholderState.hidden = false;
        updateVideoTimeUI(0, simVideoDuration);
      } else {
        isVideoFileMissing = false;
        if (placeholderState) placeholderState.hidden = true;
        videoEl.src = src;
        videoEl.load();
        if (autoPlayAfterLoad) {
          videoEl.play().catch(() => {});
        }
      }
    }

    if (playlistTabs) {
      playlistTabs.innerHTML = "";
      if (videosList.length > 1) {
        videosList.forEach((vItem, idx) => {
          const tabBtn = document.createElement("button");
          tabBtn.type = "button";
          tabBtn.role = "tab";
          tabBtn.className = "video-tab-btn" + (idx === 0 ? " is-active" : "");
          tabBtn.setAttribute("aria-selected", idx === 0 ? "true" : "false");
          tabBtn.textContent = vItem.title || "Video " + (idx + 1);
          tabBtn.addEventListener("click", () => {
            if (activeVideoIdx !== idx) {
              loadVideoAtIndex(idx, true);
            }
          });
          playlistTabs.appendChild(tabBtn);
        });
      }
    }

    loadVideoAtIndex(0, false);

    videoEl.addEventListener("error", () => {
      isVideoFileMissing = true;
      if (placeholderState) placeholderState.hidden = false;
      updateVideoTimeUI(0, simVideoDuration);
    });

    let isUserSeekingVideo = false;

    videoEl.addEventListener("loadedmetadata", () => {
      isVideoFileMissing = false;
      if (placeholderState) placeholderState.hidden = true;
      updateVideoTimeUI(0, videoEl.duration || 10);
    });

    videoEl.addEventListener("timeupdate", () => {
      if (isVideoFileMissing || isUserSeekingVideo) return;
      const dur = videoEl.duration || 10;
      updateVideoTimeUI(videoEl.currentTime, dur);
      if (seekSlider && dur > 0) {
        seekSlider.value = String((videoEl.currentTime / dur) * 100);
      }
    });

    videoEl.addEventListener("play", () => {
      handleVideoStarted();
    });

    videoEl.addEventListener("pause", () => {
      handleVideoPausedOrEnded();
    });

    videoEl.addEventListener("ended", () => {
      if (videosList.length > 1 && activeVideoIdx < videosList.length - 1) {
        loadVideoAtIndex(activeVideoIdx + 1, true);
      } else {
        handleVideoPausedOrEnded();
      }
    });

    function togglePlayPause() {
      if (isVideoFileMissing) {
        toggleSimulatedVideo();
        return;
      }
      if (videoEl.paused || videoEl.ended) {
        videoEl.play().catch(() => {
          isVideoFileMissing = true;
          if (placeholderState) placeholderState.hidden = false;
          toggleSimulatedVideo();
        });
      } else {
        videoEl.pause();
      }
    }

    if (centerPlayBtn) centerPlayBtn.addEventListener("click", togglePlayPause);
    if (barToggleBtn) barToggleBtn.addEventListener("click", togglePlayPause);
    videoEl.addEventListener("click", togglePlayPause);

    if (seekSlider) {
      const startSeek = () => {
        isUserSeekingVideo = true;
      };
      const applySeek = () => {
        const pct = Number(seekSlider.value) / 100;
        if (isVideoFileMissing) {
          simVideoTime = pct * simVideoDuration;
          updateVideoTimeUI(simVideoTime, simVideoDuration);
        } else if (Number.isFinite(videoEl.duration) && videoEl.duration > 0) {
          const targetTime = pct * videoEl.duration;
          videoEl.currentTime = targetTime;
          updateVideoTimeUI(targetTime, videoEl.duration);
        }
      };
      const endSeek = () => {
        applySeek();
        isUserSeekingVideo = false;
      };

      seekSlider.addEventListener("pointerdown", startSeek);
      seekSlider.addEventListener("touchstart", startSeek, { passive: true });
      seekSlider.addEventListener("input", applySeek);
      seekSlider.addEventListener("change", endSeek);
      seekSlider.addEventListener("pointerup", endSeek);
      seekSlider.addEventListener("touchend", endSeek);
    }

    const fullscreenBtn = document.getElementById("video-fullscreen-btn");
    const fullscreenIcon = document.getElementById("video-fullscreen-icon");

    function updateFullscreenIcon(isFull) {
      if (!fullscreenIcon) return;
      fullscreenIcon.innerHTML = isFull
        ? '<path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>'
        : '<path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>';
    }

    function isCurrentlyFullscreen() {
      return Boolean(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        (frameCard && frameCard.classList.contains("is-pseudo-fullscreen"))
      );
    }

    if (fullscreenBtn && frameCard) {
      fullscreenBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (isCurrentlyFullscreen()) {
          if (document.exitFullscreen && document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
          } else if (document.webkitExitFullscreen && document.webkitFullscreenElement) {
            document.webkitExitFullscreen();
          }
          frameCard.classList.remove("is-pseudo-fullscreen");
          updateFullscreenIcon(false);
          return;
        }

        // Request fullscreen on frameCard so custom controls + slider remain accessible
        const reqFn = frameCard.requestFullscreen || frameCard.webkitRequestFullscreen;
        if (reqFn) {
          Promise.resolve(reqFn.call(frameCard))
            .then(() => {
              updateFullscreenIcon(true);
            })
            .catch(() => {
              frameCard.classList.add("is-pseudo-fullscreen");
              updateFullscreenIcon(true);
            });
        } else {
          frameCard.classList.add("is-pseudo-fullscreen");
          updateFullscreenIcon(true);
        }
      });

      document.addEventListener("fullscreenchange", () => {
        const active = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
        if (!active) {
          frameCard.classList.remove("is-pseudo-fullscreen");
        }
        updateFullscreenIcon(active);
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && frameCard.classList.contains("is-pseudo-fullscreen")) {
          frameCard.classList.remove("is-pseudo-fullscreen");
          updateFullscreenIcon(false);
        }
      });
    }

    function updateVideoTimeUI(current, total) {
      if (!timeLabel) return;
      timeLabel.textContent = formatTime(current) + " / " + formatTime(total);
    }
  }

  function toggleSimulatedVideo() {
    const seekSlider = document.getElementById("video-seek-slider");
    const timeLabel = document.getElementById("video-time-label");

    if (simVideoPlaying) {
      pauseVideoPlayback(true);
      return;
    }

    simVideoPlaying = true;
    handleVideoStarted();

    if (simVideoTime >= simVideoDuration) {
      simVideoTime = 0;
    }

    simVideoTimer = setInterval(() => {
      simVideoTime = Math.min(simVideoDuration, simVideoTime + 0.2);
      if (timeLabel) {
        timeLabel.textContent = formatTime(simVideoTime) + " / " + formatTime(simVideoDuration);
      }
      if (seekSlider) {
        seekSlider.value = String((simVideoTime / simVideoDuration) * 100);
      }
      if (simVideoTime >= simVideoDuration) {
        pauseVideoPlayback(true);
      }
    }, 200);
  }

  function handleVideoStarted() {
    updateVideoButtonsUI(true);
    // Auto-pause BGM while video is playing
    if (bgmIsPlaying) {
      bgmWasPlayingBeforeVideo = true;
      pauseBgmPlayback();
    }
  }

  function handleVideoPausedOrEnded() {
    updateVideoButtonsUI(false);
    // Resume BGM automatically when video stops or finishes
    if (bgmWasPlayingBeforeVideo) {
      bgmWasPlayingBeforeVideo = false;
      startBgmPlayback();
    }
  }

  function pauseVideoPlayback(resumeBgm) {
    const videoEl = document.getElementById("memory-video");
    if (videoEl && !videoEl.paused && !isVideoFileMissing) {
      videoEl.pause();
    }
    if (simVideoTimer) {
      clearInterval(simVideoTimer);
      simVideoTimer = null;
    }
    simVideoPlaying = false;
    updateVideoButtonsUI(false);

    if (resumeBgm && bgmWasPlayingBeforeVideo) {
      bgmWasPlayingBeforeVideo = false;
      startBgmPlayback();
    }
  }

  function updateVideoButtonsUI(playing) {
    const centerPlayBtn = document.getElementById("video-center-play");
    const barIcon = document.getElementById("video-bar-icon");

    if (centerPlayBtn) {
      centerPlayBtn.classList.toggle("is-playing", playing);
    }
    if (barIcon) {
      barIcon.innerHTML = playing
        ? '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>'
        : '<path d="M8 5v14l11-7z"/>';
    }
  }

  function formatTime(seconds) {
    const s = Math.max(0, Math.floor(seconds || 0));
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return mins + ":" + String(secs).padStart(2, "0");
  }

  // ==========================================================================
  // 8. SCENE 8: ROTATING CLOSING TYPEWRITER
  // ==========================================================================
  function startClosingTypewriter() {
    const targetEl = document.getElementById("s8-rotating-text");
    if (!targetEl || !CFG.scene8) return;

    if (closingTypeTimer) {
      clearTimeout(closingTypeTimer);
    }

    const phrases = Array.isArray(CFG.scene8.rotatingTitles) && CFG.scene8.rotatingTitles.length > 0
      ? CFG.scene8.rotatingTitles
      : ["Happy Birthday", "With All My Love", "Always & Forever"];

    let phraseIdx = 0;
    let charIdx = phrases[0].length;
    let isDeleting = false;
    targetEl.textContent = phrases[0];

    function step() {
      const currentPhrase = phrases[phraseIdx];

      if (!isDeleting) {
        charIdx++;
        targetEl.textContent = currentPhrase.slice(0, charIdx);
        if (charIdx >= currentPhrase.length) {
          isDeleting = true;
          closingTypeTimer = setTimeout(step, 1850);
          return;
        }
        closingTypeTimer = setTimeout(step, 85);
      } else {
        charIdx--;
        targetEl.textContent = currentPhrase.slice(0, charIdx);
        if (charIdx <= 0) {
          isDeleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          closingTypeTimer = setTimeout(step, 320);
          return;
        }
        closingTypeTimer = setTimeout(step, 45);
      }
    }

    closingTypeTimer = setTimeout(() => {
      isDeleting = true;
      step();
    }, 1700);
  }

  function resetExperienceAndReplay() {
    isLetterTyped = false;
    if (letterTypingTimer) {
      clearTimeout(letterTypingTimer);
      letterTypingTimer = null;
    }
    // Saat Replay diklik setelah kado pernah dibuka, langsung masuk ke Scene 2 (Kotak Kado)
    // supaya tidak perlu menunggu countdown ulang.
    goToScene(2);
  }

  // ==========================================================================
  // 9. GLOBAL BACKGROUND MUSIC CONTROLLER (WITH SOFT SYNTH FALLBACK)
  // ==========================================================================
  function initMusicController() {
    const audioEl = document.getElementById("bgm-audio");
    const toggleBtn = document.getElementById("bgm-toggle-btn");

    if (audioEl && CFG.music) {
      const configuredMusicSrc = (CFG.music.src || "").trim();
      if (!configuredMusicSrc) {
        usingFallbackSynth = true;
      } else {
        audioEl.src = configuredMusicSrc;
        audioEl.volume = typeof CFG.music.volume === "number" ? CFG.music.volume : 0.65;
        audioEl.addEventListener("error", () => {
          usingFallbackSynth = true;
        });
      }
    }

    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        if (bgmIsPlaying) {
          bgmWasPlayingBeforeVideo = false;
          pauseBgmPlayback();
        } else {
          startBgmPlayback();
        }
      });
    }
  }

  function startBgmPlayback() {
    const audioEl = document.getElementById("bgm-audio");
    if (audioEl && !usingFallbackSynth) {
      audioEl.play().then(() => {
        bgmIsPlaying = true;
        updateMusicDockUI(true);
      }).catch(() => {
        usingFallbackSynth = true;
        startFallbackMusicBox();
      });
    } else {
      startFallbackMusicBox();
    }
  }

  function pauseBgmPlayback() {
    const audioEl = document.getElementById("bgm-audio");
    if (audioEl && !audioEl.paused) {
      audioEl.pause();
    }
    stopFallbackMusicBox();
    bgmIsPlaying = false;
    updateMusicDockUI(false);
  }

  function updateMusicDockUI(playing) {
    const toggleBtn = document.getElementById("bgm-toggle-btn");
    const statusText = document.getElementById("bgm-status-text");
    if (toggleBtn) {
      toggleBtn.setAttribute("aria-pressed", playing ? "true" : "false");
    }
    if (statusText) {
      statusText.textContent = playing ? "Playing" : "Paused";
    }
  }

  // Gentle Music-Box Arpeggio Fallback (Canon/Beautiful In White progression) when bgm.mp3 is not yet placed
  function startFallbackMusicBox() {
    stopFallbackMusicBox();
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      bgmIsPlaying = true;
      updateMusicDockUI(true);
      return;
    }

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const notes = [261.63, 329.63, 392.00, 523.25, 493.88, 392.00, 329.63, 440.00, 349.23, 293.66, 392.00, 493.88];
    let stepIndex = 0;

    function playChime() {
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(notes[stepIndex % notes.length], now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.045, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 1.45);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 1.5);
      stepIndex++;
    }

    playChime();
    synthIntervalId = setInterval(playChime, 680);
    bgmIsPlaying = true;
    updateMusicDockUI(true);
  }

  function stopFallbackMusicBox() {
    if (synthIntervalId) {
      clearInterval(synthIntervalId);
      synthIntervalId = null;
    }
  }

  // ==========================================================================
  // 10. AMBIENT STARFIELD, HEART BOKEH & GIFT CONFETTI CANVAS
  // ==========================================================================
  function initAmbientCanvas() {
    if (!canvas || !ctx) return;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Populate subtle stars
    const starCount = Math.min(70, Math.floor((window.innerWidth * window.innerHeight) / 14000));
    stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.5,
      alpha: Math.random() * 0.65 + 0.2,
      speedY: -(Math.random() * 0.18 + 0.05),
      twinkleSpeed: Math.random() * 0.02 + 0.005
    }));

    // Populate soft out-of-focus heart bokehs for Scene 3
    heartBokehs = Array.from({ length: 16 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 34 + 18,
      alpha: Math.random() * 0.16 + 0.05,
      vy: -(Math.random() * 0.35 + 0.12),
      vx: (Math.random() - 0.5) * 0.25
    }));

    function renderLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.y += s.speedY;
        s.alpha += s.twinkleSpeed;
        if (s.alpha > 0.85 || s.alpha < 0.18) {
          s.twinkleSpeed = -s.twinkleSpeed;
        }
        if (s.y < -5) {
          s.y = canvas.height + 5;
          s.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(249, 238, 242, " + s.alpha.toFixed(2) + ")";
        ctx.fill();
      }

      // Draw Soft Heart Bokeh when on Scene 3
      if (ambientMode === "hearts") {
        for (let i = 0; i < heartBokehs.length; i++) {
          const h = heartBokehs[i];
          h.y += h.vy;
          h.x += h.vx;
          if (h.y < -60) {
            h.y = canvas.height + 50;
            h.x = Math.random() * canvas.width;
          }
          drawSoftHeart(ctx, h.x, h.y, h.size, h.alpha);
        }
      }

      // Draw Gift Burst Particles (Scene 2)
      for (let i = burstParticles.length - 1; i >= 0; i--) {
        const p = burstParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12; // gravity
        p.alpha -= 0.014;
        if (p.alpha <= 0) {
          burstParticles.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      requestAnimationFrame(renderLoop);
    }

    requestAnimationFrame(renderLoop);
  }

  function drawSoftHeart(context, cx, cy, size, alpha) {
    context.save();
    context.translate(cx, cy);
    context.fillStyle = "rgba(232, 122, 159, " + alpha.toFixed(3) + ")";
    context.beginPath();
    const topCurveHeight = size * 0.3;
    context.moveTo(0, topCurveHeight);
    context.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
    context.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 1.4, 0, size);
    context.bezierCurveTo(0, (size + topCurveHeight) / 1.4, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
    context.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
    context.closePath();
    context.fill();
    context.restore();
  }

  function spawnConfettiBurst() {
    if (!canvas) return;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const colors = ["#e87a9f", "#f9eef2", "#f2d5df", "#d47294"];

    for (let i = 0; i < 42; i++) {
      const angle = (Math.PI * 2 * i) / 42 + (Math.random() - 0.5) * 0.3;
      const speed = Math.random() * 6 + 2.5;
      burstParticles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.2,
        size: Math.random() * 3.5 + 2,
        alpha: 1,
        color: colors[i % colors.length]
      });
    }
  }

  document.addEventListener("DOMContentLoaded", initApp);
})();
