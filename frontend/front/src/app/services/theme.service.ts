import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private isDarkMode = false;

  constructor() {
    const saved = localStorage.getItem('theme');
    this.isDarkMode = saved === 'dark'
      || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    this.applyTheme();
  }

  get dark(): boolean {
    return this.isDarkMode;
  }

  toggle(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme(): void {
    document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
  }
}
