// The artist's curriculum vitae, closing the book (her direction,
// 2026-11-05: a detailed CV at the very end). Entries are transcribed
// verbatim from her official CV (chunwang.art/assets/Chun_Wang_CV.pdf).
// Scope follows the artist-CV standard agreed when an earlier CV section
// was removed (2026-10-19): education, professional experience in the
// arts, curatorial work, awards, exhibitions, publications, press and
// residencies. Pure engineering employment and volunteer lines from the
// source CV are not carried into the book.

export interface CvEntry {
  years: string;
  text: string;
}

export interface CvSection {
  titleEn: string;
  titleZh: string;
  entries: CvEntry[];
}

export const CV_SECTIONS: CvSection[] = [
  {
    titleEn: "Education",
    titleZh: "教育",
    entries: [
      {
        years: "2019",
        text: "Stanford University, Master of Science, Computer Science\nSpecialized in Human-Computer Interaction & Artificial Intelligence.",
      },
      {
        years: "2014",
        text: "University of Virginia, Bachelor of Science, Computer Science\nGraduated with Highest Distinction. Minor in Applied Mathematics.",
      },
    ],
  },
  {
    titleEn: "Professional Experience",
    titleZh: "职业经历",
    entries: [
      {
        years: "2019–present",
        text: "Founder & Creative Director, Chun Wang Studio, New York, USA",
      },
      {
        years: "2022–2024",
        text: "Lead Creative Technologist & Strategy Researcher, Harvard FAS CAMLab, Cambridge, USA (Remote)",
      },
    ],
  },
  {
    titleEn: "Curatorial Experience",
    titleZh: "策展经历",
    entries: [
      {
        years: "2025–2026",
        text: "The Wrong Biennale 7th Edition | Executive Curator & Developer\nNegotiated Intelligence: Curated and developed an official pavilion exploring human-AI co-creation.",
      },
      {
        years: "2020–2022",
        text: "IMMEMORY: On COVID-19 | Executive Curator & Developer\nWebby Award Official Nominee (2021) by IADAS in the Cultural Blog/Website category.",
      },
    ],
  },
  {
    titleEn: "Awards & Recognition",
    titleZh: "奖项与荣誉",
    entries: [
      {
        years: "2026",
        text: "2026 Global Auspicious Zodiac Design Competition Winner, organized by Central Academy of Fine Arts (China) & Beijing Municipal Bureau of Culture and Tourism\nAwarded work: It’s a Soft Happy Day (illustration), Leap Forward (poster design)",
      },
      {
        years: "2025",
        text: "18th International Color Awards Honorable Mention in Category: Portrait.\nAwarded work: Hours, Minutes, Seconds (photography)",
      },
      {
        years: "2024",
        text: "2024 London International Creative Competition (LICC) Official Selection in Category: Create/Art.\nAwarded work: Remains (Mixed Media series)",
      },
      {
        years: "2024",
        text: "2024 London International Creative Competition (LICC). Shortlist in Category: Photo/Video.\nAwarded work: Scottish Highlands: Heroism of the Vista (photography)",
      },
      {
        years: "2023",
        text: "16th International Color Awards Official Nominee in Category: Portrait.\nAwarded work: In The Lonely Hour (photography)",
      },
      {
        years: "2022",
        text: "2022 International Photography Awards (IPA). Official Selection.\nAwarded work: In The Lonely Hour (photography)",
      },
      {
        years: "2022",
        text: "15th International Color Awards Winner & Honorable Mention in Category: Portrait.\nAwarded work: Self Portrait (photography)",
      },
      {
        years: "2022",
        text: "15th International Color Awards Official Nominee in Category: Portrait.\nAwarded work: Metaphor (photography)",
      },
      {
        years: "2022",
        text: "15th International Color Awards Official Nominee in Category: Fine Art.\nAwarded work: Rebirth (photography)",
      },
      {
        years: "2022",
        text: "2022 Moscow International Foto Award Honorable Mention.\nAwarded work: Self Portrait (photography)",
      },
      {
        years: "2022",
        text: "2022 Moscow International Foto Award Honorable Mention.\nAwarded work: Polaroid Study (photography)",
      },
      {
        years: "2022",
        text: "2022 Passepartout Photo Prize Winner of Catalogue Prize.\nAwarded work: The Other, The Same (photography)",
      },
      {
        years: "2022",
        text: "2022 Siena International Photo Awards Finalist in Category: Fascinating Faces And Characters.\nAwarded work: Self Portrait (photography)",
      },
      {
        years: "2022",
        text: "2021 London International Creative Competition (LICC) Official Selection in Category: Photo/Video.\nAwarded work: The Other, The Same (photography series)",
      },
      {
        years: "2022",
        text: "2021 London International Creative Competition (LICC) Finalist in Category: Create/Art.\nAwarded work: In The Spirit Of The 21st Century (Mixed Media series)",
      },
      {
        years: "2021",
        text: "25th Webby Awards Official Nominee in Category Websites and Mobile Sites: Cultural Blog/Website by the International Academy of Digital Arts & Sciences (IADAS)\nAwarded work: IMMEMORY: ON COVID-19 (Website)",
      },
    ],
  },
  {
    titleEn: "Selected Exhibitions",
    titleZh: "精选展览",
    entries: [
      { years: "2026", text: "Forms Before Dissolving, Apsara Studio Gallery, London, UK" },
      { years: "2026", text: "Leaky Boundaries, LIC Arts Open 13th Edition, New York, USA" },
      { years: "2026", text: "Solo Exhibition, Chun Wang: Visions in Watercolor, Yatou Green Art (Online)" },
      { years: "2026", text: "Fun In Progress, HMVC Gallery, publicly screened in Times Square, New York, USA" },
      {
        years: "2026",
        text: "Global Auspicious Zodiac Design Competition Exhibition, United Nations Headquarters, New York, USA. Organized by the Permanent Mission of the PRC to the UN, Central Academy of Fine Arts (China), Beijing Municipal Bureau of Culture and Tourism, Beijing Contemporary Art Foundation, and Beijing Overseas Cultural Exchange Center.",
      },
      { years: "2025–2026", text: "Negotiated Intelligence Pavilion, The Wrong Biennale 7th Edition" },
      { years: "2025", text: "Significant Colour, PH21 Gallery, Budapest, Hungary" },
      { years: "2023–2024", text: "We Are Sorry to Inform That, Net Art died but is doing well Pavilion, The Wrong Biennale 6th Edition" },
      { years: "2024", text: "Personality: Contemporary Portraiture, PH21 Gallery, Budapest, Hungary" },
      { years: "2023", text: "Creating Beyond Words: Generative AI As An Artist Tool, :iidrr Gallery, New York, USA" },
      { years: "2022", text: "Cave Dance, CAMLab Cave at Harvard University, Cambridge, USA & Online" },
      { years: "2022", text: "İz Dünyası: The Waste Land, co-hosted by Akbank Sanat and Open Dialogue İstanbul, İstanbul, Turkey" },
      { years: "2022", text: "We Are Sorry to Inform That, LAPSUS, Romania | New Art City: Virtual Art Space" },
      { years: "2022", text: "Monochrome, PH21 Gallery, Budapest, Hungary" },
      { years: "2022", text: "Light of Day: Rejects Reconsidered, Lodger Gallery, Kansas City, USA (Online)" },
      { years: "2022", text: "Personality: Contemporary Portraiture, PH21 Gallery, Budapest, Hungary" },
      { years: "2021", text: "LiC-A@Atlantic Spring 2021, Atlantic Gallery, New York, USA" },
      { years: "2021", text: "Artist Residency Exhibition Vol.9, World of Co, Sofia, Bulgaria (Online)" },
      { years: "2021", text: "Artist-in-Residence Exhibition, Dear Artists (Online)" },
      { years: "2020", text: "Imprints: Past & Present, Vacant Museum (Online)" },
      { years: "2020", text: "LIC-A@Atlantic 2020, Atlantic Gallery, New York, USA" },
      {
        years: "2020",
        text: "Stories From The Room, Center for Contemporary Art Kitakyushu, Kitakyushu, Japan | Rockbund Art Museum, Shanghai, China | TarraWarra Museum of Art, Healesville, Australia",
      },
      { years: "2020", text: "COVIDEO-19 NOTES, Undercurrent, New York, USA" },
      { years: "2020", text: "Drawings In A Time of Social Distancing, Plaxall Gallery, New York, USA" },
      { years: "2020", text: "Infected Instructions (Online)" },
      { years: "2019", text: "Stanford Arts Experimental Media Lab Winter Exhibition, Stanford Art Gallery, Stanford, USA" },
      { years: "2018", text: "art.empath.io, SFMOMA (San Francisco Museum of Modern Art), San Francisco, USA" },
      { years: "2018", text: "art.empath.io, Anderson Collection at Stanford University, Stanford, USA" },
      { years: "2018", text: "Stanford Arts Departmental Show, Stanford Art Gallery, Stanford, USA" },
      { years: "2017", text: "Stanford Arts Open Studios, Stanford Art Gallery, Stanford, USA" },
    ],
  },
  {
    titleEn: "Publications",
    titleZh: "出版",
    entries: [
      { years: "2026", text: "DOCU Magazine, Special Edition: Chun Wang" },
      { years: "2026", text: "Artsin Square, 5x7 Photobook Vol. 2, Featured Artist" },
      { years: "2025", text: "Artsin Square, 5x7 Photobook Vol. 1, Featured Artist\nISBN: 978-1-0694811-0-8" },
      { years: "2022", text: "Passepartout Prize, 2021 Passepartout Photo Prize Catalogue, Catalogue Prize Winner\nISBN: 978-88-942678-9-1" },
      {
        years: "2016–2019",
        text: "SFMOMA (San Francisco Museum of Modern Art), Submission Friday series, 7-time Featured Artist\nFeatured work: This World, The Untold Story II, The Global Warming, Feminism: A Contradiction, Reflections In The Death Valley, Pre-iPhone Era, Decay",
      },
      { years: "2018", text: "Stanford Women’s Community Center, 2017-18 Feminist Narratives, Featured Artist" },
    ],
  },
  {
    titleEn: "Selected Press",
    titleZh: "精选媒体报道",
    entries: [
      { years: "", text: "Business Insider, “Chinese New Year” Fever Sweeps New York Streets (2026)" },
      { years: "", text: "Ministry of Foreign Affairs, PRC, Galloping Forward with the United Nations (2026)" },
      { years: "", text: "Nasdaq, Chinese Zodiac Flash Mob Crossing the Pacific (2026)" },
      { years: "", text: "Visit Beijing, Chinese Zodiac Design Exhibition Shines at the UN Headquarters (2026)" },
      { years: "", text: "Beijing Contemporary Art Foundation, Global Zodiac Design Exhibition Debuts at UN Headquarters (2026)" },
      { years: "", text: "Xinhua News, UN chief extends Lunar New Year greetings to Chinese people (2026)" },
      { years: "", text: "China Daily, UN rings in Year of the Horse with call for global unity (2026)" },
      { years: "", text: "Digital Journal, Open a New Chapter in Civilizational Exchange (2026)" },
      { years: "", text: "NEO2, The Wrong Biennale 2026: The Accelerated Pulse of the Present (2026)" },
      { years: "", text: "Refresh, A System That Dreams of Itself (2025)" },
      { years: "", text: "The Wrong Biennale 25/26, The Wrong Returns (2025)" },
      { years: "", text: "ANIAV, Technical University of Valencia, Net Art Died but is Doing Well: Annotations (2025)" },
      { years: "", text: "HEAD Foundation, The Wrong Way to Look at Art and Why It Might Be Right (2025)" },
      { years: "", text: "The AI Art Magazine, The Wrong Biennale 7th Edition (2025)" },
      { years: "", text: "Shoutout Atlanta, Meet Chun Wang: An Artist Interview (2024)" },
      { years: "", text: "Sohu, The Pinker the Venue, the Bolder the Exhibition (Originally published in Chinese, 2023)" },
      { years: "", text: "The Wrong Biennale 2023/24, Net Art Died but is Doing Well (2023)" },
      { years: "", text: "The Hollywood Reporter, Webby Awards: Trevor Noah, Jennifer Garner, HBO Among Nominees (2021)" },
      { years: "", text: "Deadline, Webby Nominations: Trevor Noah, Megan Thee Stallion, ‘Ratatouille: The Tik Tok Musical’ Among Nominees (2021)" },
    ],
  },
  {
    titleEn: "Artist Residencies",
    titleZh: "驻留经历",
    entries: [
      { years: "2022–2024", text: "Lead Creative Technologist/Strategy Group Researcher, Harvard FAS CAMLab, Cambridge, USA (Remote)" },
      { years: "2021", text: "Artist-in-Residence, World of Co Artist Residency, Sofia, Bulgaria (Remote)" },
      { years: "2021", text: "Artist-in-Residence, Dear Artists (Online)" },
      { years: "2019–2021", text: "Member Artist, LIC-Artists at the Plaxall Gallery, Long Island City, USA" },
      { years: "2016–2017", text: "Member Artist/Web Dev Ninja, CODAME ART+TECH, San Francisco, USA" },
    ],
  },
];

// ── Pagination ──────────────────────────────────────────────────────────
// Pages are packed by estimated line count so no page can overflow: an
// entry costs one line per wrapped visual line (at the CV's measure)
// plus a gap; a section heading costs its own block and is never left
// alone at a page foot. The first page also carries the section title
// header, so its budget is smaller.
export type CvBlock =
  | { heading: number }
  | { entry: [number, number] };

const CV_CHARS_PER_LINE = 68;
const CV_PAGE_LINES = 44;
const CV_FIRST_PAGE_LINES = 32;
const CV_HEADING_LINES = 5;

function cvEntryLines(e: CvEntry): number {
  const visual = e.text
    .split("\n")
    .reduce((acc, seg) => acc + Math.max(1, Math.ceil(seg.length / CV_CHARS_PER_LINE)), 0);
  return visual + 1;
}

export const CV_PAGES: CvBlock[][] = (() => {
  const pages: CvBlock[][] = [];
  let page: CvBlock[] = [];
  let used = 0;
  let budget = CV_FIRST_PAGE_LINES;
  const flush = () => {
    pages.push(page);
    page = [];
    used = 0;
    budget = CV_PAGE_LINES;
  };
  CV_SECTIONS.forEach((section, si) => {
    section.entries.forEach((entry, ei) => {
      const cost = cvEntryLines(entry);
      if (ei === 0) {
        if (used + CV_HEADING_LINES + cost > budget) flush();
        page.push({ heading: si });
        used += CV_HEADING_LINES;
      } else if (used + cost > budget) {
        flush();
      }
      page.push({ entry: [si, ei] });
      used += cost;
    });
  });
  if (page.length > 0) flush();
  return pages;
})();
