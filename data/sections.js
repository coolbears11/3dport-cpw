// Content for the 3D narrative — one flagship story with four supporting
// projects, all sourced from Jason's actual resume and project brief
// (JTT Gigascale feasibility work, the Swinerton/VCC/Austin Company
// internships). JTT Gigascale is the hero (project04, the anchor/biggest
// building); everything else is supporting work discovered after the user
// reaches it.
//
// Each entry is a "beat" tied to a camera stop (see data/cameraStops.js).
// JTT and Getty Core each appear twice — once as an exterior building
// beat, once inside the hero's server room — since Getty Core is the
// other project featured on the racks. `sectionLabel` numbers the 5
// unique projects (01-05) consistently across every beat they appear in.
//
// `detail` holds the richer copy shown in the full-screen project modal
// (opened via "View Project"): a longer summary, resume-sourced bullet
// highlights, optional headline stats, an optional cost-breakdown table
// (Lockheed's estimate exercise), and a secondary gallery image.

export const sections = [
  {
    id: "jtt-exterior",
    cameraStop: "jttReveal",
    projects: [
      {
        id: "jtt-exterior-project",
        sectionLabel: "01",
        title: "JTT Gigascale",
        category: "AI Hyperscale Data Center",
        location: "Lafayette, IN",
        role: "Site Selection & Feasibility",
        description:
          "Confirmed 500 MW of available capacity with Duke Energy and led feasibility analysis covering utility availability, zoning, and interconnection for a target data center parcel.",
        year: "2026 – Present",
        media: "/images/projects/jtt-gigascale.jpg",
        alignment: "center",
        detail: {
          summary:
            "Independent site-selection and feasibility engagement for a hyperscale AI data center campus in Lafayette, IN. Engaged directly with Duke Energy to confirm power availability, reviewed owner and geotechnical documentation, and structured the commercial terms to secure site control.",
          stats: [
            { label: "Available Capacity", value: "500 MW" },
            { label: "Expansion Potential", value: "+500 MW" },
            { label: "Utility Partner", value: "Duke Energy" },
            { label: "Market", value: "Lafayette, IN" },
          ],
          highlights: [
            "Confirmed 500 MW of available capacity with no required utility upgrades through direct engagement with Duke Energy on a target parcel.",
            "Reviewed owner documentation and engineering plans from Shook Brokerage; built power maps and feasibility analyses covering utility availability, substation proximity, interconnection timelines, zoning, and water access.",
            "Drafted letters of intent and structured a consulting-fee model to assign purchase rights at closing, with attorney review.",
          ],
        },
      },
    ],
  },
  {
    id: "jtt-interior",
    cameraStop: "jttServerInterior1",
    projects: [
      {
        id: "jtt-interior-project",
        sectionLabel: "01",
        title: "JTT Gigascale",
        category: "Server Infrastructure",
        location: "Lafayette, IN",
        role: "Site Selection & Feasibility",
        description:
          "Power maps and feasibility analyses built to validate the site's readiness for gigascale AI compute — utility, interconnection, water, and land, all confirmed before ground is broken.",
        year: "2026 – Present",
        media: "/images/projects/jtt-gigascale.jpg",
        alignment: "left",
        detail: {
          summary:
            "The technical backbone behind the JTT Gigascale pursuit: utility capacity, network connectivity, thermal management, and land feasibility, each validated against real engineering and brokerage documentation before the site moves to acquisition.",
          highlights: [
            "Power & Capacity: confirmed 150 MW of immediate available capacity with Duke Energy, with expansion potential up to 500 MW and no required utility upgrades.",
            "Data & Connectivity: evaluated proximity to major fiber backbones to ensure low-latency, high-bandwidth connectivity for AI and HPC workloads.",
            "Water & Cooling: conducted feasibility analysis on local water access to support advanced liquid cooling and standard HVAC for high-density server environments.",
            "Land & Geotechnical: reviewed owner documentation, engineering plans, ALTA surveys, and geotechnical reports from Shook Brokerage to validate buildability and zoning compliance.",
          ],
        },
      },
    ],
  },
  {
    id: "getty-interior",
    cameraStop: "jttServerInterior2",
    projects: [
      {
        id: "getty-interior-project",
        sectionLabel: "02",
        title: "Getty Core",
        category: "Higher Education / Cultural Facility",
        location: "Los Angeles, CA",
        role: "Preconstruction Estimating",
        employer: "Swinerton — General Contractor",
        description:
          "Comprehensive quantity takeoffs and trade package estimates for the Getty Core preconstruction pursuit, isolating scope changes across design-build, hard-bid, and CMAR revision sets.",
        year: "2026",
        media: "/images/projects/getty-core.jpg",
        alignment: "right",
        detail: {
          summary:
            "One of four active commercial pursuits estimated during a Swinerton internship in Los Angeles. Ran takeoffs across SD, DD, and CD drawing sets and built MasterFormat and UniFormat estimates alongside the OCLA estimating team.",
          highlights: [
            "Produced comprehensive quantity takeoffs and trade package estimates spanning design-build, hard bid, and CMAR delivery.",
            "Ran drawing overlays and slipsheets in On-Screen Takeoff and Bluebeam to isolate scope changes across revision sets.",
            "Built MasterFormat and UniFormat estimates in Destini with the OCLA estimating team.",
          ],
          gallery: ["/images/projects/swinerton-team.jpg"],
        },
      },
    ],
  },
  {
    id: "block100",
    cameraStop: "block100Reveal",
    projects: [
      {
        id: "block100-project",
        sectionLabel: "03",
        title: "Block 100 Apartments",
        category: "Residential / Mixed-Use",
        location: "Newport Beach, CA",
        role: "Preconstruction Estimating",
        employer: "Swinerton — General Contractor",
        description:
          "Managed estimating for an active commercial pursuit in Newport Beach — defining scopes, organizing bid packages, and leveling subcontractor pricing.",
        year: "2026",
        media: "/images/projects/block100-apartments.avif",
        alignment: "left",
        detail: {
          summary:
            "Active Swinerton commercial pursuit in Newport Beach. Defined trade scopes and organized bid packages to level subcontractor pricing and surface cost opportunities ahead of award.",
          highlights: [
            "Defined scopes and organized bid packages across trades.",
            "Separated bid alternates to level subcontractor pricing and identify cost opportunities.",
            "Produced quantity takeoffs and trade package estimates as part of a four-project Swinerton pursuit slate.",
          ],
          gallery: ["/images/projects/swinerton-team.jpg"],
        },
      },
    ],
  },
  {
    id: "getty-exterior",
    cameraStop: "gettyCoreReveal",
    projects: [
      {
        id: "getty-exterior-project",
        sectionLabel: "02",
        title: "Getty Core",
        category: "Higher Education / Cultural Facility",
        location: "Los Angeles, CA",
        role: "Preconstruction Estimating",
        employer: "Swinerton — General Contractor",
        description:
          "Comprehensive quantity takeoffs and trade package estimates for the Getty Core preconstruction pursuit, isolating scope changes across design-build, hard-bid, and CMAR revision sets.",
        year: "2026",
        media: "/images/projects/getty-core.jpg",
        alignment: "right",
        detail: {
          summary:
            "One of four active commercial pursuits estimated during a Swinerton internship in Los Angeles. Ran takeoffs across SD, DD, and CD drawing sets and built MasterFormat and UniFormat estimates alongside the OCLA estimating team.",
          highlights: [
            "Produced comprehensive quantity takeoffs and trade package estimates spanning design-build, hard bid, and CMAR delivery.",
            "Ran drawing overlays and slipsheets in On-Screen Takeoff and Bluebeam to isolate scope changes across revision sets.",
            "Built MasterFormat and UniFormat estimates in Destini with the OCLA estimating team.",
          ],
          gallery: ["/images/projects/swinerton-team.jpg"],
        },
      },
    ],
  },
  {
    id: "lockheed",
    cameraStop: "lockheedReveal",
    projects: [
      {
        id: "lockheed-project",
        sectionLabel: "04",
        title: "Lockheed Martin B648 Concept",
        category: "Aerospace / Mission-Critical",
        location: "Palmdale, CA",
        role: "Preconstruction & Estimating",
        employer: "The Austin Company — Design-Build",
        description:
          "Supported owner-side preconstruction on a 20,000 SF mission-critical aerospace facility, coordinating change orders through 30/60/90% design with Lockheed Martin's design team.",
        year: "2025",
        media: "/images/projects/lockheed-b648.jpg",
        alignment: "center",
        detail: {
          summary:
            "Owner-side preconstruction support for Lockheed Martin's B648 Vestibule, a 20,000 SF mission-critical aerospace facility, during an internship with The Austin Company. Also completed an independent estimating exercise: a full quantity takeoff and 30% cost model for a 156,000 SF facility across CSI Divisions 01–33.",
          stats: [
            { label: "Total Design & Construction", value: "$72.8M" },
            { label: "Direct Construction Cost", value: "$59.7M" },
            { label: "Cost per SF", value: "$467" },
            { label: "Facility Size", value: "156,000 SF" },
          ],
          highlights: [
            "Supported owner-side preconstruction on aerospace projects for Lockheed Martin, Northrop Grumman, Raytheon, and L3Harris, including the B648 Vestibule — a 20,000 SF mission-critical facility.",
            "Coordinated with architects, engineers, and MEP estimators through 30%, 60%, and 90% design phases to manage change orders and adjust pricing.",
            "Completed an independent full quantity takeoff and 30% cost model across CSI Divisions 01–33, presenting cost assumptions and constructability findings to the estimating team.",
          ],
          costBreakdown: {
            caption: "Intern estimating exercise — CSI Division 01–33 cost model, $467/SF",
            rows: [
              { div: "01", description: "General Conditions & Staffing", total: "$2,979,193", perSf: "$19.10" },
              { div: "03", description: "Concrete", total: "$4,667,000", perSf: "$29.92" },
              { div: "05", description: "Metals", total: "$9,141,000", perSf: "$58.60" },
              { div: "07", description: "Thermal & Moisture Protection", total: "$3,149,000", perSf: "$20.19" },
              { div: "08", description: "Openings", total: "$2,044,000", perSf: "$13.10" },
              { div: "09", description: "Finishes", total: "$5,650,000", perSf: "$36.22" },
              { div: "14", description: "Conveying Systems", total: "$12,293,000", perSf: "$78.80" },
              { div: "22", description: "Plumbing", total: "$1,218,000", perSf: "$7.81" },
              { div: "23", description: "HVAC", total: "$4,227,000", perSf: "$27.10" },
              { div: "26", description: "Electrical", total: "$8,012,000", perSf: "$51.36" },
              { div: "31", description: "Sitework", total: "$2,972,000", perSf: "$19.05" },
            ],
          },
          gallery: ["/images/projects/austin-company-team.jpg"],
        },
      },
    ],
  },
  {
    id: "moxy",
    cameraStop: "moxyReveal",
    projects: [
      {
        id: "moxy-project",
        sectionLabel: "05",
        title: "Moxy Hotel",
        category: "Hospitality",
        location: "Menlo Park, CA",
        role: "MEP Takeoffs & Estimating",
        employer: "VCC Construction — General Contractor",
        description:
          "Ran full MEP takeoffs for the Moxy Hotel, pulling precise quantities from schedules and specifications to support hard-bid pricing.",
        year: "2025",
        media: "/images/projects/moxy-hotel.jpg",
        alignment: "left",
        detail: {
          summary:
            "MEP takeoff scope for the Moxy Hotel in Menlo Park during a VCC Construction internship, supporting accurate hard-bid pricing alongside drawing overlays to track scope changes across revisions.",
          highlights: [
            "Ran full MEP takeoffs for the Moxy Hotel, pulling quantities from schedules and specifications.",
            "Ran drawing overlays and slipsheets to isolate scope changes across revision sets.",
            "Supported hard-bid pursuits including Dick's House of Sport (Glendale, AZ) and a Las Vegas Strip storefront package.",
          ],
        },
      },
    ],
  },
];

// Flattened for rendering: one entry per project card, each carrying the
// camera stop its section is tied to.
export const chapters = sections.flatMap((section) =>
  section.projects.map((project) => ({
    ...project,
    cameraStop: section.cameraStop,
    sectionId: section.id,
  }))
);

// Which Zone A buildings get a hotspot marker, in "01..05" order — JTT
// first (the hero), then the four supporting projects, matched to
// buildings whose real-world massing fits the actual project (Lockheed's
// wide low hangar, Block 100's twin towers, etc — see data/worldLayout.js).
// project01 and project07 carry no project and are intentionally left
// out: they stay in the compound as unlabeled campus buildings.
export const hotspotBuildingOrder = ["project04", "project06", "project05", "project02", "project03"];
