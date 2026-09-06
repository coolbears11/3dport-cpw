// Content for the 3D narrative — one flagship story with four supporting
// projects, all sourced from Jason's actual resume and project brief
// (JTT Gigascale feasibility work, the Swinerton/VCC/Austin Company
// internships). JTT Gigascale is the hero (project04, the anchor/biggest
// building); everything else is supporting work discovered after the user
// reaches it.
//
// Each entry is a "beat" tied to a camera stop (see data/cameraStops.js).
// JTT is the only project that appears twice — once as an exterior
// building beat, once inside its own server room. Every supporting
// project appears exactly once, at its own building, so nothing shows up
// somewhere it doesn't belong. `sectionLabel` numbers the 5 unique
// projects (01-05), and the beats now run in that same 01-05 order.
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
          "Confirmed 150 MW of available capacity with Duke Energy and led feasibility analysis covering utility availability, zoning, and interconnection for a target data center parcel.",
        year: "2026 – Present",
        media: "/images/projects/jtt-gigascale.jpg",
        alignment: "center",
        detail: {
          summary:
            "Independent site-selection and feasibility engagement for a hyperscale AI data center campus in Lafayette, IN. Engaged directly with Duke Energy to confirm power availability, reviewed owner and geotechnical documentation, and is currently developing the contract structure to bring to a prospective buyer.",
          stats: [
            { label: "Available Capacity", value: "150 MW" },
            { label: "Expansion Potential", value: "300+ MW" },
            { label: "Utility Partner", value: "Duke Energy" },
            { label: "Market", value: "Lafayette, IN" },
          ],
          highlights: [
            "Confirmed 150 MW of available capacity with no required utility upgrades through direct engagement with Duke Energy on a target parcel, with expansion potential of 300+ MW.",
            "Reviewed owner documentation and engineering plans from Shook Brokerage; built power maps and feasibility analyses covering utility availability, substation proximity, interconnection timelines, zoning, and water access.",
            "Currently developing the contract structure to propose to a prospective buyer, with attorney review.",
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
            "Power & Capacity: confirmed 150 MW of immediate available capacity with Duke Energy, with expansion potential of 300+ MW and no required utility upgrades.",
            "Data & Connectivity: evaluated proximity to major fiber backbones to ensure low-latency, high-bandwidth connectivity for AI and HPC workloads.",
            "Water & Cooling: conducted feasibility analysis on local water access to support advanced liquid cooling and standard HVAC for high-density server environments.",
            "Land & Geotechnical: reviewed owner documentation, engineering plans, ALTA surveys, and geotechnical reports from Shook Brokerage to validate buildability and zoning compliance.",
          ],
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
          "Conceptual budget for the Getty Core project, a new education building on the Getty campus, priced from a 50% schematic design set for a CMAR pursuit that had not yet been awarded.",
        year: "2026",
        media: "/images/projects/getty-core.jpg",
        alignment: "right",
        detail: {
          summary:
            "Swinerton's preconstruction submission for the Getty Core project, a new education building on the Getty campus. The contract had not been awarded and the design was only at 50% schematic, so the job was to give the owner a credible number anyway: take off what the drawings actually supported, price the rest by conceptual methods, and carry alternates for the scopes still open.",
          highlights: [
            "Ran quantity takeoffs across a wide range of trades directly from the 50% schematic design set, using On-Screen Takeoff and Bluebeam.",
            "Priced the scope the schematic drawings had not yet resolved using conceptual estimating methods and historical cost data.",
            "Developed bid alternates and identified subcontractors to carry the scopes still undefined at 50% SD.",
            "Assembled the results into the conceptual budget carried in Swinerton's CMAR proposal to the owner.",
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
          "Envelope and roofing takeoffs for an active Swinerton pursuit in Newport Beach, run with the San Diego estimating team and formatted to the client's requested estimating breakdowns.",
        year: "2026",
        media: "/images/projects/block100-apartments.avif",
        alignment: "left",
        detail: {
          summary:
            "Active Swinerton commercial pursuit in Newport Beach, run in collaboration with the Swinerton San Diego team. Scope centered on the building envelope and roofing packages, with quantities reviewed for accuracy before being carried into the estimate.",
          highlights: [
            "Collaborated with the Swinerton San Diego team, running takeoffs in On-Screen Takeoff across balcony sheet metal, terraces, roofs, TPO roofing, and parapets.",
            "Worked through specific estimating styles and breakdowns to meet the client's requirements.",
            "Participated in owner meetings alongside the estimating team.",
            "Reviewed each takeoff for accuracy before uploading the quantities into Destini.",
          ],
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
        title: "Conceptual Aerospace Facility & B648 Vestibule",
        category: "Aerospace / Mission-Critical",
        location: "Palmdale, CA",
        role: "Preconstruction & Estimating",
        employer: "The Austin Company — Design-Build",
        description:
          "Two aerospace projects: owner-side preconstruction on Lockheed Martin's 50,000 SF B648 Vestibule, and a full independent takeoff and cost model for a separate conceptual aerospace facility.",
        year: "2025",
        media: "/images/projects/lockheed-b648.jpg",
        alignment: "center",
        detail: {
          summary:
            "Two separate pieces of work from an internship with The Austin Company, kept distinct here because they carry different scopes and different disclosure limits. B648 Vestibule: owner-side preconstruction on a 50,000 SF mission-critical facility for Lockheed Martin, shown in the image above; project figures are confidential and are not published. Conceptual Aerospace Facility: an independent estimating exercise on a 156,000 SF facility, and the source of the full cost model below. Both covered all CSI divisions.",
          stats: [
            { label: "Total Design & Construction", value: "$72.8M" },
            { label: "Direct Construction Cost", value: "$59.7M" },
            { label: "Cost per SF", value: "$467" },
            { label: "Conceptual Facility", value: "156,000 SF" },
          ],
          highlights: [
            "B648 Vestibule — supported owner-side preconstruction on a 50,000 SF mission-critical facility for Lockheed Martin, working across all CSI divisions.",
            "B648 Vestibule — coordinated with architects, engineers, and MEP estimators through 30%, 60%, and 90% design phases to manage change orders and adjust pricing.",
            "Conceptual Aerospace Facility — completed an independent full quantity takeoff and 30% cost model on a 156,000 SF facility across CSI Divisions 01–33, presenting cost assumptions and constructability findings to the estimating team.",
            "Supported owner-side preconstruction on aerospace work for Lockheed Martin, Northrop Grumman, Raytheon, and L3Harris.",
          ],
          costBreakdown: {
            caption: "Conceptual aerospace facility — CSI Division 01–33 cost model, 156,000 SF at $467/SF",
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
            "Set up and ran job walks on site to verify existing conditions ahead of pricing.",
            "Handled subcontractor outreach and coordinated subs through the bid period.",
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
