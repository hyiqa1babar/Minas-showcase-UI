'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Star, Sparkles, Heart } from 'lucide-react';

const PRODUCTS = [
  {
    id: '1',
    name: 'Classic Pink Vintage Cake',
    category: 'Classic Cakes',
    accentColor: '#F283AE',
    image: 'https://ixbctzycgtvhmejubfef.supabase.co/storage/v1/object/public/product-images/hero-slider/heroimage01.jpeg',
    price: 3800,
    description: 'Beautifully piped buttercream in vintage ribbons and stars. The ultimate retro celebration cake.'
  },
  {
    id: '2',
    name: 'Fresh Rose Flower Cake',
    category: 'Wedding Cakes',
    accentColor: '#C59FBE',
    image: 'https://ixbctzycgtvhmejubfef.supabase.co/storage/v1/object/public/product-images/hero-slider/heroimage02.jpeg',
    price: 9500,
    description: 'Elegant tiers adorned with fresh, organically grown roses and delicate vanilla frosting.'
  },
  {
    id: '3',
    name: 'Bento Flower Box Combo',
    category: 'Bento Flower Boxes',
    accentColor: '#98B8B9',
    image: 'https://ixbctzycgtvhmejubfef.supabase.co/storage/v1/object/public/product-images/hero-slider/heroimage03.jpeg',
    price: 2900,
    description: 'A cute mini bento cake paired with a gorgeous array of seasonal fresh flowers.'
  },
  {
    id: '4',
    name: 'Luxury Gifting Hamper',
    category: 'Hampers & Gifts',
    accentColor: '#FAC1B5',
    image: 'https://ixbctzycgtvhmejubfef.supabase.co/storage/v1/object/public/product-images/hero-slider/heroimage04.jpeg',
    price: 6400,
    description: 'An assortment of artisanal macarons, custom cookies, and premium chocolate truffles.'
  }
];

const REVIEWS = [
  { name: 'Ayesha Khan', rating: 5, text: "The vintage cake was absolutely stunning and tasted like a dream! It was the star of my birthday party.", date: '2 days ago' },
  { name: 'Zainab Ahmed', rating: 5, text: "Bento boxes are my absolute favorite. Beautiful floral styling, and the cake was so moist!", date: '1 week ago' },
  { name: 'Hamza Malik', rating: 5, text: "Superb custom order experience. The attention to detail on the flower choices was incredible.", date: '3 days ago' },
  { name: 'Sana Fatima', rating: 5, text: "Hands down the best custom cakes in town. Mina's never fails to deliver perfection.", date: '5 days ago' }
];

export default function ShowcasePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const touchStartY = useRef(0);

  // GSAP library reference (dynamic import to support server rendering and client hydration)
  const gsapRef = useRef<any>(null);

  // Dynamically load GSAP and register plugins
  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      gsapRef.current = gsap;
      
      // Initialize first slide animations on load
      animateSlideIn(0);
    });
  }, []);

  // Core Slide Transition controller
  const navigateToSlide = (targetIndex: number) => {
    if (isTransitioning || targetIndex === currentSlide || targetIndex < 0 || targetIndex > 3) return;
    setIsTransitioning(true);

    const gsap = gsapRef.current;
    if (!gsap) {
      setCurrentSlide(targetIndex);
      setIsTransitioning(false);
      return;
    }

    // Colors matched to target slide themes
    const curtainColors = ['#F283AE', '#C59FBE', '#98B8B9', '#FAC1B5'];
    const targetColor = curtainColors[targetIndex];

    // Play curtain wipe timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentSlide(targetIndex);
        setIsTransitioning(false);
        // Trigger page reveal animations
        animateSlideIn(targetIndex);
      }
    });

    // 1. Swipe curtain in (covers screen)
    tl.set(curtainRef.current, { backgroundColor: targetColor, top: '100%' })
      .to(curtainRef.current, {
        top: '0%',
        duration: 0.5,
        ease: 'power3.inOut'
      })
      // 2. Swipe curtain out (reveals new content)
      .to(curtainRef.current, {
        top: '-100%',
        duration: 0.6,
        ease: 'power3.inOut',
        delay: 0.1
      });
  };

  // Run entrance animation for the selected slide
  const animateSlideIn = (slideIndex: number) => {
    const gsap = gsapRef.current;
    if (!gsap) return;

    if (slideIndex === 0) {
      // Slide 0: Hero Text Reveal & Image Zoom
      gsap.fromTo(heroImageRef.current, 
        { scale: 1.15 }, 
        { scale: 1.0, duration: 4, ease: 'power2.out' }
      );
      
      // Staggered letters reveal
      const textElements = textRef.current?.querySelectorAll('.reveal-text');
      if (textElements) {
        gsap.fromTo(textElements, 
          { y: 50, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'back.out(1.7)' }
        );
      }
    } 
    else if (slideIndex === 1) {
      // Slide 1: Category Cards Staggered Slide In
      const cards = containerRef.current?.querySelectorAll('.category-card');
      if (cards) {
        gsap.fromTo(cards, 
          { y: 80, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out' }
        );
      }
    } 
    else if (slideIndex === 2) {
      // Slide 2: Products Slide In
      const items = containerRef.current?.querySelectorAll('.product-grid-card');
      if (items) {
        gsap.fromTo(items, 
          { scale: 0.8, opacity: 0 }, 
          { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.2)' }
        );
      }
    } 
    else if (slideIndex === 3) {
      // Slide 3: Floating Reviews Bubbles
      const bubbles = containerRef.current?.querySelectorAll('.review-bubble');
      if (bubbles) {
        gsap.fromTo(bubbles, 
          { scale: 0, opacity: 0, y: 100 }, 
          { scale: 1, opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'elastic.out(1, 0.75)' }
        );

        // Drift background ambient elements slightly
        const floatingDeco = containerRef.current?.querySelectorAll('.deco-item');
        if (floatingDeco) {
          gsap.to(floatingDeco, {
            y: '-=30',
            rotation: '+=20',
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            stagger: 0.2
          });
        }
      }
    }
  };

  // 3D Card Hover Effect handler
  const handleMouseMove3D = (e: React.MouseEvent<HTMLDivElement>, cardId: string) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position inside elements
    const y = e.clientY - rect.top;  // y position inside elements
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Tilt ranges (-10deg to 10deg)
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    const gsap = gsapRef.current;
    if (gsap) {
      gsap.to(card, {
        rotationX: rotateX,
        rotationY: rotateY,
        transformPerspective: 800,
        ease: 'power1.out',
        duration: 0.3,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
      });
    }
  };

  const handleMouseLeave3D = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const gsap = gsapRef.current;
    if (gsap) {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        ease: 'power3.out',
        duration: 0.5,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
      });
    }
  };

  // Wheel events for scroll triggers
  const handleWheel = (e: React.WheelEvent) => {
    if (isTransitioning) return;
    if (e.deltaY > 30) {
      navigateToSlide(currentSlide + 1);
    } else if (e.deltaY < -30) {
      navigateToSlide(currentSlide - 1);
    }
  };

  // Touch handlers for mobile swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isTransitioning) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;

    if (diff > 50) {
      navigateToSlide(currentSlide + 1);
    } else if (diff < -50) {
      navigateToSlide(currentSlide - 1);
    }
  };

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden bg-[#FFFBF8] select-none font-sans"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      ref={containerRef}
    >
      {/* Dynamic Curtain Overlay Wipe */}
      <div 
        ref={curtainRef} 
        className="fixed left-0 right-0 h-screen z-50 pointer-events-none"
        style={{ top: '100%' }}
      />

      {/* Floating Header */}
      <header className="absolute top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between bg-gradient-to-b from-white/20 to-transparent">
        <span className="font-serif text-xl tracking-wider text-[#2C2C2C] flex items-center gap-1 font-bold">
          Mina's <span className="text-[#F283AE]">Showcase</span>
        </span>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-[#F283AE]/10 text-[#F283AE] text-xs font-bold rounded-full border border-[#F283AE]/20 flex items-center gap-1">
            <Sparkles size={12} /> GSAP Interactive
          </div>
        </div>
      </header>

      {/* Floating Side Indicators */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4">
        {[0, 1, 2, 3].map((idx) => {
          const labels = ['Welcome', 'Categories', 'Featured Cakes', 'Love & Reviews'];
          const colors = ['bg-[#F283AE]', 'bg-[#C59FBE]', 'bg-[#98B8B9]', 'bg-[#FAC1B5]'];
          return (
            <button
              key={idx}
              onClick={() => navigateToSlide(idx)}
              className="group relative flex items-center justify-end"
              aria-label={`Go to slide ${idx + 1}`}
            >
              <span className="absolute right-8 opacity-0 group-hover:opacity-100 bg-[#2C2C2C] text-white text-xs font-semibold px-2 py-1 rounded transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md">
                {labels[idx]}
              </span>
              <div 
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                  currentSlide === idx 
                    ? `${colors[idx]} scale-125 border-2 border-white ring-2 ring-[#2C2C2C]/20` 
                    : 'bg-gray-300 hover:bg-gray-500 scale-100'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* ─── SLIDE 0: HERO ─── */}
      <div className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center transition-opacity duration-500 ${currentSlide === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            ref={heroImageRef}
            src="https://ixbctzycgtvhmejubfef.supabase.co/storage/v1/object/public/product-images/hero-slider/heroimage01.jpeg" 
            alt="Mina's Bakeshop Background"
            className="w-full h-full object-cover brightness-[0.7]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-[#2c2c2c]/30 to-black/40" />
        </div>
        
        <div ref={textRef} className="relative z-10 text-center px-4 max-w-3xl flex flex-col items-center">
          <h1 className="overflow-hidden font-serif text-5xl sm:text-6xl md:text-8xl text-white tracking-wide font-extrabold mb-4">
            <span className="reveal-text inline-block">MINA'S</span>{' '}
            <span className="reveal-text inline-block text-[#FAC1B5]">BAKESHOP</span>
          </h1>
          <p className="overflow-hidden text-lg sm:text-xl md:text-2xl text-white/90 font-serif italic mb-8 max-w-xl">
            <span className="reveal-text inline-block">Handcrafted cakes, desserts, and flower combos baked to tell your sweetest stories.</span>
          </p>
          <div className="overflow-hidden flex gap-4">
            <button 
              onClick={() => navigateToSlide(1)}
              className="reveal-text px-8 py-3 bg-[#F283AE] hover:bg-[#E86FA3] text-white font-bold rounded-full shadow-lg hover:shadow-pink-300/40 hover:scale-105 transition-all text-base flex items-center gap-2"
            >
              Explore Showcase <Sparkles size={16} />
            </button>
          </div>
        </div>

        <button 
          onClick={() => navigateToSlide(1)}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/60 hover:text-white transition-colors cursor-pointer animate-bounce"
        >
          <span className="text-xs font-semibold uppercase tracking-widest">Scroll Down</span>
          <ChevronDown size={20} />
        </button>
      </div>

      {/* ─── SLIDE 1: CATEGORIES ─── */}
      <div className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center px-4 sm:px-12 bg-gradient-to-b from-[#FFFDFB] to-[#FDF4EE] transition-opacity duration-500 ${currentSlide === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
        <div className="w-full max-w-6xl">
          <div className="text-center mb-8 md:mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C59FBE] bg-[#C59FBE]/10 px-3 py-1 rounded-full">Menu Highlights</span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#2C2C2C] mt-2 font-bold">Artisanal Categories</h2>
            <p className="text-sm md:text-base text-gray-500 mt-2 max-w-md mx-auto">Hover over any card for a tactile 3D interactive tilting effect.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Classic Cakes', items: 'Custom piping, rich flavors', accent: '#F283AE', bg: 'bg-[#F283AE]/10', img: 'https://ixbctzycgtvhmejubfef.supabase.co/storage/v1/object/public/product-images/hero-slider/heroimage01.jpeg' },
              { title: 'Wedding Cakes', items: 'Multi-tiered floral setups', accent: '#C59FBE', bg: 'bg-[#C59FBE]/10', img: 'https://ixbctzycgtvhmejubfef.supabase.co/storage/v1/object/public/product-images/hero-slider/heroimage02.jpeg' },
              { title: 'Bento Flower Combos', items: 'Cake & fresh flowers set', accent: '#98B8B9', bg: 'bg-[#98B8B9]/10', img: 'https://ixbctzycgtvhmejubfef.supabase.co/storage/v1/object/public/product-images/hero-slider/heroimage03.jpeg' },
              { title: 'Luxury Hampers', items: 'Gift boxes, macarons, cookies', accent: '#FAC1B5', bg: 'bg-[#FAC1B5]/10', img: 'https://ixbctzycgtvhmejubfef.supabase.co/storage/v1/object/public/product-images/hero-slider/heroimage04.jpeg' }
            ].map((cat, idx) => (
              <div
                key={idx}
                className="category-card relative rounded-3xl overflow-hidden bg-white p-5 border border-[#FAC1B5]/20 shadow-md cursor-pointer transition-all duration-300 hover:shadow-2xl flex flex-col h-[320px] justify-between group"
                onMouseMove={(e) => handleMouseMove3D(e, `cat-${idx}`)}
                onMouseLeave={handleMouseLeave3D}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Visual Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: cat.accent }} />
                
                <div className="z-10" style={{ transform: 'translateZ(30px)' }}>
                  <span className="text-xs font-extrabold uppercase" style={{ color: cat.accent }}>Mina's Signature</span>
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-[#2C2C2C] mt-1">{cat.title}</h3>
                  <p className="text-xs md:text-sm text-gray-400 mt-1">{cat.items}</p>
                </div>

                <div 
                  className="w-full h-36 rounded-2xl overflow-hidden my-4 relative"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  <img 
                    src={cat.img} 
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                </div>

                <div className="flex items-center justify-between z-10" style={{ transform: 'translateZ(40px)' }}>
                  <span className="text-xs font-bold text-gray-500 uppercase">View items</span>
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform duration-300 group-hover:translate-x-1"
                    style={{ backgroundColor: cat.accent }}
                  >
                    →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── SLIDE 2: PRODUCTS ─── */}
      <div className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center px-4 sm:px-12 bg-gradient-to-b from-[#FFFDFB] to-[#F1ECE7] transition-opacity duration-500 ${currentSlide === 2 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
        <div className="w-full max-w-6xl">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#98B8B9] bg-[#98B8B9]/10 px-3 py-1 rounded-full">Sweet Collection</span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#2C2C2C] mt-2 font-bold">Featured Creations</h2>
            <p className="text-sm text-gray-500 mt-2">Beautifully crafted desserts, ready to make your celebration memorable.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PRODUCTS.map((prod) => (
              <div 
                key={prod.id}
                className="product-grid-card bg-white rounded-3xl overflow-hidden border border-[#FAC1B5]/30 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row p-4 gap-4 group cursor-pointer"
              >
                <div className="w-full sm:w-44 h-44 rounded-2xl overflow-hidden relative flex-shrink-0">
                  <img 
                    src={prod.image} 
                    alt={prod.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                    style={{ backgroundColor: prod.accentColor }}
                  />
                </div>
                
                <div className="flex flex-col justify-between flex-grow py-1">
                  <div>
                    <span 
                      className="text-xs font-bold px-2 py-0.5 rounded-full border"
                      style={{ color: prod.accentColor, borderColor: `${prod.accentColor}30`, backgroundColor: `${prod.accentColor}08` }}
                    >
                      {prod.category}
                    </span>
                    <h3 className="text-lg md:text-xl font-serif font-bold text-[#2C2C2C] mt-2 line-clamp-1 group-hover:text-[#F283AE] transition-colors">
                      {prod.name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-400 mt-1.5 line-clamp-2">
                      {prod.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-bold" style={{ color: prod.accentColor }}>
                      Rs. {prod.price.toLocaleString()}
                    </span>
                    
                    <button 
                      className="px-4 py-1.5 text-xs font-bold text-white rounded-full transition-all flex items-center gap-1 shadow-sm"
                      style={{ backgroundColor: prod.accentColor }}
                    >
                      View Details <Sparkles size={10} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── SLIDE 3: REVIEWS ─── */}
      <div className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center px-4 sm:px-12 bg-gradient-to-b from-[#FFFDFB] to-[#FCECEC] transition-opacity duration-500 ${currentSlide === 3 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
        {/* Decorative Floating Background Items */}
        <div className="deco-item absolute top-20 left-10 text-4xl opacity-20 filter blur-[1px]">🎂</div>
        <div className="deco-item absolute bottom-20 left-[15%] text-5xl opacity-15 filter blur-[0.5px]">🌸</div>
        <div className="deco-item absolute top-1/4 right-[8%] text-4xl opacity-20 filter blur-[1px]">🍰</div>
        <div className="deco-item absolute bottom-1/4 right-[12%] text-6xl opacity-10">🧁</div>

        <div className="w-full max-w-4xl relative z-10">
          <div className="text-center mb-8 md:mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F283AE] bg-[#F283AE]/10 px-3 py-1 rounded-full">Customer Stories</span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#2C2C2C] mt-2 font-bold">Baked With Love</h2>
            <p className="text-sm md:text-base text-gray-500 mt-2">What our wonderful customers have to say about their sweet experiences.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {REVIEWS.map((rev, idx) => (
              <div 
                key={idx}
                className="review-bubble bg-white rounded-3xl p-6 border border-[#FAC1B5]/30 shadow-md hover:shadow-lg transition-all duration-300 relative"
              >
                {/* Corner Sparkle */}
                <div className="absolute top-4 right-4 text-pink-300">
                  <Heart size={16} className="fill-pink-200 text-pink-300 animate-pulse" />
                </div>

                <div className="flex items-center gap-1.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      className={`fill-current ${i < rev.rating ? 'text-amber-400' : 'text-gray-200'}`} 
                    />
                  ))}
                </div>

                <p className="text-gray-600 text-sm italic font-serif leading-relaxed">
                  "{rev.text}"
                </p>

                <div className="flex items-center justify-between border-t border-gray-100 mt-4 pt-3">
                  <span className="font-semibold text-gray-800 text-xs sm:text-sm">{rev.name}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
