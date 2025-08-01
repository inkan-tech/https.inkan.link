/**
 * Lighthouse CI Configuration for Hugo Static Site
 * Inkan.link Performance Monitoring Setup
 * 
 * This configuration is optimized for Hugo static sites in 2025
 * with support for bilingual content and TailwindCSS
 */

module.exports = {
  ci: {
    collect: {
      // Hugo builds to the public directory
      staticDistDir: './public',
      
      // Test multiple URL paths including bilingual content
      url: [
        'http://localhost:3000',
        'http://localhost:3000/en',
        'http://localhost:3000/posts',
        'http://localhost:3000/en/posts',
        'http://localhost:3000/team',
        'http://localhost:3000/en/team',
        'http://localhost:3000/contacts',
        'http://localhost:3000/en/contacts'
      ],
      
      // Run multiple times for more reliable results
      numberOfRuns: 3,
      
      // Chrome settings optimized for CI environments
      settings: {
        chromeFlags: '--no-sandbox --headless --disable-gpu --disable-dev-shm-usage',
        
        // Skip PWA audits since this is a static site
        skipAudits: [
          'service-worker',
          'installable-manifest',
          'splash-screen',
          'themed-omnibox',
          'maskable-icon',
          'offline-start-url'
        ],
        
        // Form factor for testing
        formFactor: 'desktop',
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false,
        },
        
        // Throttling settings for consistent results
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0
        }
      }
    },
    
    assert: {
      // Performance budget assertions
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        
        // Core Web Vitals
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        
        // Additional performance metrics
        'speed-index': ['warn', { maxNumericValue: 3000 }],
        'interactive': ['warn', { maxNumericValue: 3000 }],
        
        // Resource optimization
        'unused-css-rules': ['warn', { maxLength: 0 }],
        'unused-javascript': ['warn', { maxLength: 0 }],
        'modern-image-formats': ['warn', { maxLength: 0 }],
        'efficient-animated-content': ['warn', { maxLength: 0 }],
        
        // Network optimization
        'uses-text-compression': ['error', { maxLength: 0 }],
        'uses-optimized-images': ['warn', { maxLength: 0 }],
        'uses-responsive-images': ['warn', { maxLength: 0 }],
        
        // Security and best practices
        'is-on-https': ['error', { maxLength: 0 }],
        'uses-http2': 'off', // Cannot be tested on localhost
        'no-vulnerable-libraries': ['error', { maxLength: 0 }]
      }
    },
    
    upload: {
      // Configure for GitHub Actions artifacts
      target: 'temporary-public-storage',
      
      // Server upload configuration (uncomment and configure if using LHCI server)
      // serverBaseUrl: 'https://your-lhci-server.com',
      // token: process.env.LHCI_TOKEN,
    },
    
    server: {
      // Configuration if running your own LHCI server
      port: 9001,
      storage: {
        storageMethod: 'sql',
        sqlDialect: 'sqlite',
        sqlDatabasePath: './lhci.db'
      }
    }
  }
};