import React from 'react';
import { motion } from 'framer-motion';

const GallerySection = () => {
  const [featuredImageIndex, setFeaturedImageIndex] = React.useState(0);
  const [preloadedImages, setPreloadedImages] = React.useState({});
  const carouselRef = React.useRef(null);
  const thumbRefs = React.useRef([]);
  const focusTrapRef = React.useRef(null);

  const galleryImages = React.useMemo(
    () =>
      Object.values(
        import.meta.glob('../assets/gallery/*.{png,jpg,jpeg}', { eager: true, as: 'url' })
      ),
    []
  );

  // Preload full images
  React.useEffect(() => {
    galleryImages.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => setPreloadedImages((prev) => ({ ...prev, [src]: true }));
    });
  }, [galleryImages]);

  const wrap = (i) =>
    ((i % galleryImages.length) + galleryImages.length) % galleryImages.length;

  const goTo = (i) => setFeaturedImageIndex(wrap(i));
  const next = () => setFeaturedImageIndex((i) => wrap(i + 1));
  const prev = () => setFeaturedImageIndex((i) => wrap(i - 1));

  // Centre active thumbnail whenever featured changes
  React.useEffect(() => {
    const container = carouselRef.current;
    const thumb = thumbRefs.current[featuredImageIndex];
    if (!container || !thumb) return;

    const target =
      thumb.offsetLeft + thumb.offsetWidth / 2 - container.clientWidth / 2;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const clamped = Math.max(0, Math.min(target, maxScroll));
    container.scrollTo({ left: clamped, behavior: 'smooth' });
  }, [featuredImageIndex]);

  // Keyboard navigation on the focusable wrapper
  const onKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        next();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        prev();
        break;
      case 'Home':
        e.preventDefault();
        goTo(0);
        break;
      case 'End':
        e.preventDefault();
        goTo(galleryImages.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        next();
        break;
      default:
        break;
    }
  };

  // Large image click, left half = prev, right half = next
  const handleFeatureActivate = (clientX, rect) => {
    const mid = rect.left + rect.width / 2;
    if (clientX >= mid) next();
    else prev();
  };

  const handleFeatureClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    handleFeatureActivate(e.clientX, rect);
  };

  // Swipe and tap on large image
  const touchState = React.useRef({ x: 0, y: 0, t: 0, moved: false });
  const SWIPE_PX = 40;  // horizontal distance threshold
  const SWIPE_RATIO = 1.5; // must be more horizontal than vertical by this factor

  const onTouchStartFeature = (e) => {
    const t = e.changedTouches?.[0];
    if (!t) return;
    touchState.current = { x: t.clientX, y: t.clientY, t: Date.now(), moved: false };
  };

  const onTouchMoveFeature = (e) => {
    const t = e.changedTouches?.[0];
    if (!t) return;
    const dx = t.clientX - touchState.current.x;
    const dy = t.clientY - touchState.current.y;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) touchState.current.moved = true;
  };

  const onTouchEndFeature = (e) => {
    const t = e.changedTouches?.[0];
    if (!t) return;
    const dx = t.clientX - touchState.current.x;
    const dy = t.clientY - touchState.current.y;

    // Swipe if horizontal dominant and past threshold
    if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > SWIPE_RATIO * Math.abs(dy)) {
      e.preventDefault();
      if (dx < 0) next(); else prev();
      return;
    }

    // Otherwise treat as a tap left/right
    const rect = e.currentTarget.getBoundingClientRect();
    e.preventDefault();
    handleFeatureActivate(t.clientX, rect);
  };

  const scrollCarousel = (dir) => {
    const el = carouselRef.current;
    if (!el) return;
    const amount = 300;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (!galleryImages.length) return null;

  return (
    <section id="gallery" className="py-20 px-4 bg-white" aria-label="Image gallery">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Gallery</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Take a peek at some of our wonderful sensory play moments
          </p>
        </motion.div>

        <div className="space-y-6 max-w-5xl mx-auto">
          {/* Focusable wrapper enables keyboard nav */}
          <div
            ref={focusTrapRef}
            tabIndex={0}
            onKeyDown={onKeyDown}
            aria-roledescription="carousel"
            aria-label="Featured image, use left and right arrow keys to change image"
            className="outline-none"
          >
            {/* Featured Image */}
            <motion.div
              className="w-full aspect-[16/9] rounded-2xl shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img
                src={galleryImages[featuredImageIndex]}
                alt=""
                className={`w-full h-full object-cover transition-opacity duration-300 cursor-pointer ${preloadedImages[galleryImages[featuredImageIndex]] ? 'opacity-100' : 'opacity-0'
                  }`}
                onClick={handleFeatureClick}
                onTouchStart={onTouchStartFeature}
                onTouchMove={onTouchMoveFeature}
                onTouchEnd={onTouchEndFeature}
                role="button"
                aria-label="Click or tap left for previous, right for next"
                draggable={false}
                loading="eager"
                decoding="async"
              />
            </motion.div>

            {/* Progress indicators */}
            <div className="mt-3 flex items-center justify-center gap-0.5 mx-4" aria-hidden="false">
              {galleryImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to image ${i + 1}`}
                  aria-current={i === featuredImageIndex ? 'true' : 'false'}
                  className="relative inline-flex items-center justify-center p-2 bg-transparent focus:outline-none"
                >
                  <span
                    className={`block rounded-full bg-pink-800 
                      ${i === featuredImageIndex ? 'opacity-100' : 'opacity-20'} 
                      w-[0.25rem] h-[0.25rem] md:w-2 md:h-2`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Carousel */}
          <div className="relative" aria-label="Thumbnails">
            {/* Left button */}
            <button
              onClick={() => scrollCarousel('left')}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-r-xl p-2 shadow-md transition-all duration-200 backdrop-blur-sm"
              aria-label="Scroll thumbnails left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right button */}
            <button
              onClick={() => scrollCarousel('right')}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-l-xl p-2 shadow-md transition-all duration-200 backdrop-blur-sm"
              aria-label="Scroll thumbnails right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <div ref={carouselRef} className="overflow-x-auto scrollbar-hide md:cursor-default">
              <div className="flex gap-4 pb-4 px-4" style={{ userSelect: 'none' }}>
                {galleryImages.map((image, index) => (
                  <motion.div
                    key={index}
                    ref={(el) => (thumbRefs.current[index] = el)}
                    className="flex-none w-36 aspect-video rounded-lg shadow-md cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    onClick={() => goTo(index)}
                    role="button"
                    aria-label={`Select image ${index + 1}`}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        goTo(index);
                      }
                    }}
                  >
                    <img
                      src={image}
                      alt=""
                      className={`w-full h-full object-cover rounded-md border-4 ${index === featuredImageIndex ? 'border-pink-500' : 'border-white'
                        }`}
                      draggable={false}
                      loading="lazy"      // lazy thumbs
                      decoding="async"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Live region for SR updates */}
          <p className="sr-only" aria-live="polite">
            Showing image {featuredImageIndex + 1} of {galleryImages.length}
          </p>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
