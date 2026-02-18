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
    mobileNav.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", mobileNav.classList.contains("open"));
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
      e.stopPropagation();
      currentIndex = index;
      updateLightbox();
      lightbox.style.display = "flex";
      document.body.style.overflow = "hidden"; // Stop page scroll when open
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