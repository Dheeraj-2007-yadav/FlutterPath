// app.js - Main Application Logic and Routing

const App = {
  routes: {
    '/': 'renderLandingPage',
    '/roadmap': 'renderRoadmap',
    '/lesson/:id': 'renderLesson',
    '/quiz/:id': 'renderQuiz',
    '/login': 'renderLogin',
    '/dashboard': 'renderDashboard',
    '/project': 'renderProject'
  },

  isDropdownOpen: false,
  isMobileMenuOpen: false,
  isSearchOpen: false,

  init() {
    this.bindEvents();
    this.renderNavbar();
    this.navigate(window.location.hash || '#/');
  },

  bindEvents() {
    window.addEventListener('hashchange', () => {
      this.navigate(window.location.hash || '#/');
    });
    document.addEventListener('click', (e) => {
      if (this.isDropdownOpen || this.isMobileMenuOpen || this.isSearchOpen) {
        const navbar = document.getElementById('navbar');
        if (navbar && !navbar.contains(e.target)) {
          this.closeMenus();
        }
      }
    });
  },

  navigate(path) {
    this.isDropdownOpen = false;
    this.isMobileMenuOpen = false;
    this.isSearchOpen = false;
    const appContainer = document.getElementById('app');

    const doRender = () => {
      appContainer.innerHTML = '';
      let matchFound = false;
      for (const [route, renderMethod] of Object.entries(this.routes)) {
        const routeRegex = new RegExp('^#' + route.replace(/:[a-zA-Z]+/g, '([a-zA-Z0-9_-]+)') + '$');
        const match = path.match(routeRegex);
        if (match) {
          matchFound = true;
          this[renderMethod](appContainer, ...match.slice(1));
          break;
        }
      }
      if (!matchFound) {
        appContainer.innerHTML = `<h2 class="text-2xl font-bold text-center mt-10 text-gray-900 dark:text-white">404 - Page Not Found</h2>`;
      }
      appContainer.classList.remove('page-enter');
      void appContainer.offsetWidth;
      appContainer.classList.add('page-enter');
      this.renderNavbar();
      window.scrollTo(0, 0);
    };

    if (appContainer.innerHTML.trim() !== '') {
      appContainer.classList.remove('page-enter');
      appContainer.classList.add('page-exit');
      setTimeout(() => { appContainer.classList.remove('page-exit'); doRender(); }, 180);
    } else {
      doRender();
    }
  },

  // ── Theme ────────────────────────────────────────────────────────────────
  isDark() {
    return document.documentElement.classList.contains('dark');
  },

  toggleTheme(e) {
    if (e) e.stopPropagation();
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('fp_theme', 'light');
    } else {
      html.classList.add('dark');
      localStorage.setItem('fp_theme', 'dark');
    }
    this.renderNavbar();
  },

  // ── Navbar ───────────────────────────────────────────────────────────────
  renderNavbar() {
    const navbar = document.getElementById('navbar');
    const user = Store.getUser();
    const dark = this.isDark();
    const dropdownOpen = this.isDropdownOpen ? 'block' : 'hidden';
    const mobileMenuOpen = this.isMobileMenuOpen ? 'block' : 'hidden';
    const searchOpen = this.isSearchOpen ? 'block' : 'hidden';

    const themeIcon = dark
      ? `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`
      : `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>`;

    navbar.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-50">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <a href="#/" class="flex-shrink-0 flex items-center group">
              <span class="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tight">FlutterPath</span>
            </a>
            <div class="hidden md:ml-8 md:flex md:space-x-6">
              <a href="#/roadmap" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500 text-sm font-semibold transition">Roadmap</a>
              <a href="#/project" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500 text-sm font-semibold transition">Capstone</a>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="relative">
              <button onclick="App.toggleSearchPanel(event)" title="Search lessons"
                class="p-2 rounded-xl text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </button>

              <div class="${searchOpen} absolute right-0 top-full mt-3 w-[320px] max-w-[calc(100vw-2rem)] rounded-2xl bg-white dark:bg-gray-900 shadow-[0_20px_40px_rgba(15,23,42,0.18)] ring-1 ring-gray-200 dark:ring-gray-700 overflow-hidden z-50">
                <div class="p-3 border-b border-gray-200 dark:border-gray-700">
                  <div class="relative">
                    <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    <input id="quickSearchInput" type="text" placeholder="Search lessons..."
                      class="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      oninput="App.handleQuickSearch(this.value)">
                  </div>
                </div>
                <div id="quickSearchResults" class="max-h-80 overflow-y-auto">
                  <p class="p-4 text-sm text-gray-500 dark:text-gray-400">Type to search all lessons.</p>
                </div>
              </div>
            </div>

            <!-- Theme toggle -->
            <button onclick="App.toggleTheme(event)" title="Toggle theme"
              class="p-2 rounded-xl text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              ${themeIcon}
            </button>

            <!-- Desktop auth -->
            <div class="hidden md:flex items-center">
              ${user ? `
                <div class="relative ml-3">
                  <button onclick="App.toggleDropdown(event)" type="button"
                    class="flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full">
                    <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-lg border-2 border-blue-200 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-800 transition shadow-sm">
                      ${user.username.charAt(0).toUpperCase()}
                    </div>
                  </button>
                  <div class="${dropdownOpen} absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-[0_18px_40px_rgba(15,23,42,0.18)] ring-1 ring-black/5 dark:ring-white/10 z-50">
                    <div class="px-4 pt-4 pb-3 bg-gray-50/80 dark:bg-gray-900/60 border-b border-gray-200/80 dark:border-gray-700/80">
                      <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">Signed in as</p>
                      <p class="mt-2 text-sm font-bold leading-5 text-gray-900 dark:text-white break-all">${user.username}</p>
                    </div>
                    <div class="py-1.5">
                      <a href="#/dashboard" onclick="App.closeMenus()"
                        class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-300 transition">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                        Dashboard
                      </a>
                    </div>
                    <div class="border-t border-gray-200/80 dark:border-gray-700/80 py-1.5">
                      <button onclick="App.handleLogout()"
                        class="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ` : `
                <a href="#/login" class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md transition transform hover:-translate-y-0.5">Sign In</a>
              `}
            </div>

            <!-- Mobile hamburger -->
            <div class="flex items-center md:hidden">
              <button onclick="App.toggleMobileMenu(event)" type="button"
                class="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition">
                <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div class="${mobileMenuOpen} md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-xl absolute w-full z-40">
        <div class="pt-3 pb-4 space-y-1">
          <a href="#/roadmap" onclick="App.closeMenus()" class="block pl-4 pr-4 py-3 border-l-4 border-transparent text-base font-bold text-gray-700 dark:text-gray-200 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 hover:border-blue-500 transition">Roadmap</a>
          <button type="button" onclick="App.toggleSearchPanel(event); App.closeMenus();" class="w-full text-left pl-4 pr-4 py-3 border-l-4 border-transparent text-base font-bold text-gray-700 dark:text-gray-200 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 hover:border-blue-500 transition">Search</button>
          <a href="#/project" onclick="App.closeMenus()" class="block pl-4 pr-4 py-3 border-l-4 border-transparent text-base font-bold text-gray-700 dark:text-gray-200 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 hover:border-blue-500 transition">Capstone Project</a>
        </div>
        ${user ? `
          <div class="pt-5 pb-5 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div class="flex items-center px-5 mb-4">
              <div class="w-12 h-12 rounded-full bg-blue-200 dark:bg-blue-900 flex items-center justify-center text-blue-800 dark:text-blue-300 font-bold text-xl border-2 border-white dark:border-gray-700 shadow-sm">
                ${user.username.charAt(0).toUpperCase()}
              </div>
              <div class="ml-4">
                <div class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Signed In</div>
                <div class="text-lg font-bold text-gray-900 dark:text-white">${user.username}</div>
              </div>
            </div>
            <div class="space-y-1">
              <a href="#/dashboard" onclick="App.closeMenus()" class="block px-5 py-3 text-base font-bold text-gray-700 dark:text-gray-200 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-700 transition">Dashboard</a>
              <button onclick="App.handleLogout()" class="block w-full text-left px-5 py-3 text-base font-bold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition">Logout</button>
            </div>
          </div>
        ` : `
          <div class="pt-5 pb-5 border-t border-gray-100 dark:border-gray-700 px-5">
            <a href="#/login" onclick="App.closeMenus()" class="block text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-4 rounded-xl font-bold shadow-md transition">Sign In</a>
          </div>
        `}
      </div>
    `;
  },

  toggleDropdown(e) {
    if (e) e.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
    this.isMobileMenuOpen = false;
    this.renderNavbar();
  },

  toggleMobileMenu(e) {
    if (e) e.stopPropagation();
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.isDropdownOpen = false;
    this.renderNavbar();
  },

  closeMenus() {
    if (this.isDropdownOpen || this.isMobileMenuOpen || this.isSearchOpen) {
      this.isDropdownOpen = false;
      this.isMobileMenuOpen = false;
      this.isSearchOpen = false;
      this.renderNavbar();
    }
  },

  toggleSearchPanel(e) {
    if (e) e.stopPropagation();
    this.isSearchOpen = !this.isSearchOpen;
    this.isDropdownOpen = false;
    this.isMobileMenuOpen = false;
    this.renderNavbar();
    requestAnimationFrame(() => {
      const input = document.getElementById('quickSearchInput');
      if (this.isSearchOpen && input) {
        input.focus();
        input.select();
      }
    });
  },

  handleQuickSearch(query) {
    const resultsEl = document.getElementById('quickSearchResults');
    if (!resultsEl) return;

    const q = query.trim().toLowerCase();
    if (!q) {
      resultsEl.innerHTML = '<p class="p-4 text-sm text-gray-500 dark:text-gray-400">Type to search all lessons.</p>';
      return;
    }

    const matches = FLUTTER_LESSONS.filter((lesson) => {
      const text = `${lesson.title} ${lesson.description} ${lesson.content}`.toLowerCase();
      return text.includes(q);
    }).slice(0, 6);

    if (!matches.length) {
      resultsEl.innerHTML = '<p class="p-4 text-sm text-red-500 dark:text-red-400">No lessons found.</p>';
      return;
    }

    resultsEl.innerHTML = matches.map((lesson) => `
      <button type="button" onclick="window.location.hash = '#/lesson/${lesson.id}'; App.isSearchOpen = false; App.renderNavbar();" class="block w-full text-left px-4 py-3 border-b border-gray-100 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-gray-800 transition last:border-b-0">
        <div class="font-bold text-gray-900 dark:text-white">${lesson.title}</div>
        <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">${lesson.description}</div>
      </button>
    `).join('');
  },

  // ── Logout ───────────────────────────────────────────────────────────────
  handleLogout() {
    this.closeMenus();
    document.body.insertAdjacentHTML('beforeend', `
      <div id="logout-modal" class="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300 opacity-0">
        <div id="logout-modal-box" class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl transform transition-all duration-300 scale-95 opacity-0">
          <div class="flex items-center justify-center w-16 h-16 mx-auto bg-red-50 dark:bg-red-900/30 rounded-full mb-6">
            <svg class="w-8 h-8 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </div>
          <h3 class="text-2xl font-black text-center text-gray-900 dark:text-white mb-2">Sign Out</h3>
          <p class="text-center text-gray-500 dark:text-gray-400 mb-8 font-medium">Are you sure you want to sign out? Your progress is safely saved.</p>
          <div class="flex gap-3">
            <button onclick="App.cancelLogout()" class="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-3.5 px-4 rounded-2xl transition">Cancel</button>
            <button onclick="App.confirmLogout()" class="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md transition">Sign Out</button>
          </div>
        </div>
      </div>
    `);
    requestAnimationFrame(() => {
      const modal = document.getElementById('logout-modal');
      const box   = document.getElementById('logout-modal-box');
      if (modal && box) {
        modal.classList.replace('opacity-0', 'opacity-100');
        box.classList.remove('scale-95', 'opacity-0');
        box.classList.add('scale-100', 'opacity-100');
      }
    });
  },

  cancelLogout() {
    const modal = document.getElementById('logout-modal');
    const box   = document.getElementById('logout-modal-box');
    if (modal && box) {
      modal.classList.replace('opacity-100', 'opacity-0');
      box.classList.remove('scale-100', 'opacity-100');
      box.classList.add('scale-95', 'opacity-0');
      setTimeout(() => modal.remove(), 300);
    }
  },

  confirmLogout() {
    const modal = document.getElementById('logout-modal');
    const box   = document.getElementById('logout-modal-box');
    if (modal && box) {
      modal.classList.replace('opacity-100', 'opacity-0');
      box.classList.remove('scale-100', 'opacity-100');
      box.classList.add('scale-95', 'opacity-0');
      setTimeout(() => {
        modal.remove();
        Store.logout();
        window.location.hash = '#/';
        this.renderNavbar();
      }, 300);
    }
  },

  // ── Pages ────────────────────────────────────────────────────────────────
  renderLandingPage(container) {
    container.innerHTML = `
      <div class="bg-white dark:bg-gray-950 overflow-hidden relative">
        <div class="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-50 dark:bg-blue-950 opacity-50 blur-3xl"></div>
        <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-50 dark:bg-indigo-950 opacity-50 blur-3xl"></div>

        <div class="max-w-7xl mx-auto py-20 px-4 sm:py-32 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 class="headline-glow text-5xl font-black text-slate-950 dark:text-white sm:text-6xl lg:text-7xl mb-4 h-24 sm:h-auto tracking-[-0.06em]">
            Master <span id="typewriter" class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 dark:from-blue-400 dark:via-indigo-400 dark:to-cyan-400 pr-2">Flutter</span>
          </h1>
          <p class="readable-copy max-w-2xl mx-auto mt-6 text-xl leading-relaxed text-slate-700 dark:text-slate-300">
            A comprehensive, interactive roadmap to take you from absolute beginner to advanced developer in Flutter and Dart.
          </p>
          <div class="mt-10 flex justify-center">
            <a href="#/roadmap" class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-full py-4 px-10 text-lg font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              Start Learning Now
            </a>
          </div>

          <div class="mt-20 max-w-2xl mx-auto w-full text-left">
            <p class="section-kicker text-xs mb-4">What you'll learn</p>
            <div class="space-y-3 stagger">
              ${FLUTTER_LESSONS.slice(0, 5).map((l, i) => `
                <a href="#/lesson/${l.id}" class="soft-panel flex items-center gap-4 bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 hover:border-blue-200 dark:hover:border-blue-700 hover:-translate-y-0.5 transition-all duration-200 group">
                  <span class="flex-shrink-0 w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 dark:group-hover:bg-blue-500 group-hover:text-white font-black flex items-center justify-center transition-colors">${i + 1}</span>
                  <div class="flex-1 min-w-0">
                    <p class="feature-card-title text-base sm:text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">${l.title}</p>
                    <p class="text-sm text-slate-600 dark:text-slate-400 truncate">${l.description}</p>
                  </div>
                  <svg class="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </a>
              `).join('')}
              <a href="#/roadmap" class="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm pt-2 hover:underline">
                View full roadmap (${FLUTTER_LESSONS.length} lessons) →
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
    setTimeout(() => this.startTypewriter(), 100);
  },

  startTypewriter() {
    const words = ['Flutter', 'Dart', 'Mobile Apps', 'UI Design'];
    let wordIndex = 0, charIndex = words[0].length, isDeleting = true;
    const type = () => {
      const el = document.getElementById('typewriter');
      if (!el) return;
      const word = words[wordIndex];
      charIndex = isDeleting ? charIndex - 1 : charIndex + 1;
      el.innerText = word.substring(0, charIndex);
      let speed = isDeleting ? 30 : 70;
      if (!isDeleting && charIndex === word.length) { speed = 1000; isDeleting = true; }
      else if (isDeleting && charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; speed = 200; }
      App.typewriterTimer = setTimeout(type, speed);
    };
    if (App.typewriterTimer) clearTimeout(App.typewriterTimer);
    App.typewriterTimer = setTimeout(type, 1000);
  },

  renderRoadmap(container) {
    const coursesHtml = FLUTTER_COURSE_GROUPS.map((course, courseIndex) => {
      const isOpen = courseIndex === 0 ? 'block' : 'hidden';
      const lessonCards = course.lessons.map((lesson, lessonIndex) => {
        const done = Store.isLessonComplete(lesson.id);
        return `
          <a href="#/lesson/${lesson.id}" class="block group relative z-10">
            <div class="relative border ${done ? 'border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-900/10' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'} rounded-2xl p-4 mb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm hover:shadow-lg dark:hover:shadow-gray-900 transition-all duration-300 transform hover:-translate-y-1">
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 mt-1 flex items-center justify-center w-10 h-10 rounded-full ${done ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 dark:group-hover:bg-blue-500 group-hover:text-white transition-colors'} font-black text-base shadow-inner">
                  ${done ? '✓' : lessonIndex + 1}
                </div>
                <div>
                  <h3 class="text-xl font-bold ${done ? 'text-green-900 dark:text-green-300' : 'text-gray-900 dark:text-white'} group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">${lesson.title}</h3>
                  <p class="${done ? 'text-green-700 dark:text-green-500' : 'text-gray-500 dark:text-gray-400'} mt-1 text-sm">${lesson.description}</p>
                </div>
              </div>
              <div class="mt-3 sm:mt-0 sm:ml-4 flex-shrink-0">
                <span class="inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full ${done ? 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30' : 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 group-hover:bg-blue-600 dark:group-hover:bg-blue-500 group-hover:text-white transition-colors'}">
                  ${done ? 'Review' : 'Start'} →
                </span>
              </div>
            </div>
          </a>
        `;
      }).join('');

      return `
        <div class="relative border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-3xl shadow-sm mb-5 overflow-hidden">
          <button type="button" onclick="App.toggleCourse('${course.id}')" class="w-full flex items-center justify-between px-6 py-5 text-left">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.18em] text-blue-500 dark:text-blue-400">${course.title.split(':')[0].trim()}</p>
              <h2 class="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white">${course.title.replace(`${course.title.split(':')[0]}: `, '')}</h2>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">${course.goal}</p>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-sm font-bold text-gray-500 dark:text-gray-400">${course.lessons.length} lessons</span>
              <svg class="course-toggle-icon w-6 h-6 text-gray-500 dark:text-gray-400 transition-transform duration-200" data-course-icon="${course.id}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </div>
          </button>
          <div id="course-${course.id}" class="${isOpen} px-4 pb-4 pt-1 space-y-2">
            ${lessonCards}
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="max-w-5xl mx-auto py-12 px-4 relative">
        <h1 class="text-4xl font-black mb-4 text-slate-950 dark:text-white tracking-[-0.05em]">Flutter Masterclass</h1>
        <p class="readable-copy text-xl mb-8 text-slate-700 dark:text-slate-300">Follow the structured path below, one course at a time.</p>
        <div class="space-y-3 relative pt-2 stagger">
          ${coursesHtml}
        </div>
      </div>
    `;
  },

  toggleCourse(courseId) {
    const panel = document.getElementById(`course-${courseId}`);
    const icon = document.querySelector(`[data-course-icon="${courseId}"]`);
    if (!panel || !icon) return;

    const isOpen = !panel.classList.contains('hidden');
    panel.classList.toggle('hidden');
    icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
  },

  renderLesson(container, id) {
    const lesson = FLUTTER_LESSONS.find(l => l.id === id);
    if (!lesson) { container.innerHTML = `<h2 class="text-2xl text-center mt-10 text-gray-900 dark:text-white">Lesson not found</h2>`; return; }
    const done       = Store.isLessonComplete(id);
    const bookmarked = Store.isBookmarked(id);
    const idx        = FLUTTER_LESSONS.findIndex(l => l.id === id);
    const next       = FLUTTER_LESSONS[idx + 1];

    container.innerHTML = `
      <div class="max-w-3xl mx-auto py-10 px-4">
        <div class="flex justify-between items-center mb-8">
          <a href="#/roadmap" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center gap-1 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Back to Roadmap
          </a>
          <button onclick="App.toggleBookmark('${id}')" class="${bookmarked ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'} hover:text-yellow-500 focus:outline-none transition transform hover:scale-110 relative" title="Bookmark">
            <svg class="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
          </button>
        </div>

        <h1 class="text-5xl font-black mb-10 tracking-[-0.06em] text-slate-950 dark:text-white">${lesson.title}</h1>

        <div class="prose prose-lg dark:prose-invert max-w-none mb-12 readable-copy">
          ${lesson.content}
        </div>

        <div class="flex flex-col sm:flex-row justify-between items-center border-t border-gray-200 dark:border-gray-800 pt-8 gap-4">
          <a href="#/quiz/${id}" class="${done
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 border border-green-200 dark:border-green-800'
            : 'bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 border border-transparent'
          } px-8 py-4 rounded-full font-bold shadow-sm transition w-full sm:w-auto text-center">
            ${done ? '✓ Completed — Retake Quiz' : 'Take Quiz to Complete'}
          </a>
          ${done && next ? `
            <a href="#/lesson/${next.id}" class="text-blue-600 dark:text-blue-400 font-bold hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-2 group w-full sm:w-auto justify-center sm:justify-end">
              Next: ${next.title}
              <svg class="w-5 h-5 transform group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </a>
          ` : ''}
        </div>
      </div>
    `;
  },

  renderQuiz(container, id) {
    const lesson = FLUTTER_LESSONS.find(l => l.id === id);
    if (!lesson) { container.innerHTML = `<h2 class="text-2xl text-center mt-10 text-gray-900 dark:text-white">Quiz not found</h2>`; return; }

    container.innerHTML = `
      <div class="max-w-3xl mx-auto py-12 px-4">
        <div class="mb-8">
          <a href="#/lesson/${id}" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center gap-1 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Back to Lesson
          </a>
        </div>

        <div class="bg-white dark:bg-gray-900 border-2 border-indigo-50 dark:border-indigo-900/50 rounded-3xl p-8 shadow-xl">
          <h1 class="text-3xl font-extrabold mb-2 text-indigo-900 dark:text-indigo-300">Quiz: ${lesson.title}</h1>
          <p class="mb-8 text-gray-500 dark:text-gray-400 font-medium">Answer correctly to mark this lesson as complete.</p>

          <h3 class="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">${lesson.practice.question}</h3>

          <div class="space-y-4">
            ${lesson.practice.options.map((opt, i) => `
              <label class="flex items-center p-5 border-2 border-gray-100 dark:border-gray-800 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer transition group">
                <input type="radio" name="practice_q" value="${i}" class="w-5 h-5 text-indigo-600 border-gray-300 dark:border-gray-600 focus:ring-indigo-500">
                <span class="ml-4 font-medium text-gray-700 dark:text-gray-200 text-lg">${opt}</span>
              </label>
            `).join('')}
          </div>

          <div class="mt-8 flex items-center gap-4">
            <button onclick="App.checkQuizAnswer('${id}', ${lesson.practice.answer})"
              class="bg-indigo-600 dark:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition shadow-md w-full sm:w-auto">
              Check Answer
            </button>
            <div id="quiz_feedback_${id}" class="text-lg font-bold"></div>
          </div>

          <div id="quiz_success_actions_${id}" class="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 hidden">
            <button onclick="App.markCompleteAndNext('${id}')"
              class="bg-green-500 dark:bg-green-600 text-white px-8 py-4 rounded-full font-bold hover:bg-green-600 dark:hover:bg-green-700 transition shadow-md w-full flex justify-center items-center gap-2">
              Mark as Complete & Continue
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  checkQuizAnswer(lessonId, correctAnswer) {
    const selected  = document.querySelector('input[name="practice_q"]:checked');
    const feedback  = document.getElementById(`quiz_feedback_${lessonId}`);
    const actions   = document.getElementById(`quiz_success_actions_${lessonId}`);
    if (!selected) {
      feedback.textContent = 'Please select an option first.';
      feedback.className = 'text-lg font-bold text-red-500 dark:text-red-400';
      actions.classList.add('hidden');
      return;
    }
    if (parseInt(selected.value) === correctAnswer) {
      feedback.innerHTML = '<span class="quiz-success-emoji-wrap"><span class="quiz-success-emoji">🎉</span></span> Correct! Great job.';
      feedback.className = 'text-lg font-bold text-green-600 dark:text-green-400';
      actions.classList.remove('hidden');
    } else {
      feedback.textContent = '❌ Incorrect. Try again!';
      feedback.className = 'text-lg font-bold text-red-500 dark:text-red-400';
      actions.classList.add('hidden');
    }
  },

  markCompleteAndNext(id) {
    if (!Store.getUser()) { alert('Please login to save your progress.'); window.location.hash = '#/login'; return; }
    Store.markLessonComplete(id);
    const idx  = FLUTTER_LESSONS.findIndex(l => l.id === id);
    const next = FLUTTER_LESSONS[idx + 1];
    window.location.hash = next ? `#/lesson/${next.id}` : '#/roadmap';
  },

  toggleBookmark(id) {
    if (!Store.getUser()) { alert('Please login to bookmark lessons.'); window.location.hash = '#/login'; return; }
    Store.toggleBookmark(id);

    const appContainer = document.getElementById('app');
    const isLessonPage = appContainer && window.location.hash === `#/lesson/${id}`;

    if (isLessonPage) {
      this.renderLesson(appContainer, id);
      this.renderNavbar();

      requestAnimationFrame(() => {
        const btn = appContainer.querySelector('button[title="Bookmark"]');
        if (btn) {
          btn.classList.remove('bookmark-spark');
          void btn.offsetWidth;
          btn.classList.add('bookmark-spark');
          setTimeout(() => btn.classList.remove('bookmark-spark'), 520);
        }
      });
      return;
    }

    this.renderNavbar();
    requestAnimationFrame(() => {
      const btn = document.querySelector('button[title="Bookmark"]');
      if (btn) {
        btn.classList.remove('bookmark-spark');
        void btn.offsetWidth;
        btn.classList.add('bookmark-spark');
        setTimeout(() => btn.classList.remove('bookmark-spark'), 520);
      }
    });
  },

  renderLogin(container) {
    container.innerHTML = `
      <div class="min-h-[70vh] flex items-center justify-center py-12 px-4">
        <div class="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-10 rounded-3xl shadow-xl">
          <h2 class="text-center text-3xl font-black text-gray-900 dark:text-white">Welcome Back</h2>
          <p class="mt-2 text-center text-gray-500 dark:text-gray-400">Sign in to track your Flutter progress</p>
          <form class="mt-8 space-y-4" onsubmit="event.preventDefault(); App.processLogin();">
            <input id="username" type="text" required placeholder="Username (Any name)"
              class="block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
            <input id="password" type="password" required placeholder="Password (Any password)"
              class="block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
            <button type="submit"
              class="w-full flex justify-center py-3 px-4 rounded-xl text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 font-bold text-lg transition shadow-md mt-2">
              Sign in
            </button>
          </form>
        </div>
      </div>
    `;
  },

  processLogin() {
    const username = document.getElementById('username').value;
    Store.login(username);
    window.location.hash = '#/dashboard';
  },

  renderDashboard(container) {
    const user = Store.getUser();
    if (!user) { window.location.hash = '#/login'; return; }
    const completed = Store.getCompletedLessons();
    const bookmarks = Store.getBookmarks();
    const pct = Math.round((completed.length / FLUTTER_LESSONS.length) * 100) || 0;

    container.innerHTML = `
      <div class="max-w-5xl mx-auto py-12 px-4">
        <h1 class="text-4xl font-black mb-8 text-slate-950 dark:text-white tracking-[-0.05em]">Dashboard</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div class="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-900 p-8 rounded-3xl shadow-lg text-white">
            <h2 class="text-2xl font-bold mb-2">Hello, ${user.username}!</h2>
            <p class="text-blue-100 mb-8">Here is your learning progress</p>
            <div class="flex items-end gap-3 mb-2">
              <span class="text-5xl font-black">${pct}%</span>
              <span class="text-blue-100 font-medium mb-1">Completed</span>
            </div>
            <div class="w-full bg-black/20 rounded-full h-3 mt-4">
              <div class="bg-white h-3 rounded-full" style="width:${pct}%"></div>
            </div>
            <p class="text-sm mt-3 text-blue-100">${completed.length} of ${FLUTTER_LESSONS.length} lessons finished</p>
          </div>

          <div class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-3xl shadow-sm">
            <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <svg class="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/></svg>
              Your Bookmarks
            </h2>
            ${bookmarks.length === 0
              ? '<p class="text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl text-center font-medium">No bookmarks yet.</p>'
              : `<ul class="space-y-4">${bookmarks.map(id => {
                  const l = FLUTTER_LESSONS.find(x => x.id === id);
                  return l ? `
                    <li>
                      <a href="#/lesson/${id}" class="group flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 transition border border-transparent hover:border-blue-100 dark:hover:border-blue-900">
                        <span class="font-bold text-gray-700 dark:text-gray-200 group-hover:text-blue-700 dark:group-hover:text-blue-400">${l.title}</span>
                        <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                      </a>
                    </li>
                  ` : '';
                }).join('')}</ul>`
            }
          </div>
        </div>
      </div>
    `;
  },

  renderProject(container) {
    container.innerHTML = `
      <div class="max-w-4xl mx-auto py-12 px-4">
        <h1 class="text-4xl font-black mb-8 text-slate-950 dark:text-white tracking-[-0.05em]">Capstone Project</h1>
        <div class="soft-panel bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10">
          <h2 class="text-3xl font-black mb-4 text-blue-700 dark:text-blue-400 tracking-[-0.05em]">Build a Task Manager App</h2>
          <p class="readable-copy text-xl mb-8 text-slate-700 dark:text-slate-300">Apply everything you've learned to build a fully functional Task Manager application in Flutter.</p>
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-6 mb-8">
            <h3 class="text-xl font-bold mb-4 text-blue-900 dark:text-blue-300">Requirements:</h3>
            <ul class="space-y-4 text-gray-800 dark:text-gray-200 font-medium">
              <li class="flex items-start">
                <svg class="w-6 h-6 text-blue-500 dark:text-blue-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>Use <code class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-1.5 py-0.5 rounded text-sm">ListView.builder</code> to display a list of tasks.</span>
              </li>
              <li class="flex items-start">
                <svg class="w-6 h-6 text-blue-500 dark:text-blue-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>Implement <code class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-1.5 py-0.5 rounded text-sm">StatefulWidget</code> to handle adding and completing tasks.</span>
              </li>
              <li class="flex items-start">
                <svg class="w-6 h-6 text-blue-500 dark:text-blue-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>Use <code class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-1.5 py-0.5 rounded text-sm">Row</code>, <code class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-1.5 py-0.5 rounded text-sm">Column</code>, and <code class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-1.5 py-0.5 rounded text-sm">Container</code> for layout.</span>
              </li>
            </ul>
          </div>
          <button class="bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-500 px-8 py-4 rounded-xl font-bold cursor-not-allowed">
            Submit Project (Coming Soon)
          </button>
        </div>
      </div>
    `;
  }
};

document.addEventListener('DOMContentLoaded', () => { App.init(); });
