// Ripple Preview Navigation
// Hover to see preview bubbles with page content, click to navigate instantly

class RippleNav {
  constructor() {
    // Add scoping class to nav links
    const navLinks = document.querySelector('nav .nav-links');
    if (navLinks) {
      navLinks.classList.add('eddy-nav-ripple');
    }

    this.links = document.querySelectorAll('nav .nav-links a');
    this.activePreview = null;
    this.previewCache = new Map();
    this.dwellTimers = new Map();

    // Page color themes (ambient hints on load)
    this.pageThemes = {
      'landing.html': { primary: '#6366f1', secondary: '#8b5cf6', accent: '#ec4899' },
      'components.html': { primary: '#10b981', secondary: '#6366f1', accent: '#8b5cf6' },
      'playground.html': { primary: '#f59e0b', secondary: '#06b6d4', accent: '#ec4899' },
    };

    this.init();
  }

  init() {
    this.links.forEach(link => {
      this.setupLink(link);
    });
  }

  setupLink(link) {
    const href = link.getAttribute('href');

    // Create ripple container
    const rippleContainer = document.createElement('div');
    rippleContainer.className = 'eddy-ripple-container';
    link.appendChild(rippleContainer);

    // Create ambient hint (visible on load)
    const ambientHint = document.createElement('div');
    ambientHint.className = 'eddy-ambient-hint';
    const theme = this.getThemeForLink(href);
    if (theme) {
      ambientHint.style.background = `linear-gradient(135deg, ${theme.primary}20, ${theme.secondary}20)`;
    }
    link.appendChild(ambientHint);

    // Mouse events
    link.addEventListener('mouseenter', (e) => this.handleHover(link, e));
    link.addEventListener('mouseleave', () => this.handleLeave(link));
    link.addEventListener('mousemove', (e) => this.handleMove(link, e));

    // Click events (instant navigation)
    link.addEventListener('click', (e) => {
      if (!href.startsWith('http')) {
        this.createRipple(link, e);
      }
    });
  }

  getThemeForLink(href) {
    if (!href) return null;
    const filename = href.split('/').pop();
    return this.pageThemes[filename] || null;
  }

  handleHover(link, e) {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http')) return;

    // Create initial ripple
    this.createRipple(link, e, false);

    // Start dwell timer for preview
    const timer = setTimeout(() => {
      this.showPreview(link, e);
    }, 300);

    this.dwellTimers.set(link, timer);
  }

  handleLeave(link) {
    // Clear dwell timer
    const timer = this.dwellTimers.get(link);
    if (timer) {
      clearTimeout(timer);
      this.dwellTimers.delete(link);
    }

    // Hide preview
    this.hidePreview();
  }

  handleMove(link, e) {
    // Subtle ripple on movement
    if (Math.random() < 0.1) {
      this.createRipple(link, e, true);
    }
  }

  createRipple(link, e, subtle = false) {
    const rippleContainer = link.querySelector('.eddy-ripple-container');
    if (!rippleContainer) return;

    const rect = link.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement('div');
    ripple.className = subtle ? 'eddy-ripple eddy-ripple-subtle' : 'eddy-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    const theme = this.getThemeForLink(link.getAttribute('href'));
    if (theme) {
      ripple.style.background = `radial-gradient(circle, ${theme.primary}60, ${theme.secondary}40, transparent)`;
    }

    rippleContainer.appendChild(ripple);

    // Remove after animation
    setTimeout(() => ripple.remove(), 600);
  }

  async showPreview(link, e) {
    const href = link.getAttribute('href');
    if (!href) return;

    // Check cache first
    let previewContent = this.previewCache.get(href);

    if (!previewContent) {
      // Generate preview content
      previewContent = await this.generatePreview(link, href);
      this.previewCache.set(href, previewContent);
    }

    // Create preview bubble
    const preview = document.createElement('div');
    preview.className = 'eddy-preview-bubble';
    preview.innerHTML = previewContent;

    // Position below link
    const rect = link.getBoundingClientRect();
    preview.style.left = `${rect.left + rect.width / 2}px`;
    preview.style.top = `${rect.bottom + 10}px`;

    document.body.appendChild(preview);
    this.activePreview = preview;

    // Animate in
    requestAnimationFrame(() => {
      preview.classList.add('eddy-preview-visible');
    });
  }

  async generatePreview(link, href) {
    const theme = this.getThemeForLink(href);
    const title = link.textContent.trim();

    // Get preview text based on page
    const previews = {
      'landing.html': {
        title: 'Home',
        desc: 'Philosophy and introduction to natural kinetic UI',
        icon: '🏠'
      },
      'components.html': {
        title: 'Components',
        desc: 'Eddy, Pool, Stream, Wave, and Tide components',
        icon: '🌀'
      },
      'playground.html': {
        title: 'Playground',
        desc: 'Real-world scenarios and interactive demos',
        icon: '🎮'
      }
    };

    const filename = href.split('/').pop();
    const data = previews[filename] || { title, desc: 'Navigate to this page', icon: '📄' };

    return `
      <div class="eddy-preview-header" style="background: linear-gradient(135deg, ${theme?.primary || '#6366f1'}40, ${theme?.secondary || '#8b5cf6'}40);">
        <div class="eddy-preview-icon">${data.icon}</div>
        <div class="eddy-preview-title">${data.title}</div>
      </div>
      <div class="eddy-preview-body">
        <p>${data.desc}</p>
      </div>
      <div class="eddy-preview-footer">Click to navigate</div>
    `;
  }

  hidePreview() {
    if (this.activePreview) {
      this.activePreview.classList.remove('eddy-preview-visible');
      setTimeout(() => {
        this.activePreview?.remove();
        this.activePreview = null;
      }, 200);
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new RippleNav());
} else {
  new RippleNav();
}
