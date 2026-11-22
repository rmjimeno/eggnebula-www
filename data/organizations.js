/*
 * Astronomy & space organizations in the Philippines.
 *
 * Starter database compiled from public sources (PAGASA, PhilSA, Manila Observatory,
 * Sky & Telescope club directory, SGAC, news reports). Edit this file to add or fix entries.
 *
 * Fields
 *   id        unique slug
 *   name      display name
 *   type      one of: government | research | club | student | education | network
 *   region    short place label shown on the card
 *   coords    [lat, lng] or null (null = no pin, e.g. nationwide or online groups)
 *   precision "exact" | "area"  (area = pin is city/campus level, not a street address)
 *   about     one or two plain sentences
 *   offers    list of what they do (shown as tags)
 *   url       official site (omit if not confirmed)
 *   source    where the info came from
 *   verified  true once a human has confirmed the details are current
 *
 * NOTE: nothing here has been confirmed with the organizations themselves yet.
 * Pins for clubs are placed at city level until exact meeting places are confirmed.
 */
window.ORG_TYPES = {
  government: "Government",
  research: "Research & observatory",
  club: "Amateur club",
  student: "Student org",
  education: "Public education",
  network: "Network"
};

window.ORGS = [
  {
    id: "pagasa-astronomical-observatory",
    name: "PAGASA Astronomical Observatory",
    type: "government",
    region: "UP Diliman, Quezon City",
    coords: [14.6537, 121.0705],
    precision: "area",
    about: "The observatory of DOST-PAGASA, on the UP Diliman campus. Runs stargazing and telescoping sessions for schools and groups on request.",
    offers: ["Stargazing sessions", "Telescope viewing", "Schools & groups"],
    url: "https://www.pagasa.dost.gov.ph/astronomy",
    source: "PAGASA website",
    verified: false
  },
  {
    id: "pagasa-planetarium",
    name: "PAGASA Planetarium",
    type: "education",
    region: "Science Garden, Quezon City",
    coords: [14.6491, 121.0440],
    precision: "area",
    about: "Planetarium in the PAGASA Science Garden on Agham Road, reopened in 2024 after renovations. Offers basic astronomy shows.",
    offers: ["Planetarium shows", "Public visits"],
    url: "https://www.pagasa.dost.gov.ph/astronomy",
    source: "Philstar, Sept 2024",
    verified: false
  },
  {
    id: "pagasa-mindanao-planetarium",
    name: "PAGASA Mindanao Planetarium",
    type: "education",
    region: "Misamis Oriental",
    coords: [8.4542, 124.6319],
    precision: "area",
    about: "Mindanao's first planetarium, a PAGASA project in Misamis Oriental opened to the public in May 2024. Pin is at Cagayan de Oro for now.",
    offers: ["Planetarium shows", "Public visits"],
    source: "Manila Bulletin, May 2024",
    verified: false
  },
  {
    id: "philsa",
    name: "Philippine Space Agency (PhilSA)",
    type: "government",
    region: "Quezon City (HQ planned in New Clark City)",
    coords: [14.6086, 121.0803],
    precision: "area",
    about: "The national space agency, created by the Philippine Space Act (RA 11363). Works on satellites, Earth observation, space science and policy. A permanent headquarters is planned for New Clark City, Tarlac.",
    offers: ["Space policy", "Earth observation", "Satellite programs", "Education & outreach"],
    url: "https://philsa.gov.ph",
    source: "PhilSA website; BCDA announcement, Sept 2024",
    verified: false
  },
  {
    id: "manila-observatory",
    name: "Manila Observatory",
    type: "research",
    region: "Ateneo campus, Quezon City",
    coords: [14.6395, 121.0780],
    precision: "area",
    about: "A Jesuit scientific institution founded in 1865, now on the Ateneo de Manila campus. Known for atmospheric, climate and geophysical research and a long history in astronomy.",
    offers: ["Research", "Science outreach"],
    url: "https://www.observatory.ph",
    source: "Manila Observatory website",
    verified: false
  },
  {
    id: "philippine-astronomical-society",
    name: "Philippine Astronomical Society (PAS)",
    type: "club",
    region: "Metro Manila",
    coords: [14.5995, 120.9842],
    precision: "area",
    about: "The country's first hobby-led astronomy club, founded on 15 April 1971.",
    offers: ["Amateur astronomy", "Observing nights"],
    source: "Sky & Telescope club directory",
    verified: false
  },
  {
    id: "astronomical-league-ph",
    name: "Astronomical League of the Philippines (ALP)",
    type: "club",
    region: "Metro Manila",
    coords: [14.5995, 120.9842],
    precision: "area",
    about: "A national league of amateur astronomers, started in July 2003 by James Kevin Ty and Allen Yu.",
    offers: ["Amateur astronomy", "Astrophotography", "Public star parties"],
    url: "https://astroleaguephils.org",
    source: "astroleaguephils.org; Sky & Telescope club directory",
    verified: false
  },
  {
    id: "up-astronomical-society",
    name: "UP Astronomical Society (UP AstroSoc)",
    type: "student",
    region: "UP Diliman, Quezon City",
    coords: [14.6538, 121.0685],
    precision: "area",
    about: "University of the Philippines Diliman student organization for people interested in astronomy.",
    offers: ["Talks", "Stargazing", "Student community"],
    source: "UP iSkomunidad",
    verified: false
  },
  {
    id: "rtu-astronomy-society",
    name: "RTU Astronomy Society",
    type: "student",
    region: "Mandaluyong",
    coords: [14.5735, 121.0330],
    precision: "area",
    about: "Astronomy student organization of Rizal Technological University, listed as a member of the PUSO for Astronomy network.",
    offers: ["Student community"],
    source: "Astronomers Without Borders archive",
    verified: false
  },
  {
    id: "up-baguio-astronomy-society",
    name: "UP Baguio Astronomy Society",
    type: "student",
    region: "Baguio City",
    coords: [16.4120, 120.5930],
    precision: "area",
    about: "University club at UP Baguio for students interested in astronomy.",
    offers: ["Student community"],
    source: "Space Generation Advisory Council listing",
    verified: false
  },
  {
    id: "baguio-astronomy-enthusiasts",
    name: "Baguio Astronomy Enthusiasts",
    type: "club",
    region: "Baguio City",
    coords: [16.4023, 120.5960],
    precision: "area",
    about: "Community group of amateur astronomers in the Cordillera region.",
    offers: ["Amateur astronomy", "Community events"],
    source: "Space Generation Advisory Council listing",
    verified: false
  },
  {
    id: "cebu-amateur-astronomers",
    name: "Cebu Amateur Astronomers Association",
    type: "club",
    region: "Cebu City",
    coords: [10.3157, 123.8854],
    precision: "area",
    about: "Amateur astronomy group in Cebu, one of the Visayas' best-known hobby clubs.",
    offers: ["Amateur astronomy", "Star parties"],
    source: "Sky & Telescope club directory; Space Generation Advisory Council listing",
    verified: false
  },
  {
    id: "isaac-cebu",
    name: "Innovation Science & Astronomy Association of Cebu",
    type: "club",
    region: "Cebu",
    coords: [10.3000, 123.9000],
    precision: "area",
    about: "Cebu-based association promoting science and astronomy.",
    offers: ["Science & astronomy outreach"],
    source: "Directory listing",
    verified: false
  },
  {
    id: "lippad-addu",
    name: "LIPPAD, Ateneo de Davao University",
    type: "student",
    region: "Davao City",
    coords: [7.0644, 125.6132],
    precision: "area",
    about: "Collegiate astronomy-related organization at Ateneo de Davao University.",
    offers: ["Student community"],
    source: "Astronomers Without Borders archive",
    verified: false
  },
  {
    id: "puso-astronomy",
    name: "PUSO for Astronomy",
    type: "network",
    region: "Nationwide",
    coords: null,
    precision: "area",
    about: "Philippine Union of Student Organizations for Astronomy. A collaborative network of college astronomy and astronomy-related organizations.",
    offers: ["Student network", "Joint events"],
    source: "Astronomers Without Borders archive",
    verified: false
  },
  {
    id: "astrophotography-philippines",
    name: "Astrophotography Philippines",
    type: "club",
    region: "Online / nationwide",
    coords: null,
    precision: "area",
    about: "Online community of Filipino astrophotographers.",
    offers: ["Astrophotography", "Online community"],
    source: "Space Generation Advisory Council listing",
    verified: false
  },
  {
    id: "sgac-philippines",
    name: "SGAC Philippines",
    type: "network",
    region: "Nationwide",
    coords: null,
    precision: "area",
    about: "The Philippine point of contact of the Space Generation Advisory Council, a global network for students and young space professionals. Held its first Philippine event in August 2020.",
    offers: ["Young professionals", "Webinars", "Policy"],
    url: "https://spacegeneration.org/regions/asia/philippines",
    source: "SGAC",
    verified: false
  }
];
