document.addEventListener("DOMContentLoaded", () => {
  // ===== Scroll Fade-In =====
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".project-media, .commission-media, [data-animate]").forEach(el => {
    observer.observe(el);
  });
  
  // ===== Floating Preview on Hover =====
  const previewBox = document.getElementById("projectPreview");
  const items = document.querySelectorAll(".projectlist-item");

  if (previewBox) {
    items.forEach(item => {
  item.addEventListener("mouseenter", e => {
    const img = item.getAttribute("data-img");
    const customWidth = item.getAttribute("data-width") || "540px"; // Default width
    const customHeight = item.getAttribute("data-height") || "320px"; // Default height

    if (img) {
      previewBox.style.backgroundImage = `url(${img})`;
      previewBox.style.width = customWidth;   /* Apply custom width */
      previewBox.style.height = customHeight; /* Apply custom height */
      previewBox.style.opacity = 1;
    }
  });
  // ... rest of your mousemove and mouseleave code

      item.addEventListener("mousemove", e => {
        const offsetX = 20;
        const offsetY = 20;
        let x = e.clientX + offsetX;
        let y = e.clientY + offsetY;

        const previewWidth = previewBox.offsetWidth;
        const previewHeight = previewBox.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        if (x + previewWidth > windowWidth) {
          x = e.clientX - previewWidth - offsetX;
        }
        if (y + previewHeight > windowHeight) {
          y = e.clientY - previewHeight - offsetY;
        }

        previewBox.style.left = `${x}px`;
        previewBox.style.top = `${y}px`;
      });

      item.addEventListener("mouseleave", () => {
        previewBox.style.opacity = 0;
        previewBox.style.backgroundImage = "none";
      });
    });
  }

  // ===== Random Positioning =====
  const container = document.querySelector(".projectlist-items");
  if (container) {
    const projectItems = document.querySelectorAll(".projectlist-item");
    const placed = [];
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    function doesOverlap(a, b) {
      return !(
        a.x + a.width < b.x ||
        a.x > b.x + b.width ||
        a.y + a.height < b.y ||
        a.y > b.y + b.height
      );
    }

    projectItems.forEach(item => {
      const itemWidth = item.offsetWidth;
      const itemHeight = item.offsetHeight;

      let tries = 0;
      let maxTries = 100;
      let position;

      do {
        const x = Math.floor(Math.random() * (containerWidth - itemWidth));
        const y = Math.floor(Math.random() * (containerHeight - itemHeight));
        position = { x, y, width: itemWidth, height: itemHeight };
        tries++;
      } while (
        placed.some(other => doesOverlap(position, other)) &&
        tries < maxTries
      );

      item.style.position = "absolute";
      item.style.left = `${position.x}px`;
      item.style.top = `${position.y}px`;
      placed.push(position);
    });
  }

  // ===== Mobile Slideshow =====
  const mobileSlides = document.querySelectorAll('.mobile-slideshow .slide');
  if (mobileSlides.length > 0) {
    let current = 0;

    function showNextSlide() {
      mobileSlides[current].classList.remove('active');
      current = (current + 1) % mobileSlides.length;
      mobileSlides[current].classList.add('active');
    }

    setInterval(showNextSlide, 3000);
  }

// ===== Hamburger Nav =====
const hamburger = document.querySelector(".hamburger");
const mobileNav = document.querySelector(".mobile-nav");

hamburger?.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("open");
  
  // Toggle the icon between hamburger and X
  if (isOpen) {
    hamburger.innerHTML = '<svg viewBox="0 0 40 40" width="28" height="28"><line x1="5" y1="5" x2="35" y2="35" stroke="currentColor" stroke-width="1.5"/><line x1="35" y1="5" x2="5" y2="35" stroke="currentColor" stroke-width="1.5"/></svg>';
  } else {
    hamburger.innerHTML = "&#9776;"; 
  }

  hamburger.setAttribute("aria-expanded", isOpen);
});
});

// lightbox
const setupLightbox = () => {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  const lbImg = document.getElementById("lb-img");
  const lbCaption = document.getElementById("lb-caption");
  
  // This selector finds images in both your standard grid and commission grid
  const images = Array.from(document.querySelectorAll(".grid img, .commission-media img"));
  let currentIndex = 0;

  images.forEach((img, index) => {
   img.style.cursor = "pointer";
   img.addEventListener("click", (e) => {
      // 2. ADD THIS CHECK: Only run if screen is wider than 768px
      if (window.innerWidth > 768) {
        e.stopPropagation();
        currentIndex = index;
        updateLightbox();
        lightbox.style.display = "flex";
        document.body.style.overflow = "hidden";
      } else {
        // On mobile, this 'return' stops the lightbox from opening
        return;
      }
    });
  });

  function updateLightbox() {
    const currentImg = images[currentIndex];
    lbImg.src = currentImg.src;
    
    // Check for figcaption (Drawing/Painting) or Alt text (Commissions)
    const captionText = currentImg.parentElement.querySelector("figcaption")?.innerText 
                        || currentImg.alt 
                        || "";
    lbCaption.innerText = captionText;
  }

  const closeLightbox = () => {
    lightbox.style.display = "none";
    document.body.style.overflow = "auto";
  };

  document.getElementById("lb-next").onclick = (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % images.length;
    updateLightbox();
  };

  document.getElementById("lb-prev").onclick = (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightbox();
  };

  lightbox.onclick = closeLightbox;
  document.getElementById("lb-close").onclick = closeLightbox;

  // Keyboard support
  document.addEventListener("keydown", (e) => {
    if (lightbox.style.display === "flex") {
      if (e.key === "ArrowRight") document.getElementById("lb-next").click();
      if (e.key === "ArrowLeft") document.getElementById("lb-prev").click();
      if (e.key === "Escape") closeLightbox();
    }
  });
};

setupLightbox();

// norightclick
const protectImages = () => {
  // Selects images in your main grids and the lightbox
  const siteImages = document.querySelectorAll('.grid img, .commission-media img, #lb-img');

  siteImages.forEach(img => {
    // Prevent Right-Click menu
    img.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    // Prevent dragging the image to the desktop
    img.addEventListener('dragstart', (e) => {
      e.preventDefault();
    });
  });
};

protectImages();

// ===== Commission Scroll Active State (Migrated from HTML) =====
(() => {
  const links = [...document.querySelectorAll('.commission-index-link')];
  const sections = links
    .map(link => document.getElementById(link.dataset.target))
    .filter(Boolean);

  const setActive = (id) => {
    links.forEach(link => {
      const active = link.dataset.target === id;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  const getActiveSection = () => {
    const offset = Math.min(140, window.innerHeight * 0.18);

    // At the very bottom of the page, the final commission may never reach
    // the normal activation line because there is no more content below it.
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
      return sections[sections.length - 1];
    }

    let active = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= offset) {
        active = section;
      } else {
        break;
      }
    }

    return active;
  };

  let ticking = false;
  const updateActive = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const active = getActiveSection();
        if (active) setActive(active.id);
        ticking = false;
      });
      ticking = true;
    }
  };

 // ===== Custom "Rolling" Easing Scroll =====
  const customSmoothScroll = (target, duration = 1200) => {
    const targetPosition = target.getBoundingClientRect().top + window.scrollY;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    let startTime = null;

    // Easing function (easeInOutCubic) for a smooth start, fast middle, and slow glide to a stop
    const ease = (time, start, change, duration) => {
      time /= duration / 2;
      if (time < 1) return (change / 2) * time * time * time + start;
      time -= 2;
      return (change / 2) * (time * time * time + 2) + start;
    };

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      
      if (timeElapsed < duration) {
        window.requestAnimationFrame(animation);
      } else {
        // Snap exactly to target at the end just in case of pixel rounding
        window.scrollTo(0, targetPosition); 
      }
    };

    window.requestAnimationFrame(animation);
  };

// ===== Updated Click Listener =====
  links.forEach(link => {
    link.addEventListener('click', (event) => {
      const target = document.getElementById(link.dataset.target);
      if (!target) return;

      event.preventDefault();
      
      customSmoothScroll(target, 900); 
      setActive(target.id);

      // Clean the address bar if a hash is present, without adding #commission-X
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname);
      }
    });
  });

  window.addEventListener('scroll', updateActive, { passive: true });
  window.addEventListener('resize', updateActive);

  const initialTarget = window.location.hash
    ? document.getElementById(window.location.hash.slice(1))
    : null;

  if (initialTarget) {
    window.requestAnimationFrame(() => {
      initialTarget.scrollIntoView({ behavior: 'auto', block: 'start' });
      setActive(initialTarget.id);
    });
  } else {
    updateActive();
  }
})();