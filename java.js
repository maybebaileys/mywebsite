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

  // ===== Slideshow Navigation =====
  document.querySelectorAll(".slideshow").forEach(slideshow => {
    const slides = slideshow.querySelectorAll(".slideshow_container img");
    const prevBtn = slideshow.querySelector(".prev-slide");
    const nextBtn = slideshow.querySelector(".next-slide");
    const arrowIcons = slideshow.querySelectorAll(".arrow-icon");
    let index = 0;

      function showSlide(newIndex, direction = 1) {
    slides.forEach((img, i) => {
      img.classList.remove("active", "slide-left");

      if (i === index) {
        // old slide leaving
        img.classList.add(direction === 1 ? "slide-left" : "slide-right");
      }
      if (i === newIndex) {
        // new slide entering
        img.classList.add("active");
      }
    });
    index = newIndex;
  }

  prevBtn?.addEventListener("click", e => {
    e.preventDefault();
    const newIndex = (index - 1 + slides.length) % slides.length;
    showSlide(newIndex, -1);
  });

  nextBtn?.addEventListener("click", e => {
    e.preventDefault();
    const newIndex = (index + 1) % slides.length;
    showSlide(newIndex, 1);
  });

    function getImageBrightness(img) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Prevent error if image not fully loaded
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      if (width === 0 || height === 0) return 255; // Assume white (light)

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let total = 0;
      for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        total += brightness;
      }
      return total / (imageData.data.length / 4);
    }

    function updateArrowColor(currentImg) {
      if (!currentImg.complete) {
        currentImg.onload = () => updateArrowColor(currentImg);
        return;
      }

      const brightness = getImageBrightness(currentImg);
      const color = brightness < 128 ? "white" : "black";
      arrowIcons.forEach(icon => {
        icon.style.color = color;
      });
    }

    function showSlide(i) {
      slides.forEach((img, j) => {
        img.classList.toggle("active", j === i);
        img.style.zIndex = j === i ? 1 : 0;
      });
      updateArrowColor(slides[i]);
    }

    prevBtn?.addEventListener("click", e => {
      e.preventDefault();
      index = (index - 1 + slides.length) % slides.length;
      showSlide(index);
    });

    nextBtn?.addEventListener("click", e => {
      e.preventDefault();
      index = (index + 1) % slides.length;
      showSlide(index);
    });

    // Initial show
    showSlide(index);
  });


  // ===== Floating Preview on Hover =====
  const previewBox = document.getElementById("projectPreview");
  const items = document.querySelectorAll(".projectlist-item");

  if (previewBox) {
    items.forEach(item => {
      item.addEventListener("mouseenter", e => {
        const img = item.getAttribute("data-img");
        if (img) {
          previewBox.style.backgroundImage = `url(${img})`;
          previewBox.style.opacity = 1;
        }
      });

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
