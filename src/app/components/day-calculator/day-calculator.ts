import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-day-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './day-calculator.html'
})
export class DayCalculatorComponent {
  // Initialize with today's date
  private today = new Date();
  
  startDate = signal<string>(this.formatDate(this.today));
  endDate = signal<string>(this.formatDate(this.today));

  // Validate if years are 4 digits
  isYearValid = computed(() => {
    const startYear = this.startDate().split('-')[0];
    const endYear = this.endDate().split('-')[0];
    return startYear.length === 4 && endYear.length === 4;
  });

  // Calculate difference in days
  daysDifference = computed(() => {
    if (!this.isYearValid()) return null;

    const start = new Date(this.startDate());
    const end = new Date(this.endDate());
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return null;
    }

    // Set times to midnight to ensure accurate day comparison
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const timeDifference = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(timeDifference / (1000 * 3600 * 24));
    
    return days;
  });

  isPastDate = computed(() => {
    if (!this.isYearValid()) return false;
    const start = new Date(this.startDate());
    const end = new Date(this.endDate());
    return start.getTime() > end.getTime();
  });

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
