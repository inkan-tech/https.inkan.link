const purgecss = require('@fullhuman/postcss-purgecss').default || require('@fullhuman/postcss-purgecss');
const cssnano = require('cssnano');

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),

    // PurgeCSS - only in production to remove unused CSS
    ...(process.env.HUGO_ENVIRONMENT === 'production' || process.env.NODE_ENV === 'production'
      ? [
          purgecss({
            content: [
              './layouts/**/*.html',
              './content/**/*.{html,md}',
              './assets/js/**/*.js',
              './static/**/*.js',
            ],
            // Safelist patterns for dynamic classes
            safelist: {
              standard: [
                /^lazy-/,      // Lazy loading classes
                /^dark:/,      // Dark mode classes
                /^hanko/,      // Japanese-inspired custom classes
                /^wabi/,
                /^sumi/,
                /^washi/,
                /^seigaiha/,
                /^asanoha/,
                /^inkan/,
                /^carousel-/,  // Carousel classes
                /^swiper-/,    // Swiper classes if used
                /^hljs-/,      // Code highlighting
                'active',
                'selected',
                'hidden',
                'show',
              ],
              deep: [
                /^prose/,      // Typography plugin classes
              ],
              greedy: [
                /data-/,       // Data attribute selectors
              ]
            },
            // Extract classes from Hugo partials and shortcodes
            defaultExtractor: content => {
              // Capture classes within quotes, including Hugo template variables
              const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
              const innerMatches = content.match(/[^<>"'`\s.()#]*[^<>"'`\s.():#]/g) || [];

              return broadMatches.concat(innerMatches);
            }
          }),

          // CSS Nano for minification and optimization
          cssnano({
            preset: ['default', {
              discardComments: {
                removeAll: true,
              },
              reduceIdents: false, // Don't rename keyframes
              zindex: false, // Don't rebase z-index values
            }]
          })
        ]
      : []
    )
  ]
}
