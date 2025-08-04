var themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
var themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
var themeToggleSystemIcon = document.getElementById('theme-toggle-system-icon');

// Theme management with system/auto as default
function getCurrentTheme() {
    return localStorage.getItem('color-theme') || 'system';
}

function applyTheme(theme) {
    // Hide all icons first
    themeToggleDarkIcon.classList.add('hidden');
    themeToggleLightIcon.classList.add('hidden');
    themeToggleSystemIcon.classList.add('hidden');
    
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        themeToggleLightIcon.classList.remove('hidden');
    } else if (theme === 'light') {
        document.documentElement.classList.remove('dark');
        themeToggleDarkIcon.classList.remove('hidden');
    } else { // system
        themeToggleSystemIcon.classList.remove('hidden');
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
}

// Initialize theme
applyTheme(getCurrentTheme());

// Listen for system theme changes when in system mode
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
    if (getCurrentTheme() === 'system') {
        applyTheme('system');
    }
});

var themeToggleBtn = document.getElementById('theme-toggle');

themeToggleBtn.addEventListener('click', function() {
    const currentTheme = getCurrentTheme();
    let nextTheme;
    
    // Cycle: system -> light -> dark -> system
    if (currentTheme === 'system') {
        nextTheme = 'light';
    } else if (currentTheme === 'light') {
        nextTheme = 'dark';
    } else {
        nextTheme = 'system';
    }
    
    localStorage.setItem('color-theme', nextTheme);
    applyTheme(nextTheme);
});