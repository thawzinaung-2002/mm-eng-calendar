import { Routes } from '@angular/router';
import { EngCalendarComponent } from './components/eng-calendar/eng-calendar';
import { MmCalendarComponent } from './components/mm-calendar/mm-calendar';
import { EngToMmComponent } from './components/eng-to-mm/eng-to-mm';
import { MmToEngComponent } from './components/mm-to-eng/mm-to-eng';
import { DayCalculatorComponent } from './components/day-calculator/day-calculator';

export const routes: Routes = [
  { path: '', component: EngCalendarComponent, title: 'English Calendar' },
  { path: 'myanmar-calendar', component: MmCalendarComponent, title: 'Myanmar Calendar' },
  { path: 'day-calculator', component: DayCalculatorComponent, title: 'Day Calculator' },
  { path: 'eng-to-myanmar', component: EngToMmComponent, title: 'English to Myanmar' },
  { path: 'myanmar-to-eng', component: MmToEngComponent, title: 'Myanmar to English' },
  { path: '**', redirectTo: '' }
];
