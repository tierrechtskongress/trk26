(() => {
  const body = document.body;
  const stickyNav = document.querySelector(".site-sticky-nav");
  const jumpNavLinks = Array.from(document.querySelectorAll('.site-sticky-nav .hero-jumpnav a[href^="#"]'));
  const anchorLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.addEventListener("load", () => {
    window.setTimeout(() => {
      body.classList.remove("is-preload");
    }, 100);

    if (window.location.hash) {
      window.setTimeout(() => {
        scrollToHash(window.location.hash, "auto");
      }, 0);
    }
  });

  function getScrollOffset() {
    return stickyNav ? stickyNav.offsetHeight + 24 : 24;
  }

  function smoothScrollTo(targetY, duration) {
    const startY = window.scrollY;
    const diff = targetY - startY;
    let startTime = null;

    function step(time) {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const t = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      window.scrollTo(0, startY + diff * ease);
      if (t < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function scrollToHash(hash, behavior = prefersReducedMotion ? "auto" : "smooth") {
    if (!hash || hash === "#") {
      return false;
    }

    const target = document.querySelector(hash);

    if (!target) {
      return false;
    }

    const top = Math.max(window.scrollY + target.getBoundingClientRect().top - getScrollOffset(), 0);

    if (behavior === "auto" || prefersReducedMotion) {
      window.scrollTo({ top, behavior: "auto" });
    } else {
      smoothScrollTo(top, 400);
    }

    return true;
  }

  let scheduleActiveLinkUpdate = () => {};

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetHash = link.getAttribute("href");

      if (!targetHash || targetHash.charAt(0) !== "#") {
        return;
      }

      if (!document.querySelector(targetHash)) {
        return;
      }

      event.preventDefault();

      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, document.title, targetHash);
      } else {
        window.location.hash = targetHash;
      }

      if (jumpNavLinks.includes(link)) {
        handleJumpNavClick(targetHash);
      }

      scrollToHash(targetHash);
    });
  });

  if (!stickyNav || jumpNavLinks.length === 0) {
    return;
  }

  const sections = jumpNavLinks
    .map((link) => {
      const id = link.getAttribute("href");
      const section = id ? document.querySelector(id) : null;

      if (!section) {
        return null;
      }

      return {
        id,
        link,
        section
      };
    })
    .filter(Boolean);

  if (sections.length === 0) {
    return;
  }

  let activeId = null;
  let pendingId = null;
  let activeLinkTimeout = null;
  let scrollLockUntil = 0;

  function setActiveLink(id) {
    activeId = id;
    jumpNavLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === id);
    });
  }

  function getCurrentSectionId() {
    const marker = window.scrollY + stickyNav.offsetHeight + 28;
    let currentId = sections[0].id;

    sections.forEach((item) => {
      if (item.section.offsetTop <= marker) {
        currentId = item.id;
      }
    });

    return currentId;
  }

  scheduleActiveLinkUpdate = () => {
    if (Date.now() < scrollLockUntil) {
      return;
    }

    const nextId = getCurrentSectionId();

    if (nextId === activeId) {
      pendingId = null;
      if (activeLinkTimeout) {
        window.clearTimeout(activeLinkTimeout);
        activeLinkTimeout = null;
      }
      return;
    }

    if (pendingId === nextId && activeLinkTimeout) {
      return;
    }

    pendingId = nextId;

    if (activeLinkTimeout) {
      window.clearTimeout(activeLinkTimeout);
    }

    activeLinkTimeout = window.setTimeout(() => {
      setActiveLink(nextId);
      pendingId = null;
      activeLinkTimeout = null;
    }, 120);
  };

  function handleJumpNavClick(targetHash) {
    if (activeLinkTimeout) {
      window.clearTimeout(activeLinkTimeout);
      activeLinkTimeout = null;
    }

    scrollLockUntil = Date.now() + 450;
    pendingId = null;
    setActiveLink(targetHash);
    window.setTimeout(scheduleActiveLinkUpdate, 470);
  }

  setActiveLink(getCurrentSectionId());
  window.addEventListener("scroll", scheduleActiveLinkUpdate, { passive: true });
  window.addEventListener("resize", scheduleActiveLinkUpdate);
  window.addEventListener("load", scheduleActiveLinkUpdate);
})();
