// store.js - Manages LocalStorage state for the application

const Store = {
  get(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
  
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  // Auth
  login(username) {
    this.set('user', { username, loggedIn: true });
  },
  
  logout() {
    localStorage.removeItem('user');
  },
  
  getUser() {
    return this.get('user');
  },

  // Progress
  markLessonComplete(lessonId) {
    const completed = this.get('completedLessons') || [];
    if (!completed.includes(lessonId)) {
      completed.push(lessonId);
      this.set('completedLessons', completed);
    }
  },

  isLessonComplete(lessonId) {
    const completed = this.get('completedLessons') || [];
    return completed.includes(lessonId);
  },

  getCompletedLessons() {
    return this.get('completedLessons') || [];
  },

  // Bookmarks
  toggleBookmark(lessonId) {
    const bookmarks = this.get('bookmarks') || [];
    const index = bookmarks.indexOf(lessonId);
    if (index > -1) {
      bookmarks.splice(index, 1);
    } else {
      bookmarks.push(lessonId);
    }
    this.set('bookmarks', bookmarks);
  },

  isBookmarked(lessonId) {
    const bookmarks = this.get('bookmarks') || [];
    return bookmarks.includes(lessonId);
  },
  
  getBookmarks() {
    return this.get('bookmarks') || [];
  }
};
