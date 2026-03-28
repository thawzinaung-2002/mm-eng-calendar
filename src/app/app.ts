import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
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

  navLinks = [
    { path: '/', label: 'English Calendar', icon: '📅' },
    { path: '/myanmar-calendar', label: 'Myanmar Calendar', icon: '🕉️' },
    { path: '/eng-to-myanmar', label: 'Eng ➔ MM', icon: '🔄' },
    { path: '/myanmar-to-eng', label: 'MM ➔ Eng', icon: '🔄' },
  ];

  toggleMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }
}
