document.addEventListener("DOMContentLoaded", () => {
  // Scroll fade-in
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

  document.querySelectorAll(".project-media, .commission-media, [data-animate]").forEach(el =>
    observer.observe(el)
  );

  // Slideshow navigation logic
  document.querySelectorAll(".slideshow").forEach(slideshow => {
    const slides = slideshow.querySelectorAll(".slideshow_container img");
    const prevBtn = slideshow.querySelector(".prev-slide");
    const nextBtn = slideshow.querySelector(".next-slide");
    let index = 0;

    const showSlide = i => {
      slides.forEach((img, j) => {
        img.classList.remove("active");
        img.style.zIndex = j === i ? 1 : 0;
      });
      slides[i].classList.add("active");
    };

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

    showSlide(index);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const previewBox = document.getElementById("projectPreview");
  const items = document.querySelectorAll(".projectlist-item");

  items.forEach(item => {
    item.addEventListener("mouseenter", (e) => {
      const img = item.getAttribute("data-img");
      previewBox.style.backgroundImage = `url(${img})`;
      previewBox.style.opacity = 1;
    });

    item.addEventListener("mousemove", (e) => {
      // Offset so the image doesn't sit directly under cursor
      const offsetX = 20;
      const offsetY = 20;

      let x = e.clientX + offsetX;
      let y = e.clientY + offsetY;

      // Prevent preview from going off right/bottom screen edges
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

      previewBox.style.left = x + "px";
      previewBox.style.top = y + "px";
    });

    item.addEventListener("mouseleave", () => {
      previewBox.style.opacity = 0;
      previewBox.style.backgroundImage = "none";
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".projectlist-items");
  const items = document.querySelectorAll(".projectlist-item");
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

  items.forEach(item => {
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

    item.style.left = `${position.x}px`;
    item.style.top = `${position.y}px`;
    placed.push(position);
  });
});

