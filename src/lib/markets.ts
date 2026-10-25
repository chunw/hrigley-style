/** Studio market & pop-up dates for the About page section.
 * To announce a new date, add an entry (and drop a photo in later when the
 * section gains images). Entries with a date >= today are shown first and
 * badged "Upcoming"; past dates follow, newest first. */
export interface MarketEvent {
  /** ISO date, yyyy-mm-dd */
  date: string;
  nameEn: string;
  nameZh: string;
  venueEn: string;
  venueZh: string;
  timeEn: string;
  timeZh: string;
}

export const MARKET_EVENTS: MarketEvent[] = [
  {
    date: "2026-07-11",
    nameEn: "PopUp Gallery",
    nameZh: "PopUp Gallery",
    venueEn: "The High Line Hotel, New York",
    venueZh: "The High Line Hotel · 纽约",
    timeEn: "11am\u20133pm",
    timeZh: "11:00\u201315:00",
  },
  {
    date: "2026-09-07",
    nameEn: "Outside The Met",
    nameZh: "大都会博物馆前",
    venueEn: "The Metropolitan Museum of Art, New York",
    venueZh: "大都会博物馆 · 纽约",
    timeEn: "1\u20132:50pm",
    timeZh: "13:00\u201314:50",
  },
  {
    date: "2026-10-10",
    nameEn: "Lately Cafe local market",
    nameZh: "Lately Cafe 本地市集",
    venueEn: "Lately Cafe, Long Island City",
    venueZh: "Lately Cafe · 长岛市",
    timeEn: "2:30\u20136pm",
    timeZh: "14:30\u201318:00",
  },
];
