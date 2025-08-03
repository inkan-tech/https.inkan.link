/**
 * Video Lazy Loading System for Hugo Site
 * Based on landing-page-mobile project's timer-based approach
 * Optimized for performance and user experience
 */

class VideoLazyLoader {
  constructor() {
    this.loadedVideos = new Set();
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupLazyLoading());
    } else {
      this.setupLazyLoading();
    }
  }

  setupLazyLoading() {
    // Find all lazy video containers
    const videoContainers = document.querySelectorAll('.lazy-video-container');
    
    // Use Intersection Observer for viewport-based loading
    if ('IntersectionObserver' in window) {
      this.setupIntersectionObserver(videoContainers);
    } else {
      // Fallback for older browsers - load after delay
      this.setupFallbackLoading(videoContainers);
    }
  }

  setupIntersectionObserver(containers) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const container = entry.target;
          const videoId = container.dataset.videoId;
          
          if (videoId && !this.loadedVideos.has(videoId)) {
            // Add timer delay for performance
            const loadDelay = parseInt(container.dataset.loadDelay) || 1000;
            
            container.classList.add('lazy-loading');
            
            setTimeout(() => {
              this.loadVideo(container);
              observer.unobserve(container);
            }, loadDelay);
          }
        }
      });
    }, {
      rootMargin: '100px', // Start loading when video is 100px from viewport
      threshold: 0.1
    });

    containers.forEach(container => observer.observe(container));
  }

  setupFallbackLoading(containers) {
    // For browsers without Intersection Observer, use timer-based loading
    containers.forEach(container => {
      const loadDelay = parseInt(container.dataset.loadDelay) || 2000;
      
      setTimeout(() => {
        if (!this.loadedVideos.has(container.dataset.videoId)) {
          this.loadVideo(container);
        }
      }, loadDelay);
    });
  }

  loadVideo(container) {
    const videoSrc = container.dataset.videoSrc;
    const videoId = container.dataset.videoId;
    const fallbackImg = container.dataset.fallback;

    if (!videoSrc || this.loadedVideos.has(videoId)) return;

    container.classList.add('lazy-loading');
    this.loadedVideos.add(videoId);

    // Create video element
    const video = document.createElement('video');
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');
    video.className = 'absolute inset-0 object-cover w-full h-full';
    video.style.borderRadius = 'inherit';

    // Ensure muted for autoplay compliance - critical for browser autoplay policies
    video.muted = true;
    video.volume = 0;
    video.setAttribute('muted', 'muted');

    // Success handler
    video.addEventListener('loadeddata', () => {
      container.classList.remove('lazy-loading');
      container.classList.add('lazy-loaded');
      
      // Try to play
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay failed - add click to play
          this.addClickToPlay(video, container);
        });
      }
    });

    // Error handler
    video.addEventListener('error', () => {
      container.classList.remove('lazy-loading');
      container.classList.add('lazy-error');
      
      if (fallbackImg) {
        this.showFallbackImage(container, fallbackImg);
      }
    });

    // Add source
    const source = document.createElement('source');
    source.src = videoSrc;
    source.type = 'video/webm';
    video.appendChild(source);

    // Replace placeholder content
    const placeholder = container.querySelector('.video-placeholder');
    if (placeholder) {
      container.removeChild(placeholder);
    }
    
    container.appendChild(video);
  }

  addClickToPlay(video, container) {
    const playOverlay = document.createElement('div');
    playOverlay.className = 'absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer';
    playOverlay.innerHTML = `
      <svg class="w-16 h-16 text-white opacity-80 hover:opacity-100 transform hover:scale-110 transition-all duration-200" 
           fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
      </svg>
    `;

    playOverlay.addEventListener('click', () => {
      video.play().then(() => {
        container.removeChild(playOverlay);
      });
    });

    container.appendChild(playOverlay);
  }

  showFallbackImage(container, fallbackSrc) {
    const img = document.createElement('img');
    img.src = fallbackSrc;
    img.className = 'absolute inset-0 object-cover w-full h-full';
    img.alt = 'Video fallback';
    img.style.borderRadius = 'inherit';
    
    container.appendChild(img);
  }
}

// Auto-initialize
new VideoLazyLoader();