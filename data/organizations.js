/*
 * Astronomy & space organizations in the Philippines.
 *
 * Starter database compiled from public sources (PAGASA, PhilSA, Manila Observatory,
 * Sky & Telescope club directory, SGAC, news reports). Edit this file to add or fix entries.
 *
 * Fields
 *   id        unique slug
 *   name      display name
 *   type      one of: government | observatory | research | club | online | student | highschool | business | network
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
  observatory: "Observatory",
  research: "Research",
  club: "Astronomy club",
  online: "Online community",
  student: "Student org",
  network: "Network",
  highschool: "High school",
  business: "Business & tourism"
};

window.ORGS = [
  {
    id: "pagasa-astronomical-observatory",
    name: "PAGASA Astronomical Observatory",
    type: "observatory",
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
    id: "pagasa-observatory",
    name: "PAGASA Observatory",
    type: "observatory",
    region: "UP Diliman, Quezon City",
    coords: [14.6515, 121.0680],
    precision: "area",
    about: "A second DOST-PAGASA observatory in UP Diliman, separate from the Astronomical Observatory.",
    offers: ["Observatory"],
    url: "https://www.pagasa.dost.gov.ph",
    source: "Added by site owner",
    verified: false
  },
  {
    id: "pagasa-planetarium",
    name: "PAGASA Planetarium",
    type: "government",
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
    type: "government",
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
    type: "observatory",
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
    url: "https://www.facebook.com/PhilippineAstronomicalSociety",
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
    url: "https://upastrosoc.org/",
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
    url: "https://www.facebook.com/rtudess",
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
    url: "https://www.facebook.com/upb.astrosoc",
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
    url: "https://www.facebook.com/groups/946724352339758",
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
    url: "https://www.facebook.com/groups/169245623098693",
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
    url: "https://www.facebook.com/isaacebu",
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
    url: "https://www.facebook.com/lippad.addu",
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
    type: "online",
    region: "Online / nationwide",
    coords: null,
    precision: "area",
    about: "Online community of Filipino astrophotographers.",
    offers: ["Astrophotography", "Online community"],
    url: "https://www.facebook.com/groups/astr0PH",
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
  },
  {
    "id": "pssar",
    "name": "Philippine Space Science and Astronomy Research (PSSAR)",
    "type": "network",
    "region": "Nationwide",
    "coords": null,
    "precision": "area",
    "about": "Organizes the Philippine Space Science and Astronomy Research Conference (PSSARC), billed as the country's first national conference on space science and astronomy. The full name of the group is not confirmed yet.",
    "offers": [
      "Conference",
      "Research"
    ],
    "url": "https://conference.pssar.ph",
    "source": "GMA Regional TV; PSSARC site",
    "verified": false
  },
  {
    "id": "stamina4space",
    "name": "STAMINA4Space",
    "type": "research",
    "region": "UP Diliman, Quezon City",
    "coords": [
      14.6538,
      121.072
    ],
    "precision": "area",
    "about": "UP Diliman program behind the Philippines' Diwata and Maya microsatellites.",
    "offers": [
      "Satellites",
      "Research"
    ],
    "url": "https://stamina4space.upd.edu.ph/",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "pcieerd",
    "name": "DOST-PCIEERD",
    "type": "government",
    "region": "DOST, Taguig",
    "coords": [
      14.488,
      121.048
    ],
    "precision": "area",
    "about": "The DOST council for industry, energy and emerging technology research. Listed by SGAC among space-related government bodies.",
    "offers": [
      "Research funding"
    ],
    "url": "https://pcieerd.dost.gov.ph/",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "sei",
    "name": "DOST Science Education Institute (SEI)",
    "type": "government",
    "region": "DOST, Taguig",
    "coords": [
      14.488,
      121.048
    ],
    "precision": "area",
    "about": "DOST agency for science education and scholarships. Listed by SGAC among space-related government bodies.",
    "offers": [
      "Scholarships",
      "Science education"
    ],
    "url": "https://sei.dost.gov.ph/",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "mind-museum",
    "name": "The Mind Museum",
    "type": "business",
    "region": "Taguig",
    "coords": [
      14.5521,
      121.045
    ],
    "precision": "area",
    "about": "Science museum in Bonifacio Global City.",
    "offers": [
      "Science museum",
      "Public visits"
    ],
    "url": "https://www.themindmuseum.org/",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "science-centrum",
    "name": "Science Centrum",
    "type": "observatory",
    "region": "South Drive, Baguio City",
    "coords": [16.4010, 120.5990],
    "precision": "area",
    "about": "Science education center listed with an observatory at South Drive, Baguio City. Details of public access still need confirming.",
    "offers": [
      "Planetarium",
      "Science education"
    ],
    "url": "https://www.science-centrum.ph/",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "andromeda-planetarium",
    "name": "Andromeda Mobile Planetarium",
    "type": "business",
    "region": "Philippines",
    "coords": null,
    "precision": "area",
    "about": "Mobile planetarium that brings domed shows to schools and events.",
    "offers": [
      "Mobile planetarium"
    ],
    "url": "https://www.facebook.com/andromedaplanetarium/",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "astrocamp",
    "name": "Astrocamp Observatory",
    "type": "business",
    "region": "Philippines",
    "coords": null,
    "precision": "area",
    "about": "Observatory and astro-camp experiences. Location to be confirmed.",
    "offers": [
      "Observatory",
      "Stargazing"
    ],
    "url": "https://www.facebook.com/astrocampobservatory1",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "nightgazers",
    "name": "Nightgazers Astro Tourism",
    "type": "business",
    "region": "Philippines",
    "coords": null,
    "precision": "area",
    "about": "Astro-tourism stargazing tours.",
    "offers": [
      "Stargazing tours"
    ],
    "url": "https://www.facebook.com/nightgazers",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "seven-suites",
    "name": "Seven Suites Observatory Hotel",
    "type": "business",
    "region": "Philippines",
    "coords": null,
    "precision": "area",
    "about": "Hotel with an observatory. Location to be confirmed.",
    "offers": [
      "Stargazing stay"
    ],
    "url": "https://www.facebook.com/sevensuiteshotel",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "junior-astronaut-academy",
    "name": "Junior Astronaut Academy",
    "type": "business",
    "region": "Philippines",
    "coords": null,
    "precision": "area",
    "about": "Space education programs for children.",
    "offers": [
      "Kids programs"
    ],
    "url": "https://www.facebook.com/JuniorAstronautAcademyPhilippines",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "orbital-explorations",
    "name": "Orbital Explorations",
    "type": "business",
    "region": "Philippines",
    "coords": null,
    "precision": "area",
    "about": "Space-related business listed by SGAC.",
    "offers": [
      "Space education"
    ],
    "url": "https://orbitx.ph/",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "regulus-spacetech",
    "name": "Regulus SpaceTech",
    "type": "business",
    "region": "Philippines",
    "coords": null,
    "precision": "area",
    "about": "Space technology company listed by SGAC.",
    "offers": [
      "Space tech"
    ],
    "url": "https://www.facebook.com/RegulusSpacetechInc",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "manila-street-astronomers",
    "name": "Manila Street Astronomers",
    "type": "club",
    "region": "Metro Manila",
    "coords": [
      14.5995,
      120.9842
    ],
    "precision": "area",
    "about": "Sidewalk astronomy group that sets up telescopes for the public.",
    "offers": [
      "Sidewalk astronomy",
      "Public star parties"
    ],
    "url": "https://www.facebook.com/ManilaStreetAstronomers",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "kagitingan-sidewalk-astronomers",
    "name": "Kagitingan Sidewalk Astronomers",
    "type": "club",
    "region": "Philippines",
    "coords": null,
    "precision": "area",
    "about": "Sidewalk astronomy group.",
    "offers": [
      "Sidewalk astronomy"
    ],
    "url": "https://www.facebook.com/Kagitingan-Sidewalk-Astronomers-577432072765345",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "7-lakes-astronomy",
    "name": "7 Lakes Astronomy",
    "type": "club",
    "region": "San Pablo, Laguna (inferred from name)",
    "coords": [
      14.0683,
      121.325
    ],
    "precision": "area",
    "about": "Amateur astronomy group. Pin is inferred from the group's name and needs confirming.",
    "offers": [
      "Amateur astronomy"
    ],
    "url": "https://www.facebook.com/7LakesAstronomy",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "astronomy-enthusiasts-society",
    "name": "Astronomy Enthusiasts Society",
    "type": "club",
    "region": "Philippines",
    "coords": null,
    "precision": "area",
    "about": "Astronomy community listed by SGAC.",
    "offers": [
      "Community"
    ],
    "url": "https://www.facebook.com/astronomyenthusiastssociety",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "astropinas",
    "name": "AstroPinas",
    "type": "online",
    "region": "Online / nationwide",
    "coords": null,
    "precision": "area",
    "about": "Online Facebook community for Filipino astronomy fans.",
    "offers": [
      "Online community"
    ],
    "url": "https://www.facebook.com/groups/406903166490631",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "filipino-astro-community",
    "name": "Filipino Astro Community",
    "type": "online",
    "region": "Online / nationwide",
    "coords": null,
    "precision": "area",
    "about": "Online Facebook community.",
    "offers": [
      "Online community"
    ],
    "url": "https://www.facebook.com/groups/filastrocomm",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "ph-astronomy-exchange",
    "name": "Philippine Astronomy Exchange",
    "type": "online",
    "region": "Online / nationwide",
    "coords": null,
    "precision": "area",
    "about": "Online Facebook community.",
    "offers": [
      "Online community"
    ],
    "url": "https://www.facebook.com/groups/195162934173755",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "ph-astronomy-forum",
    "name": "Philippine Astronomy Forum",
    "type": "online",
    "region": "Online / nationwide",
    "coords": null,
    "precision": "area",
    "about": "Online Facebook discussion group.",
    "offers": [
      "Online community"
    ],
    "url": "https://www.facebook.com/groups/325788820932980",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "philippine-physics-society",
    "name": "Philippine Physics Society",
    "type": "network",
    "region": "Nationwide",
    "coords": null,
    "precision": "area",
    "about": "National physics society. Publishes the Philippine Physics Journal.",
    "offers": [
      "Physics community",
      "Journal"
    ],
    "url": "http://philippinephysicssociety.org/",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "sserd-ph",
    "name": "Society for Space Education, Research and Development (SSERD-PH)",
    "type": "network",
    "region": "Nationwide",
    "coords": null,
    "precision": "area",
    "about": "Space education and research society. SGAC's first Philippine activity in 2020 was an introduction to it.",
    "offers": [
      "Space education",
      "Research"
    ],
    "url": "https://www.facebook.com/sserd.ph",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "uplb-astrosoc",
    "name": "UP Los Baños Astronomical Society",
    "type": "student",
    "region": "Los Baños, Laguna",
    "coords": [
      14.1649,
      121.2413
    ],
    "precision": "area",
    "about": "Astronomy student org at UP Los Baños.",
    "offers": [
      "Student community"
    ],
    "url": "https://www.facebook.com/uplbastrosoc",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "dlsu-optical",
    "name": "DLSU Optical Society",
    "type": "student",
    "region": "De La Salle University, Manila",
    "coords": [
      14.5648,
      120.9932
    ],
    "precision": "area",
    "about": "Optics and astronomy-related student org at DLSU.",
    "offers": [
      "Student community"
    ],
    "url": "https://www.facebook.com/DLSUOpticalSociety",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "pnu-astrosoc",
    "name": "PNU Astronomical Society",
    "type": "student",
    "region": "Philippine Normal University, Manila",
    "coords": [
      14.5895,
      120.983
    ],
    "precision": "area",
    "about": "Astronomy student org at the Philippine Normal University.",
    "offers": [
      "Student community"
    ],
    "url": "https://www.facebook.com/Philippine-Normal-University-Astronomical-Society-1498258070491237",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "bpsu-astrosoc",
    "name": "BPSU Astronomical Society",
    "type": "student",
    "region": "Balanga, Bataan",
    "coords": [
      14.676,
      120.536
    ],
    "precision": "area",
    "about": "Astronomy student org at Bataan Peninsula State University.",
    "offers": [
      "Student community"
    ],
    "url": "https://www.facebook.com/bpsu.astrosoc",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "usc-physastro",
    "name": "USC Physics and Astronomy Society",
    "type": "student",
    "region": "University of San Carlos, Cebu City",
    "coords": [
      10.3544,
      123.9117
    ],
    "precision": "area",
    "about": "Physics and astronomy student org at USC.",
    "offers": [
      "Student community"
    ],
    "url": "https://www.facebook.com/uscphysastrosoc",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "msu-marawi-astro",
    "name": "MSU-Marawi Astronomy Club",
    "type": "student",
    "region": "Marawi City",
    "coords": [
      8,
      124.26
    ],
    "precision": "area",
    "about": "Astronomy club at Mindanao State University, Marawi.",
    "offers": [
      "Student community"
    ],
    "url": "https://www.facebook.com/marawiastroclub",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "jpps-silliman",
    "name": "Junior Philippine Physics Society, Silliman",
    "type": "student",
    "region": "Dumaguete",
    "coords": [
      9.3103,
      123.305
    ],
    "precision": "area",
    "about": "Physics student org at Silliman University (spelled Siliman on the SGAC page).",
    "offers": [
      "Student community"
    ],
    "url": "https://www.facebook.com/JuniorPhilippinePhysicsSociety",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "iau-astrosoc",
    "name": "IAU Astronomical Society",
    "type": "student",
    "region": "Philippines",
    "coords": null,
    "precision": "area",
    "about": "Collegiate astronomy society. School and location to be confirmed.",
    "offers": [
      "Student community"
    ],
    "url": "https://www.facebook.com/IAUAS",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "oness",
    "name": "Organization of New Era Students of Astronomy",
    "type": "student",
    "region": "Philippines",
    "coords": null,
    "precision": "area",
    "about": "Collegiate astronomy org. Location to be confirmed.",
    "offers": [
      "Student community"
    ],
    "url": "https://www.facebook.com/Neu.ph.official/",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "apss-seis",
    "name": "Astronomy and Physics Society of SEIS",
    "type": "highschool",
    "region": "Philippines",
    "coords": null,
    "precision": "area",
    "about": "High school astronomy and physics society.",
    "offers": [
      "Student community"
    ],
    "url": "https://www.facebook.com/APSSEIS.edu.ph",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "bsya",
    "name": "Bedan Society of Young Astronomers",
    "type": "highschool",
    "region": "Philippines",
    "coords": null,
    "precision": "area",
    "about": "High school astronomy society.",
    "offers": [
      "Student community"
    ],
    "url": "https://www.facebook.com/BSYASHS",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "eac-polaris",
    "name": "EAC Polaris",
    "type": "highschool",
    "region": "Philippines",
    "coords": null,
    "precision": "area",
    "about": "High school astronomy org.",
    "offers": [
      "Student community"
    ],
    "url": "https://www.facebook.com/EAC-Polaris-105516774125942",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "dlsau-green-astro",
    "name": "DLSAU Green Astronomical Society",
    "type": "highschool",
    "region": "Philippines",
    "coords": null,
    "precision": "area",
    "about": "High school astronomy society.",
    "offers": [
      "Student community"
    ],
    "url": "https://www.facebook.com/DLSAUGreenAstroSoc",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "iscag-astro",
    "name": "ISCAG School Astronomy Club",
    "type": "highschool",
    "region": "Philippines",
    "coords": null,
    "precision": "area",
    "about": "School astronomy club.",
    "offers": [
      "Student community"
    ],
    "url": "https://www.facebook.com/ISCAG-School-Astronomy-Club-102422571148165",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "judenites-astro",
    "name": "Judenite's Astronomical Society",
    "type": "highschool",
    "region": "Philippines",
    "coords": null,
    "precision": "area",
    "about": "High school astronomy society.",
    "offers": [
      "Student community"
    ],
    "url": "https://www.facebook.com/SJCSJAO",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "nocturn-astro",
    "name": "Nocturn Astronomical Society",
    "type": "highschool",
    "region": "Philippines",
    "coords": null,
    "precision": "area",
    "about": "High school astronomy society.",
    "offers": [
      "Student community"
    ],
    "url": "https://www.facebook.com/NocturnAstroSoc",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "pup-lhs-astra",
    "name": "PUP-LHS ASTRA",
    "type": "highschool",
    "region": "Sta. Mesa, Manila",
    "coords": [
      14.5974,
      121.011
    ],
    "precision": "area",
    "about": "Astronomy, science and technology research association of PUP Laboratory High School.",
    "offers": [
      "Student community"
    ],
    "url": "https://www.facebook.com/PUPLHS.ASTRA.IS.LIFE/",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "reaching-astronomer",
    "name": "The Reaching Astronomer Student Team",
    "type": "highschool",
    "region": "Philippines",
    "coords": null,
    "precision": "area",
    "about": "Student astronomy outreach team.",
    "offers": [
      "Outreach"
    ],
    "url": "https://www.facebook.com/thereachingastronomy",
    "source": "SGAC Philippines links page",
    "verified": false
  },
  {
    "id": "up-nismed-observatory",
    "name": "UP NISMED Observatory",
    "type": "observatory",
    "region": "UP Diliman, Quezon City",
    "coords": [
      14.6535,
      121.069
    ],
    "precision": "area",
    "about": "Observatory on the roof deck of the UP NISMED Science Teacher Training Center, with a 40 cm reflector in a motorized dome, active since 1990. Mainly serves schools and educational groups by request, plus open events such as Buwan at Bituin.",
    "offers": [
      "Telescope viewing",
      "School sessions",
      "By request"
    ],
    "url": "https://nismed.upd.edu.ph/observatory/",
    "source": "UP NISMED website",
    "verified": false
  }
];
