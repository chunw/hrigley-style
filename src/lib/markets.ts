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
  /** Official website of the market itself, when it has one. The part of the
   * name wrapped in the link is nameLinkTextEn/Zh (default: the whole name). */
  nameUrl?: string;
  nameLinkTextEn?: string;
  nameLinkTextZh?: string;
  /** Official website of the venue organisation. The part of the venue line
   * wrapped in the link is venueLinkTextEn/Zh (default: the whole line). */
  venueUrl?: string;
  venueLinkTextEn?: string;
  venueLinkTextZh?: string;
}

export const MARKET_EVENTS: MarketEvent[] = [
  {
    date: "2026-07-11",
    nameEn: "PopUp Gallery",
    nameZh: "PopUp Gallery",
    venueEn: "The High Line Hotel, New York",
    venueZh: "The High Line Hotel · 纽约",
    venueUrl: "https://www.thehighlinehotel.com/",
    venueLinkTextEn: "The High Line Hotel",
    venueLinkTextZh: "The High Line Hotel",
    timeEn: "11am\u20133pm",
    timeZh: "11:00\u201315:00",
  },
  {
    date: "2026-09-07",
    nameEn: "Outside The Met",
    nameZh: "大都会博物馆前",
    nameUrl: "https://www.metmuseum.org/",
    nameLinkTextEn: "The Met",
    nameLinkTextZh: "大都会博物馆",
    venueEn: "The Metropolitan Museum of Art, New York",
    venueZh: "大都会博物馆 · 纽约",
    venueUrl: "https://www.metmuseum.org/",
    venueLinkTextEn: "The Metropolitan Museum of Art",
    venueLinkTextZh: "大都会博物馆",
    timeEn: "1\u20133pm",
    timeZh: "13:00\u201315:00",
  },
  {
    date: "2026-10-10",
    nameEn: "Lately Market",
    nameZh: "Lately Cafe 本地市集",
    venueEn: "Lately Cafe, Long Island City",
    venueZh: "Lately Cafe · 长岛市",
    nameUrl: "https://www.latelycafelic.com/",
    nameLinkTextZh: "Lately Cafe",
    venueUrl: "https://www.latelycafelic.com/",
    venueLinkTextEn: "Lately Cafe",
    venueLinkTextZh: "Lately Cafe",
    timeEn: "2:30\u20136pm",
    timeZh: "14:30\u201318:00",
  },
  {
    date: "2026-12-05",
    nameEn: "NYC Resistor Holiday Market",
    nameZh: "NYC Resistor 假日市集",
    nameUrl: "https://www.nycresistor.com/",
    nameLinkTextEn: "NYC Resistor",
    nameLinkTextZh: "NYC Resistor",
    venueEn: "Brooklyn",
    venueZh: "布鲁克林",
    timeEn: "11am - 7pm",
    timeZh: "11:00\u201319:00",
  },
];
