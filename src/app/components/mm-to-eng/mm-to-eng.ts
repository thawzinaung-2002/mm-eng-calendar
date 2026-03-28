import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CeMmDateTime, CeDateTime } from '../../core/myanmar-calendar';

@Component({
  selector: 'app-mm-to-eng',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mm-to-eng.html'
})
export class MmToEngComponent {
  mmYear = signal(1387);
  mmMonth = signal(1); // Tagu
  mmDay = signal(1);
  mmPhase = signal(0); // 0=Waxing, 1=Full Moon, 2=Waning, 3=New Moon

  months = [
    { id: 1, name: 'Tagu', name_my: 'တန်ခူး' },
    { id: 2, name: 'Kason', name_my: 'ကဆုန်' },
    { id: 3, name: 'Nayon', name_my: 'နယုန်' },
    { id: 4, name: 'Waso', name_my: 'ဝါဆို' },
    { id: 5, name: 'Wagaung', name_my: 'ဝါခေါင်' },
    { id: 6, name: 'Tawthalin', name_my: 'တော်သလင်း' },
    { id: 7, name: 'Thadingyut', name_my: 'သီတင်းကျွတ်' },
    { id: 8, name: 'Tazaungmon', name_my: 'တန်ဆောင်မုန်း' },
    { id: 9, name: 'Nadaw', name_my: 'နတ်တော်' },
    { id: 10, name: 'Pyatho', name_my: 'ပြာသို' },
    { id: 11, name: 'Tabodwe', name_my: 'တပို့တွဲ' },
    { id: 12, name: 'Tabaung', name_my: 'တပေါင်း' },
  ];

  phases = [
    { id: 0, name_my: 'လဆန်း' },
    { id: 2, name_my: 'လဆုတ်' }
  ];

  mmDateTime = computed(() => {
    // Determine the day of month (1-30) based on fortnight day and phase
    const myInfo = CeMmDateTime.cal_my(this.mmYear());
    const md = CeMmDateTime.cal_md(this.mmDay(), this.mmPhase(), this.mmMonth(), myInfo.myt);
    const jd = CeMmDateTime.m2j(this.mmYear(), this.mmMonth(), md);
    return new CeMmDateTime(jd, 0); // Use integer JDN with 0 tz for exact mapping
  });

  engDate = computed(() => {
    const jd = this.mmDateTime().jd;
    const w = CeDateTime.j2w(jd);
    return new Date(w.y, w.m - 1, w.d);
  });
}
