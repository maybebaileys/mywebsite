// File: java.js

document.addEventListener("DOMContentLoaded", () => {
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
        img.classList.toggle("active", j === i);
      });
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

window.addEventListener('load', () => {
  const text = document.querySelector('.project-text');
  if (text) {
    text.style.transition = 'none';
    requestAnimationFrame(() => {
      text.style.transition = '';
    });
  }
});


});