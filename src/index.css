@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Outfit", ui-sans-serif, system-ui, sans-serif;
}

@layer base {
  body {
    @apply bg-[#05010d] text-neutral-100 antialiased selection:bg-amber-500/30 selection:text-amber-200;
  }

  /* Custom Scrollbar for Dark Theme */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    @apply bg-transparent;
  }
  ::-webkit-scrollbar-thumb {
    @apply bg-white/10 rounded-full hover:bg-white/20 transition-colors;
  }
}

@layer utilities {
  .glass-panel {
    @apply bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-2xl;
  }
  .text-gradient-gold {
    @apply bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600;
  }
  .bg-gradient-gold {
    @apply bg-gradient-to-r from-amber-400 to-amber-600;
  }
}
