import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, Event } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Myanmar-English Calendar');
  isMobileMenuOpen = signal(false);
  isLoading = signal(false);

  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.isLoading.set(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        setTimeout(() => this.isLoading.set(false), 300);
      }
    });
  }

  navLinks = [
    { path: '/', label: 'English Calendar', icon: '📅' },
    { path: '/myanmar-calendar', label: 'Myanmar Calendar', icon: '🕉️' },
    { path: '/day-calculator', label: 'Day Calculator', icon: '⏱️' },
    { path: '/eng-to-myanmar', label: 'Eng ➔ MM', icon: '🔄' },
    { path: '/myanmar-to-eng', label: 'MM ➔ Eng', icon: '🔄' },
  ];

  toggleMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }
}
