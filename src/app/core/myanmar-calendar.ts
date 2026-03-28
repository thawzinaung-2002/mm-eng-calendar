/**
 * Myanmar Calendar Logic (ceMmDateTime port to TypeScript)
 * Based on Yan Naing Aye's ceMmDateTime.js (MIT License)
 * Includes both Gregorian <-> Julian Day <-> Myanmar Calendar conversions.
 */

export class CeDateTime {
  m_jd: number;
  m_tz: number;
  m_ct: number;
  m_SG: number;

  constructor(jd?: number, tz?: number, ct: number = 0, SG: number = 2361222) {
    this.m_tz = tz === undefined ? CeDateTime.ltzoh() : tz;
    this.m_jd = jd === undefined ? CeDateTime.jdnow() : jd;
    this.m_ct = ct; // 0=British, 1=Gregorian, 2=Julian
    this.m_SG = SG; // Beginning of Gregorian calendar in JDN [default=2361222]
  }

  static j2w(jd: number, ct: number = 0, SG: number = 2361222) {
    let j, jf, y, m, d, h, n, s;
    if (ct === 2 || (ct === 0 && jd < SG)) {
      let b, c, f, e;
      j = Math.floor(jd + 0.5);
      jf = jd + 0.5 - j;
      b = j + 1524;
      c = Math.floor((b - 122.1) / 365.25);
      f = Math.floor(365.25 * c);
      e = Math.floor((b - f) / 30.6001);
      m = e > 13 ? e - 13 : e - 1;
      d = b - f - Math.floor(30.6001 * e);
      y = m < 3 ? c - 4715 : c - 4716;
    } else {
      j = Math.floor(jd + 0.5);
      jf = jd + 0.5 - j;
      j -= 1721119;
      y = Math.floor((4 * j - 1) / 146097);
      j = 4 * j - 1 - 146097 * y;
      d = Math.floor(j / 4);
      j = Math.floor((4 * d + 3) / 1461);
      d = 4 * d + 3 - 1461 * j;
      d = Math.floor((d + 4) / 4);
      m = Math.floor((5 * d - 3) / 153);
      d = 5 * d - 3 - 153 * m;
      d = Math.floor((d + 5) / 5);
      y = 100 * y + j;
      if (m < 10) m += 3;
      else {
        m -= 9;
        y = y + 1;
      }
    }
    jf *= 24;
    h = Math.floor(jf);
    jf = (jf - h) * 60;
    n = Math.floor(jf);
    s = (jf - n) * 60;
    return { y, m, d, h, n, s };
  }

  static t2d(h: number, n: number, s: number) {
    return (h - 12) / 24 + n / 1440 + s / 86400;
  }

  static w2j(y: number, m: number, d: number, h: number = 12, n: number = 0, s: number = 0, ct: number = 0, SG: number = 2361222) {
    let a = Math.floor((14 - m) / 12);
    y = y + 4800 - a;
    m = m + 12 * a - 3;
    let jd = d + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4);
    if (ct === 1) jd = jd - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    else if (ct === 2) jd = jd - 32083;
    else {
      jd = jd - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
      if (jd < SG) {
        jd = d + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
        if (jd > SG) jd = SG;
      }
    }
    return jd + CeDateTime.t2d(h, n, s);
  }

  static jdnow() {
    let dt = new Date();
    return dt.getTime() / 86400000 + 2440587.5;
  }

  static ltzoh() {
    return -new Date().getTimezoneOffset() / 60.0;
  }

  get jd() { return this.m_jd; }
  get jdl() { return this.m_jd + this.m_tz / 24.0; }
  get jdnl() { return Math.round(this.jdl); }
}

export class CeMmDateTime extends CeDateTime {
  m_syt: number;

  constructor(jd?: number, tz?: number, ct: number = 0, SG: number = 2361222, syt: number = 0) {
    super(jd, tz, ct, SG);
    this.m_syt = syt;
  }

  static GetMyConst(my: number) {
    let EI: number, WO: number, NM: number, EW: number = 0;
    let fme: number[][] = [];
    let wte: number[] = [];

    if (my >= 1312) {
      EI = 3; WO = -0.5; NM = 8;
      fme = [[1377, 1]];
      wte = [1344, 1345];
    } else if (my >= 1217) {
      EI = 2; WO = -1; NM = 4;
      fme = [[1234, 1], [1261, -1]];
      wte = [1263, 1264];
    } else if (my >= 1100) {
      EI = 1.3; WO = -0.85; NM = -1;
      fme = [[1120, 1], [1126, -1], [1150, 1], [1172, -1], [1207, 1]];
      wte = [1201, 1202];
    } else if (my >= 798) {
      EI = 1.2; WO = -1.1; NM = -1;
      fme = [[813, -1], [849, -1], [851, -1], [854, -1], [927, -1], [933, -1], [936, -1], [938, -1], [949, -1], [952, -1], [963, -1], [968, -1], [1039, -1]];
    } else {
      EI = 1.1; WO = -1.1; NM = -1;
      fme = [[205, 1], [246, 1], [471, 1], [572, -1], [651, 1], [653, 2], [656, 1], [672, 1], [729, 1], [767, -1]];
    }

    let search2 = (k: number, A: number[][]) => {
      let l = 0, u = A.length - 1;
      while (u >= l) {
        let i = Math.floor((l + u) / 2);
        if (A[i][0] > k) u = i - 1;
        else if (A[i][0] < k) l = i + 1;
        else return i;
      }
      return -1;
    };

    let search1 = (k: number, A: number[]) => {
      let l = 0, u = A.length - 1;
      while (u >= l) {
        let i = Math.floor((l + u) / 2);
        if (A[i] > k) u = i - 1;
        else if (A[i] < k) l = i + 1;
        else return i;
      }
      return -1;
    };

    let idx2 = search2(my, fme);
    if (idx2 >= 0) WO += fme[idx2][1];
    let idx1 = search1(my, wte);
    if (idx1 >= 0) EW = 1;

    return { EI, WO, NM, EW };
  }

  static cal_watat(my: number) {
    let SY = 1577917828.0 / 4320000.0;
    let LM = 1577917828.0 / 53433336.0;
    let MO = 1954168.050623;
    let c = CeMmDateTime.GetMyConst(my);
    let TA = (SY / 12 - LM) * (12 - c.NM);
    let ed = (SY * (my + 3739)) % LM;
    if (ed < TA) ed += LM;
    let fm = Math.round(SY * my + MO - ed + 4.5 * LM + c.WO);
    let watat = 0;
    if (c.EI >= 2) {
      let TW = LM - (SY / 12 - LM) * c.NM;
      if (ed >= TW) watat = 1;
    } else {
      watat = (my * 7 + 2) % 19;
      if (watat < 0) watat += 19;
      watat = Math.floor(watat / 12);
    }
    watat ^= c.EW;
    return { fm, watat };
  }

  static cal_my(my: number) {
    let yd = 0, y1, myt, fm, tg1;
    let y2 = CeMmDateTime.cal_watat(my);
    myt = y2.watat;
    do {
      yd++;
      y1 = CeMmDateTime.cal_watat(my - yd);
    } while (y1.watat === 0 && yd < 3);
    if (myt) {
      let nd = (y2.fm - y1.fm) % 354;
      myt = Math.floor(nd / 31) + 1;
      fm = y2.fm;
    } else {
      fm = y1.fm + 354 * yd;
    }
    tg1 = y1.fm + 354 * yd - 102;
    return { myt, tg1, fm };
  }

  static j2m(jdn: number) {
    jdn = Math.round(jdn);
    let SY = 1577917828.0 / 4320000.0;
    let MO = 1954168.050623;
    let my = Math.floor((jdn - 0.5 - MO) / SY);
    let yo = CeMmDateTime.cal_my(my);
    let dd = jdn - yo.tg1 + 1;
    let b = Math.floor(yo.myt / 2);
    let c = Math.floor(1 / (yo.myt + 1));
    let myl = 354 + (1 - c) * 30 + b;
    let mmt = Math.floor((dd - 1) / myl);
    dd -= mmt * myl;
    let a = Math.floor((dd + 423) / 512);
    let mm = Math.floor((dd - b * a + c * a * 30 + 29.26) / 29.544);
    let e = Math.floor((mm + 12) / 16);
    let f = Math.floor((mm + 11) / 16);
    let md = dd - Math.floor(29.544 * mm - 29.26) - b * e + c * f * 30;
    mm += f * 3 - e * 4 + 12 * mmt;
    return { myt: yo.myt, my, mm, md };
  }

  static m2j(my: number, mm: number, md: number) {
    let yo = CeMmDateTime.cal_my(my);
    let mmt = Math.floor(mm / 13);
    mm = mm % 13 + mmt;
    let b = Math.floor(yo.myt / 2);
    let c = 1 - Math.floor((yo.myt + 1) / 2);
    mm += 4 - Math.floor((mm + 15) / 16) * 4 + Math.floor((mm + 12) / 16);
    let dd = md + Math.floor(29.544 * mm - 29.26) - c * Math.floor((mm + 11) / 16) * 30 + b * Math.floor((mm + 12) / 16);
    let myl = 354 + (1 - c) * 30 + b;
    dd += mmt * myl;
    return dd + yo.tg1 - 1;
  }

  static cal_mp(md: number, mm: number, myt: number) {
    let mml = CeMmDateTime.cal_mml(mm, myt);
    return Math.floor((md + 1) / 16) + Math.floor(md / 16) + Math.floor(md / mml);
  }

  static cal_mml(mm: number, myt: number) {
    let mml = 30 - mm % 2;
    if (mm === 3) mml += Math.floor(myt / 2);
    return mml;
  }

  static cal_mf(md: number) {
    return md - 15 * Math.floor(md / 16);
  }

  static cal_md(mf: number, mp: number, mm: number, myt: number) {
    const mml = CeMmDateTime.cal_mml(mm, myt);
    const m1 = mp % 2;
    const m2 = Math.floor(mp / 2);
    return m1 * (15 + m2 * (mml - 15)) + (1 - m1) * (mf + 15 * m2);
  }

  static my2sy(my: number, mm: number, md: number, k: number = 0) {
    let offset = 1182;
    if (k === 1) {
      if (mm >= 13) offset = 1183;
    } else if (k === 2) {
      if (mm === 1 || (mm === 2 && md < 15)) offset = 1181;
    }
    return my + offset;
  }

  get my() { return CeMmDateTime.j2m(this.jdnl).my; }
  get mm() { return CeMmDateTime.j2m(this.jdnl).mm; }
  get md() { return CeMmDateTime.j2m(this.jdnl).md; }
  get myt() { return CeMmDateTime.j2m(this.jdnl).myt; }
  get mp() {
    let m = CeMmDateTime.j2m(this.jdnl);
    return CeMmDateTime.cal_mp(m.md, m.mm, m.myt);
  }
  get mf() { return CeMmDateTime.cal_mf(this.md); }

  get mm_name() {
    return [
      "First Waso", "Tagu", "Kason", "Nayon", "Waso", "Wagaung", "Tawthalin",
      "Thadingyut", "Tazaungmon", "Nadaw", "Pyatho", "Tabodwe", "Tabaung", "Late Tagu", "Late Kason"
    ][this.mm];
  }

  get mm_name_my() {
    return [
      "ပဝါဆို", "တန်ခူး", "ကဆုန်", "နယုန်", "ဝါဆို", "ဝါခေါင်", "တော်သလင်း",
      "သီတင်းကျွတ်", "တန်ဆောင်မုန်း", "နတ်တော်", "ပြာသို", "တပို့တွဲ", "တပေါင်း", "နှောင်းတန်ခူး", "နှောင်းကဆုန်"
    ][this.mm];
  }

  get mp_name() {
    return ["Waxing", "Full Moon", "Waning", "New Moon"][this.mp];
  }

  get mp_name_my() {
    return ["လဆန်း", "လပြည့်", "လဆုတ်", "လကွယ်"][this.mp];
  }

  get rasi_my() {
    const w = CeDateTime.j2w(this.jdnl);
    return CeMmDateTime.getZodiacCalc(w.m, w.d).my;
  }

  get rasi() {
    const w = CeDateTime.j2w(this.jdnl);
    return CeMmDateTime.getZodiacCalc(w.m, w.d).eng;
  }

  static getZodiacCalc(m: number, d: number) {
    if ((m === 1 && d <= 19) || (m === 12 && d >= 22)) return { eng: "Capricorn", my: "မကာရ" };
    if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return { eng: "Aquarius", my: "ကုံ" };
    if ((m === 2 && d >= 19) || (m === 3 && d <= 20)) return { eng: "Pisces", my: "မိန်" };
    if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return { eng: "Aries", my: "မိဿ" };
    if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return { eng: "Taurus", my: "ပြိဿ" };
    if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return { eng: "Gemini", my: "မေထုန်" };
    if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return { eng: "Cancer", my: "ကရကဋ်" };
    if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return { eng: "Leo", my: "သိဟ်" };
    if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return { eng: "Virgo", my: "ကန်" };
    if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return { eng: "Libra", my: "တူ" };
    if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return { eng: "Scorpio", my: "ဗြိစ္ဆာ" };
    if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return { eng: "Sagittarius", my: "ဓနု" };
    return { eng: "", my: "" };
  }

  get animal_sign_my() {
    // 0=sat, 1=sun, 2=mon, 3=tue, 4=wed, 5=thu, 6=fri
    const wd = (this.jdnl + 2) % 7;
    return ["နဂါး", "ဂဠုန်", "ကျား", "ခြင်္သေ့", "ဆင်", "ကြွက်", "ပူး"][wd];
  }

  get animal_sign() {
    const wd = (this.jdnl + 2) % 7;
    return ["Dragon (Naga)", "Garuda", "Tiger", "Lion", "Elephant", "Rat", "Guinea Pig"][wd];
  }

  get weekday_my() {
    const wd = (this.jdnl + 2) % 7;
    return ["စနေ", "တနင်္ဂနွေ", "တနင်္လာ", "အင်္ဂါ", "ဗုဒ္ဓဟူး", "ကြာသပတေး", "သောကြာ"][wd];
  }

  get weekday() {
    const wd = (this.jdnl + 2) % 7;
    return ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][wd];
  }

  static cal_sabbath(md: number, mm: number, myt: number) {
    let mml = CeMmDateTime.cal_mml(mm, myt);
    if (md === 8 || md === 15 || md === 23 || md === mml) return 1; // Sabbath
    if (md === 7 || md === 14 || md === 22 || md === mml - 1) return 2; // Eve
    return 0;
  }

  get sabbath() {
    let m = CeMmDateTime.j2m(this.jdnl);
    let s = CeMmDateTime.cal_sabbath(m.md, m.mm, m.myt);
    return s === 1 ? "Sabbath" : (s === 2 ? "Sabbath Eve" : "");
  }

  get holiday() {
    const res: string[] = [];
    const m = CeMmDateTime.j2m(this.jdnl);
    const w = CeDateTime.j2w(this.jdnl);
    
    // International / Fixed Gregorian Holidays
    if (w.m === 1 && w.d === 1) res.push("New Year's Day");
    if (w.m === 1 && w.d === 4) res.push("Independence Day");
    if (w.m === 2 && w.d === 12) res.push("Union Day");
    if (w.m === 3 && w.d === 2) res.push("Peasants' Day");
    if (w.m === 3 && w.d === 27) res.push("Armed Forces Day");
    if (w.m === 5 && w.d === 1) res.push("Labour Day");
    if (w.m === 7 && w.d === 19) res.push("Martyrs' Day");
    if (w.m === 12 && w.d === 25) res.push("Christmas Day");

    // Myanmar Lunar Holidays
    if (m.mm === 1) {
      // Need precise Thingyan calculation for real calendar, but we can do simple approximation here if needed
      // Omitting Thingyan for now unless we add full calculation
    }
    if (m.mm === 2 && this.mp === 1) res.push("Buddha Day (Kason)");
    if (m.mm === 4 && this.mp === 1) res.push("Start of Buddhist Lent (Waso)");
    if (m.mm === 7 && this.mp === 1) res.push("Thadingyut Festival");
    if (m.mm === 8 && this.mp === 1) res.push("Tazaungdaing Festival");
    if (m.mm === 8 && m.md === 25) res.push("National Day"); // 10th Waning of Tazaungmon
    
    return res.length > 0 ? res.join(", ") : "";
  }
}
