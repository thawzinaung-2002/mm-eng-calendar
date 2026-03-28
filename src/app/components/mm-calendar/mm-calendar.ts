import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CeMmDateTime, CeDateTime } from '../../core/myanmar-calendar';

@Component({
  selector: 'app-mm-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mm-calendar.html'
})
export class MmCalendarComponent {
  mmYear = signal(1387);
  mmMonth = signal(1); // Tagu

  years = Array.from({ length: 301 }, (_, i) => 1200 + i);
  allMonths = [
    { value: 1, name_my: 'တန်ခူး' },
    { value: 2, name_my: 'ကဆုန်' },
    { value: 3, name_my: 'နယုန်' },
    { value: 0, name_my: 'ပထမဝါဆို' },
    { value: 4, name_my: 'ဒုတိယဝါဆို / ဝါဆို' },
    { value: 5, name_my: 'ဝါခေါင်' },
    { value: 6, name_my: 'တော်သလင်း' },
    { value: 7, name_my: 'သီတင်းကျွတ်' },
    { value: 8, name_my: 'တန်ဆောင်မုန်း' },
    { value: 9, name_my: 'နတ်တော်' },
    { value: 10, name_my: 'ပြာသို' },
    { value: 11, name_my: 'တပို့တွဲ' },
    { value: 12, name_my: 'တပေါင်း' },
  ];

  monthInfo = computed(() => {
    const months = [
      "First Waso", "Tagu", "Kason", "Nayon", "Waso", "Wagaung", "Tawthalin",
      "Thadingyut", "Tazaungmon", "Nadaw", "Pyatho", "Tabodwe", "Tabaung", "Late Tagu", "Late Kason"
    ];
    const months_my = [
      "ပဝါဆို", "တန်ခူး", "ကဆုန်", "နယုန်", "ဝါဆို", "ဝါခေါင်", "တော်သလင်း",
      "သီတင်းကျွတ်", "တန်ဆောင်မုန်း", "နတ်တော်", "ပြာသို", "တပို့တွဲ", "တပေါင်း", "နှောင်းတန်ခူး", "နှောင်းကဆုန်"
    ];
    return { name: months[this.mmMonth()], name_my: months_my[this.mmMonth()] };
  });

  days = computed(() => {
    const year = this.mmYear();
    const month = this.mmMonth();
    
    // Get year type (common, little watat, big watat)
    const myInfo = CeMmDateTime.cal_my(year);
    const mml = CeMmDateTime.cal_mml(month, myInfo.myt);
    
    const calendarDays = [];
    
    // Starting weekday of this Myanmar month
    const firstJdn = CeMmDateTime.m2j(year, month, 1);
    const startingDay = (firstJdn + 2) % 7; // 0=Sat, 1=Sun... 6=Fri
    
    // Day names adjust to match grid (Sun-Sat common grid)
    // Myanmar calendar often starts with Saturday offset check.
    // Let's use standard Sun-Sat grid (0=Sun, 6=Sat)
    const sunSatFirstDay = (firstJdn + 1) % 7; // Sun is 0

    // Padding
    for (let i = 0; i < sunSatFirstDay; i++) {
        calendarDays.push({ isPadding: true });
    }

    for (let i = 1; i <= mml; i++) {
        const jd = CeMmDateTime.m2j(year, month, i);
        const w = CeDateTime.j2w(jd);
        const mm = new CeMmDateTime(jd, 0); // Use integer JDN with 0 tz for exact date alignment
        
        calendarDays.push({
            num: i,
            isPadding: false,
            engDate: new Date(w.y, w.m - 1, w.d),
            mm: mm
        });
    }

    return calendarDays;
  });

  nextMonth() {
    if (this.mmMonth() === 12) {
      this.mmMonth.set(1);
      this.mmYear.update(y => y + 1);
    } else {
      this.mmMonth.update(m => m + 1);
    }
  }

  prevMonth() {
    if (this.mmMonth() === 1) {
      this.mmMonth.set(12);
      this.mmYear.update(y => y - 1);
    } else {
      this.mmMonth.update(m => m - 1);
    }
  }

  toMmDigit(num: number): string {
    const digits = ['၀', '၁', '၂', '၃', '၄', '၅', '၆', '၇', '၈', '၉'];
    return num.toString().split('').map(d => digits[parseInt(d)]).join('');
  }
}

