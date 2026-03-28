import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CeMmDateTime } from '../../core/myanmar-calendar';

@Component({
  selector: 'app-eng-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './eng-calendar.html'
})
export class EngCalendarComponent {
  currentDate = signal(new Date());
  selectedDay = signal<any>(null);

  years = Array.from({ length: 201 }, (_, i) => new Date().getFullYear() - 100 + i);
  months = [
    { value: 0, name: 'January' }, { value: 1, name: 'February' }, { value: 2, name: 'March' },
    { value: 3, name: 'April' }, { value: 4, name: 'May' }, { value: 5, name: 'June' },
    { value: 6, name: 'July' }, { value: 7, name: 'August' }, { value: 8, name: 'September' },
    { value: 9, name: 'October' }, { value: 10, name: 'November' }, { value: 11, name: 'December' }
  ];

  selectedYear = signal(new Date().getFullYear());
  selectedMonth = signal(new Date().getMonth());

  monthName = computed(() => {
    return this.currentDate().toLocaleString('default', { month: 'long', year: 'numeric' });
  });

  onFilterChange() {
    this.currentDate.set(new Date(this.selectedYear(), this.selectedMonth(), 1));
  }

  days = computed(() => {
    const d = this.currentDate();
    const year = d.getFullYear();
    const month = d.getMonth();

    // First day of month
    const firstDay = new Date(year, month, 1);
    const startingDay = firstDay.getDay(); // 0 = Sunday

    // Days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarDays = [];

    // Padding for previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      calendarDays.push({
        num: prevMonthLastDay - i,
        isPadding: true,
        date: new Date(year, month - 1, prevMonthLastDay - i)
      });
    }

    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const jd = date.getTime() / 86400000 + 2440587.5;
      const tz = -date.getTimezoneOffset() / 60.0;
      const mm = new CeMmDateTime(jd, tz);

      calendarDays.push({
        num: i,
        isPadding: false,
        isToday: this.isToday(date),
        date: date,
        mm: mm
      });
    }

    return calendarDays;
  });

  private isToday(d: Date): boolean {
    const today = new Date();
    return d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();
  }

  nextMonth() {
    const d = this.currentDate();
    const newDate = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    this.currentDate.set(newDate);
    this.selectedYear.set(newDate.getFullYear());
    this.selectedMonth.set(newDate.getMonth());
  }

  prevMonth() {
    const d = this.currentDate();
    const newDate = new Date(d.getFullYear(), d.getMonth() - 1, 1);
    this.currentDate.set(newDate);
    this.selectedYear.set(newDate.getFullYear());
    this.selectedMonth.set(newDate.getMonth());
  }
}
