// Minimal theme switcher inspired by Beautiful UI (https://www.beautifului.dev/)
(function() {
  const STORAGE_KEY = 'bui-theme';

  function setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem(STORAGE_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem(STORAGE_KEY, 'light');
    }
    updateToggleButtons(theme);
  }

  function updateToggleButtons(theme) {
    const lightBtn = document.getElementById('theme-light-btn');
    const darkBtn = document.getElementById('theme-dark-btn');
    if (lightBtn && darkBtn) {
      if (theme === 'dark') {
        lightBtn.classList.remove('active');
        darkBtn.classList.add('active');
      } else {
        lightBtn.classList.add('active');
        darkBtn.classList.remove('active');
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = saved || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);

    const lightBtn = document.getElementById('theme-light-btn');
    const darkBtn = document.getElementById('theme-dark-btn');

    if (lightBtn) {
      lightBtn.addEventListener('click', () => setTheme('light'));
    }
    if (darkBtn) {
      darkBtn.addEventListener('click', () => setTheme('dark'));
    }
  });
})();
