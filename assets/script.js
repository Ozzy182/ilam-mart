(() => {

  'use strict';


  /* =========================================================
     ELEMENTS
  ========================================================= */

  const header = document.getElementById('siteHeader');

  const menuToggle = document.querySelector('.menu-toggle');

  const mobileMenu = document.getElementById('mobileMenu');

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;



  /* =========================================================
     HEADER SCROLL STATE
  ========================================================= */

  const setHeaderState = () => {

    if (!header) {
      return;
    }

    header.classList.toggle(
      'scrolled',
      window.scrollY > 40
    );

  };


  setHeaderState();


  window.addEventListener(
    'scroll',
    setHeaderState,
    {
      passive: true
    }
  );



  /* =========================================================
     MOBILE MENU
  ========================================================= */

  const closeMenu = () => {

    if (menuToggle) {

      menuToggle.setAttribute(
        'aria-expanded',
        'false'
      );

      menuToggle.setAttribute(
        'aria-label',
        'Open menu'
      );

    }


    if (mobileMenu) {

      mobileMenu.classList.remove('open');

      mobileMenu.setAttribute(
        'aria-hidden',
        'true'
      );

    }


    if (header) {
      header.classList.remove('menu-active');
    }


    document.body.classList.remove('menu-open');

  };


  const openMenu = () => {

    if (menuToggle) {

      menuToggle.setAttribute(
        'aria-expanded',
        'true'
      );

      menuToggle.setAttribute(
        'aria-label',
        'Close menu'
      );

    }


    if (mobileMenu) {

      mobileMenu.classList.add('open');

      mobileMenu.setAttribute(
        'aria-hidden',
        'false'
      );

    }


    if (header) {
      header.classList.add('menu-active');
    }


    document.body.classList.add('menu-open');

  };


  if (menuToggle) {

    menuToggle.addEventListener(
      'click',
      () => {

        const isOpen =
          menuToggle.getAttribute(
            'aria-expanded'
          ) === 'true';


        if (isOpen) {
          closeMenu();
        } else {
          openMenu();
        }

      }
    );

  }


  if (mobileMenu) {

    mobileMenu
      .querySelectorAll('a')
      .forEach((link) => {

        link.addEventListener(
          'click',
          closeMenu
        );

      });

  }


  document.addEventListener(
    'keydown',
    (event) => {

      if (event.key === 'Escape') {
        closeMenu();
      }

    }
  );



  /* =========================================================
     SCROLL REVEALS
  ========================================================= */

  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-image'
  );


  const showReveal = (element) => {

    if (!element) {
      return;
    }

    element.classList.add('is-visible');

  };



  /*
   * Check elements manually.
   *
   * This acts as an additional safety fallback for browsers
   * that fail to trigger IntersectionObserver correctly.
   */

  const revealElementsAlreadyVisible = () => {

    revealElements.forEach((element) => {

      if (
        element.classList.contains(
          'is-visible'
        )
      ) {
        return;
      }


      const rect =
        element.getBoundingClientRect();


      const viewportHeight =
        window.innerHeight ||
        document.documentElement.clientHeight;


      /*
       * Reveal slightly before the element
       * actually enters the viewport.
       */

      const isNearViewport =
        rect.top <
          viewportHeight + 120 &&
        rect.bottom > -120;


      if (isNearViewport) {

        showReveal(element);

      }

    });

  };



  /*
   * Reduced motion or unsupported browser:
   * everything becomes visible immediately.
   */

  if (
    reduceMotion ||
    !('IntersectionObserver' in window)
  ) {

    revealElements.forEach(
      showReveal
    );

  } else {

    const revealObserver =
      new IntersectionObserver(

        (entries, observer) => {

          entries.forEach((entry) => {

            if (
              entry.isIntersecting ||
              entry.intersectionRatio > 0
            ) {

              showReveal(
                entry.target
              );


              observer.unobserve(
                entry.target
              );

            }

          });

        },

        {
          root: null,

          /*
           * Very small threshold makes large
           * images much more reliable.
           */
          threshold: 0.01,

          /*
           * Trigger slightly before entering.
           */
          rootMargin:
            '0px 0px 80px 0px'
        }

      );


    revealElements.forEach(
      (element) => {

        revealObserver.observe(
          element
        );

      }
    );


    /*
     * Immediately check elements already
     * visible when JS starts.
     */

    requestAnimationFrame(
      revealElementsAlreadyVisible
    );


    /*
     * Check again after DOM/image layout settles.
     */

    window.setTimeout(
      revealElementsAlreadyVisible,
      150
    );


    window.setTimeout(
      revealElementsAlreadyVisible,
      500
    );


    /*
     * Check after all images/fonts/resources load.
     */

    window.addEventListener(
      'load',
      revealElementsAlreadyVisible
    );


    /*
     * Helpful when browser restores a page
     * from back/forward cache.
     */

    window.addEventListener(
      'pageshow',
      revealElementsAlreadyVisible
    );


    /*
     * Handle viewport changes.
     */

    window.addEventListener(
      'resize',
      revealElementsAlreadyVisible,
      {
        passive: true
      }
    );

  }



  /* =========================================================
     HERO REVEAL DELAYS
  ========================================================= */

  const heroReveals =
    document.querySelectorAll(
      '.hero .reveal'
    );


  heroReveals.forEach(
    (element, index) => {

      element.style.transitionDelay =
        `${120 + (index * 95)}ms`;

    }
  );



  /* =========================================================
     PARALLAX
  ========================================================= */

  if (!reduceMotion) {

    const parallaxElements = [
      ...document.querySelectorAll(
        '[data-parallax]'
      )
    ];


    let ticking = false;


    const updateParallax = () => {

      const viewportHeight =
        window.innerHeight;


      parallaxElements.forEach(
        (element) => {

          const parent =
            element.parentElement;


          if (!parent) {
            return;
          }


          const rect =
            parent.getBoundingClientRect();


          /*
           * Don't process elements far outside
           * the viewport.
           */

          if (
            rect.bottom < -100 ||
            rect.top >
              viewportHeight + 100
          ) {
            return;
          }


          const speed =
            Number(
              element.dataset.parallax ||
              0.1
            );


          const centerDelta =
            (
              rect.top +
              rect.height / 2
            ) -
            viewportHeight / 2;


          element.style.transform =
            `translate3d(0, ${
              centerDelta * -speed
            }px, 0)`;

        }
      );


      ticking = false;

    };


    window.addEventListener(
      'scroll',
      () => {

        if (!ticking) {

          window.requestAnimationFrame(
            updateParallax
          );

          ticking = true;

        }

      },
      {
        passive: true
      }
    );


    window.addEventListener(
      'resize',
      updateParallax,
      {
        passive: true
      }
    );


    updateParallax();

  }



  /* =========================================================
     BREWING GUIDE
  ========================================================= */

  const teaSelect =
    document.getElementById(
      'teaSelect'
    );


  const waterValue =
    document.getElementById(
      'waterValue'
    );


  const timeValue =
    document.getElementById(
      'timeValue'
    );


  if (teaSelect) {

    teaSelect.addEventListener(
      'change',
      () => {

        /*
         * Product-specific instructions
         * are intentionally not invented.
         */

        if (waterValue) {

          waterValue.textContent =
            'Packaging guidance';

        }


        if (timeValue) {

          timeValue.textContent =
            'Packaging guidance';

        }

      }
    );

  }



  /* =========================================================
     FOOTER YEAR
  ========================================================= */

  const yearElement =
    document.getElementById('year');


  if (yearElement) {

    yearElement.textContent =
      new Date().getFullYear();

  }



  /* =========================================================
     FINAL REVEAL SAFETY CHECK
  ========================================================= */

  /*
   * This is intentionally kept.
   *
   * If an image was already on screen before the
   * IntersectionObserver registered, it will still
   * become visible.
   */

  requestAnimationFrame(
    revealElementsAlreadyVisible
  );

})();