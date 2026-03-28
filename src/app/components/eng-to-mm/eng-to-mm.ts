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
  selectedDate = signal(new Date().toISOString().split('T')[0]);

  mmDate = computed(() => {
    const d = new Date(this.selectedDate());
    const jd = d.getTime() / 86400000 + 2440587.5;
    const tz = -d.getTimezoneOffset() / 60.0;
    return new CeMmDateTime(jd, tz);
  });
}
