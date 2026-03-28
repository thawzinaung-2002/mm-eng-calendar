import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CeMmDateTime } from '../../core/myanmar-calendar';

@Component({
  selector: 'app-eng-to-mm',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './eng-to-mm.html'
})
export class EngToMmComponent {
  private today = new Date();
  selectedDate = signal(`${this.today.getFullYear()}-${String(this.today.getMonth() + 1).padStart(2, '0')}-${String(this.today.getDate()).padStart(2, '0')}`);
  
  isYearValid = computed(() => {
    const year = this.selectedDate().split('-')[0];
    return year.length === 4;
  });

  mmDate = computed(() => {
    if (!this.isYearValid()) return null;
    const d = new Date(this.selectedDate());
    const tz = -d.getTimezoneOffset() / 60.0;
    const jd = d.getTime() / 86400000 + 2440587.5;
    return new CeMmDateTime(jd, tz, 1); // Forced Gregorian logic (1)
  });
}
