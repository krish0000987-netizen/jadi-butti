/* ==========================================================================
   UNANI WARSI DAWAKHANA - MAIN INTERACTIVE JAVASCRIPT
   Jadi-Buti & Unani Herbal Work | Phone: 9045678507
   Touch Optimized, Mobile-First Support
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Progress Indicator
  const scrollProgress = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    if (scrollProgress) {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      scrollProgress.style.width = scrolled + '%';
    }
  }, { passive: true });

  // 2. Sticky Header Shadow on Scroll
  const header = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // 3. Mobile Navigation Drawer
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileOverlay = document.getElementById('mobile-drawer-overlay');
  const mobileCloseBtn = document.getElementById('mobile-close-btn');
  const mobileLinks = document.querySelectorAll('.mobile-menu-links a');

  function openDrawer() {
    if (mobileDrawer && mobileOverlay) {
      mobileDrawer.classList.add('active');
      mobileOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (mobileDrawer && mobileOverlay) {
      mobileDrawer.classList.remove('active');
      mobileOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeDrawer);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeLightbox();
      closeArticleModal();
    }
  });

  // 4. Hero Slideshow (Homepage - 3 Second Auto Interval + Touch Swipe)
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.getElementById('hero-prev-btn');
  const nextBtn = document.getElementById('hero-next-btn');
  const heroContainer = document.querySelector('.hero-slider-section');

  if (heroSlides.length > 0) {
    let currentSlide = 0;
    const slideCount = heroSlides.length;
    let slideInterval = null;
    const INTERVAL_TIME = 3000; // 3 seconds requirement

    function showSlide(index) {
      heroSlides.forEach((slide, idx) => {
        slide.classList.remove('active');
        if (heroDots[idx]) heroDots[idx].classList.remove('active');
      });

      currentSlide = (index + slideCount) % slideCount;
      heroSlides[currentSlide].classList.add('active');
      if (heroDots[currentSlide]) heroDots[currentSlide].classList.add('active');
    }

    function nextSlide() {
      showSlide(currentSlide + 1);
    }

    function prevSlide() {
      showSlide(currentSlide - 1);
    }

    function startSlideTimer() {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, INTERVAL_TIME);
    }

    function resetSlideTimer() {
      clearInterval(slideInterval);
      startSlideTimer();
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetSlideTimer(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetSlideTimer(); });

    heroDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showSlide(idx);
        resetSlideTimer();
      });
    });

    if (heroContainer) {
      heroContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
      heroContainer.addEventListener('mouseleave', () => startSlideTimer());

      // Touch swipe support for mobile
      let touchStartX = 0;
      let touchEndX = 0;

      heroContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(slideInterval);
      }, { passive: true });

      heroContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diffX = touchStartX - touchEndX;
        if (Math.abs(diffX) > 45) {
          if (diffX > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
        }
        startSlideTimer();
      }, { passive: true });
    }

    // Initialize first slide and start auto rotation
    showSlide(0);
    startSlideTimer();
  }

  // 5. Scroll Reveal Animations (IntersectionObserver)
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }

  // 6. Gallery Filtering & Interactive Lightbox
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentGalleryList = [];
  let currentLightboxIdx = 0;

  function updateGalleryList() {
    currentGalleryList = Array.from(galleryItems).filter(item => item.style.display !== 'none');
  }

  if (filterBtns.length > 0 && galleryItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterVal = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
          const itemCat = item.getAttribute('data-category');
          if (filterVal === 'all' || itemCat === filterVal) {
            item.style.display = 'block';
            setTimeout(() => item.classList.add('reveal', 'active'), 50);
          } else {
            item.style.display = 'none';
          }
        });

        updateGalleryList();
      });
    });

    updateGalleryList();
  }

  function openLightbox(index) {
    if (!lightboxModal || currentGalleryList.length === 0) return;
    currentLightboxIdx = (index + currentGalleryList.length) % currentGalleryList.length;
    const targetItem = currentGalleryList[currentLightboxIdx];
    const imgEl = targetItem.querySelector('img');
    const titleEl = targetItem.querySelector('.gallery-item-title');
    const catEl = targetItem.querySelector('.gallery-item-cat');

    if (imgEl && lightboxImg) {
      lightboxImg.src = imgEl.src;
      lightboxImg.alt = imgEl.alt;
    }
    if (titleEl && lightboxTitle) lightboxTitle.textContent = titleEl.textContent;
    if (catEl && lightboxCategory) lightboxCategory.textContent = catEl.textContent;

    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      updateGalleryList();
      const targetIndex = currentGalleryList.indexOf(item);
      if (targetIndex !== -1) {
        openLightbox(targetIndex);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => openLightbox(currentLightboxIdx - 1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => openLightbox(currentLightboxIdx + 1));

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });

    // Mobile touch swipe in lightbox
    let lbTouchStartX = 0;
    let lbTouchEndX = 0;
    lightboxModal.addEventListener('touchstart', (e) => {
      lbTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
      lbTouchEndX = e.changedTouches[0].screenX;
      const diffX = lbTouchStartX - lbTouchEndX;
      if (Math.abs(diffX) > 40) {
        if (diffX > 0) openLightbox(currentLightboxIdx + 1);
        else openLightbox(currentLightboxIdx - 1);
      }
    }, { passive: true });
  }

  document.addEventListener('keydown', (e) => {
    if (lightboxModal && lightboxModal.classList.contains('active')) {
      if (e.key === 'ArrowLeft') openLightbox(currentLightboxIdx - 1);
      if (e.key === 'ArrowRight') openLightbox(currentLightboxIdx + 1);
    }
  });

  // 7. Article / Blog Knowledge Modal Reader
  const articleModal = document.getElementById('article-modal');
  const articleModalClose = document.getElementById('article-modal-close');
  const articleModalTitle = document.getElementById('article-modal-title');
  const articleModalMeta = document.getElementById('article-modal-meta');
  const articleModalContent = document.getElementById('article-modal-content');
  const readArticleBtns = document.querySelectorAll('.blog-read-more');

  function openArticleModal(title, meta, fullHtml) {
    if (!articleModal) return;
    if (articleModalTitle) articleModalTitle.textContent = title;
    if (articleModalMeta) articleModalMeta.textContent = meta;
    if (articleModalContent) articleModalContent.innerHTML = fullHtml;
    articleModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeArticleModal() {
    if (articleModal) {
      articleModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (articleModalClose) articleModalClose.addEventListener('click', closeArticleModal);
  if (articleModal) {
    articleModal.addEventListener('click', (e) => {
      if (e.target === articleModal) closeArticleModal();
    });
  }

  readArticleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.blog-card');
      if (card) {
        const title = card.querySelector('.blog-card-title')?.textContent || 'Article';
        const meta = card.querySelector('.blog-date')?.textContent || 'Traditional Knowledge';
        const fullContentEl = card.querySelector('.blog-full-content');
        const fullHtml = fullContentEl ? fullContentEl.innerHTML : card.querySelector('.blog-card-excerpt')?.innerHTML;
        openArticleModal(title, meta, fullHtml);
      }
    });
  });

  // 8. Contact Form Handling
  const contactForm = document.getElementById('dawakhana-contact-form');
  const formToast = document.getElementById('form-feedback-toast');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name')?.value.trim();
      const phone = document.getElementById('contact-phone')?.value.trim();

      if (!name || !phone) {
        alert('Please provide your name and contact phone number.');
        return;
      }

      // Show toast
      if (formToast) {
        formToast.classList.add('active');
        setTimeout(() => {
          formToast.classList.remove('active');
        }, 5000);
      }

      contactForm.reset();
    });
  }
});
