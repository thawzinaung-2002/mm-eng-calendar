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
  private today = new CeMmDateTime();
  mmYear = signal(this.today.my);
  mmMonth = signal(this.today.mm);
  mmDay = signal(this.today.mf);
  mmPhase = signal(this.today.mp > 1 ? 2 : 0); // Normalize to Waxing (0) or Waning (2)

  allMonths = computed(() => {
    const list = [
      { id: 1, name_my: 'တန်ခူး' },
      { id: 2, name_my: 'ကဆုန်' },
      { id: 3, name_my: 'နယုန်' },
      { id: 0, name_my: 'ပထမဝါဆို' },
      { id: 4, name_my: 'ဒုတိယဝါဆို / ဝါဆို' },
      { id: 5, name_my: 'ဝါခေါင်' },
      { id: 6, name_my: 'တော်သလင်း' },
      { id: 7, name_my: 'သီတင်းကျွတ်' },
      { id: 8, name_my: 'တန်ဆောင်မုန်း' },
      { id: 9, name_my: 'နတ်တော်' },
      { id: 10, name_my: 'ပြာသို' },
      { id: 11, name_my: 'တပို့တွဲ' },
      { id: 12, name_my: 'တပေါင်း' },
    ];
    
    // Support Late Tagu/Kason if needed
    if (this.mmMonth() === 13) list.push({ id: 13, name_my: 'တန်ခူး (နှောင်း)' });
    if (this.mmMonth() === 14) list.push({ id: 14, name_my: 'ကဆုန် (နှောင်း)' });
    
    return list;
  });

  phases = [
    { id: 0, name_my: 'လဆန်း' },
    { id: 2, name_my: 'လဆုတ်' }
  ];

  isYearValid = computed(() => {
    return this.mmYear().toString().length === 4;
  });

  mmDateTime = computed(() => {
    if (!this.isYearValid()) return null as any;
    // Determine the day of month (1-30) based on fortnight day and phase
    const myInfo = CeMmDateTime.cal_my(this.mmYear());
    const md = CeMmDateTime.cal_md(this.mmDay(), this.mmPhase(), this.mmMonth(), myInfo.myt);
    const jd = CeMmDateTime.m2j(this.mmYear(), this.mmMonth(), md);
    return new CeMmDateTime(jd, 0, 1); // Forced Gregorian logic (1)
  });

  engDate = computed(() => {
    if (!this.mmDateTime()) return null;
    const jd = this.mmDateTime().jd;
    const w = CeDateTime.j2w(jd);
    return new Date(w.y, w.m - 1, w.d);
  });
}
