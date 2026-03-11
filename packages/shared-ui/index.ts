// ============================================================
// SOVEREIGN SHARED UI - Predator Dark Mode Theme
// Consistent brand identity across all apps
// ============================================================

export const SOVEREIGN_THEME = {
  colors: {
    // Core
    dark: '#0A0A0A',
    charcoal: '#1A1A1A',
    surface: '#111111',
    
    // Brand
    gold: '#D4AF37',
    goldLight: '#F0D060',
    goldDark: '#B8941F',
    
    // Accent
    blue: '#00AEEF',
    emerald: '#27AE60',
    red: '#E74C3C',
    purple: '#9B59B6',
    
    // Text
    cream: '#F5F5DC',
    creamMuted: 'rgba(245, 245, 220, 0.6)',
    creamSubtle: 'rgba(245, 245, 220, 0.4)',
    creamGhost: 'rgba(245, 245, 220, 0.2)',
  },

  gradients: {
    gold: 'linear-gradient(135deg, #D4AF37, #F0D060)',
    goldDark: 'linear-gradient(135deg, #D4AF37, #B8941F)',
    dark: 'linear-gradient(145deg, #1A1A1A, #111111)',
    hero: 'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0, 174, 239, 0.03) 0%, transparent 50%)',
  },

  fonts: {
    serif: "'Playfair Display', Georgia, serif",
    sans: "'Inter', system-ui, sans-serif",
  },

  shadows: {
    glowGold: '0 0 30px rgba(212, 175, 55, 0.2)',
    glowBlue: '0 0 30px rgba(0, 174, 239, 0.2)',
    card: '0 20px 60px rgba(212, 175, 55, 0.15)',
    button: '0 8px 30px rgba(212, 175, 55, 0.4)',
  },
} as const

// Tailwind config extension for sovereign theme
export const TAILWIND_SOVEREIGN_CONFIG = `
tailwind.config = {
  theme: {
    extend: {
      colors: {
        sovereign: {
          dark: '#0A0A0A',
          charcoal: '#1A1A1A',
          gold: '#D4AF37',
          'gold-light': '#F0D060',
          blue: '#00AEEF',
          cream: '#F5F5DC',
          emerald: '#27AE60'
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  }
}
`

// Common CSS styles shared across all apps
export const SOVEREIGN_CSS = `
* { font-family: 'Inter', system-ui, sans-serif; }
h1, h2, h3, .font-serif { font-family: 'Playfair Display', Georgia, serif; }
body { background: #0A0A0A; color: #F5F5DC; }
.gold-gradient { background: linear-gradient(135deg, #D4AF37, #F0D060); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.gold-border { border-image: linear-gradient(135deg, #D4AF37, #F0D060) 1; }
.card-hover { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.card-hover:hover { transform: translateY(-8px); box-shadow: 0 20px 60px rgba(212, 175, 55, 0.15); }
.glow-gold { box-shadow: 0 0 30px rgba(212, 175, 55, 0.2); }
.glow-blue { box-shadow: 0 0 30px rgba(0, 174, 239, 0.2); }
.btn-sovereign { background: linear-gradient(135deg, #D4AF37, #B8941F); color: #0A0A0A; font-weight: 700; padding: 14px 32px; border-radius: 8px; transition: all 0.3s; display: inline-block; text-decoration: none; cursor: pointer; border: none; }
.btn-sovereign:hover { background: linear-gradient(135deg, #F0D060, #D4AF37); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(212, 175, 55, 0.4); }
.btn-outline { border: 2px solid #D4AF37; color: #D4AF37; font-weight: 600; padding: 12px 28px; border-radius: 8px; transition: all 0.3s; display: inline-block; text-decoration: none; background: transparent; cursor: pointer; }
.btn-outline:hover { background: rgba(212, 175, 55, 0.1); transform: translateY(-2px); }
.nav-glass { background: rgba(10, 10, 10, 0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
.stat-card { background: linear-gradient(145deg, #1A1A1A, #111111); border: 1px solid rgba(212, 175, 55, 0.15); }
.fade-in { opacity: 0; transform: translateY(30px); transition: all 0.8s; }
.fade-in.visible { opacity: 1; transform: translateY(0); }
`

// CDN Links needed in all apps
export const CDN_LINKS = {
  tailwind: '<script src="https://cdn.tailwindcss.com"></script>',
  fontAwesome: '<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css" rel="stylesheet">',
  googleFonts: '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;600;700;800&display=swap" rel="stylesheet">',
  axios: '<script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>',
  chartjs: '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>',
}
