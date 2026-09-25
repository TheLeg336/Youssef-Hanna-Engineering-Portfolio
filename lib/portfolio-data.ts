export interface ProjectMetric {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface ProjectSection {
  number: string;
  title: string;
  content: string;
}

export interface Project {
  slug: string;
  title: string;
  type: string;
  category: 'Mechanical & Prototyping' | 'Product & Software' | 'Embedded Systems' | 'AI & Automation';
  role: string;
  year: string;
  status: string;
  isInDevelopment?: boolean;
  shortDescription: string;
  longDescription: string;
  hardware?: string;
  techStack: string[];
  metrics: ProjectMetric[];
  sections: ProjectSection[];
  links?: {
    demo?: string;
    github?: string;
    chromeStore?: string;
  };
}

export const PERSONAL_INFO = {
  name: 'Youssef Hanna',
  location: 'Fountain Valley, California',
  school: 'Cal Poly Pomona',
  schoolFull: 'California State Polytechnic University, Pomona',
  degree: 'Bachelor of Science in Mechanical Engineering',
  status: 'Junior',
  graduationDate: 'May 2028',
  gpa: '3.74 / 4.00',
  email: 'youssefhanna336@gmail.com',
  github: 'https://github.com/TheLeg336',
  handshake: 'https://cpp.joinhandshake.com/profiles/uwhh2v',
  linkedin: null as string | null, // Slot ready for when LinkedIn URL is available
  resumePath: '/Youssef_Hanna_Engineering_Resume.pdf',
  internshipGoal: 'Seeking Summer 2027 Engineering Internships',
  headline: 'I design, build, test, and improve complex physical systems.',
  subheadline:
    'Junior mechanical engineering student focused primarily on aerospace and hands-on mechanical engineering, with experience spanning mechanical design, embedded hardware, prototyping, and team leadership.',
  languages: [
    { language: 'English', fluency: 'Fluent' },
    { language: 'Arabic', fluency: 'Fluent' },
  ],
  honors: [
    { title: "Dean's List", detail: 'Academic excellence at Cal Poly Pomona' },
    { title: 'Phi Theta Kappa', detail: 'International Honor Society recognition' },
  ],
};

export const QUICK_METRICS = [
  { value: '3.74', label: 'Cumulative GPA', sublabel: 'Scale of 4.00' },
  { value: '~15', label: 'Team Members Led', sublabel: 'Class competition winner' },
  { value: '~300 ft', label: 'Launcher Range', sublabel: '3× original 100 ft target' },
  { value: 'May ’28', label: 'Graduation Date', sublabel: 'B.S. Mechanical Engineering' },
];

export const EDUCATION_DATA = {
  school: 'California State Polytechnic University, Pomona (Cal Poly Pomona)',
  degree: 'Bachelor of Science in Mechanical Engineering',
  status: 'Junior',
  expectedGraduation: 'May 2028',
  gpa: '3.74 / 4.00',
  honors: ["Dean's List", 'Phi Theta Kappa'],
  relevantCoursework: [
    'Statics',
    'Dynamics',
    'Mechanics of Materials',
    'Thermodynamics',
    'Engineering Graphics / SolidWorks',
    'Programming with Python',
    'Programming with C++',
  ],
  coreInterests: [
    'Statics & Structural Mechanics',
    'Dynamics & Motion Analysis',
    'Mechanics of Materials',
    'Thermodynamics & Heat Transfer',
    'Aerospace & Spacecraft Systems',
    'Embedded Controls & Mechatronics',
  ],
};

export interface SkillItem {
  name: string;
  note: string;
  projectSlug?: string;
  projectName?: string;
}

export interface SkillGroup {
  category: string;
  skills: SkillItem[];
}

export const SKILLS_DATA: SkillGroup[] = [
  {
    category: 'CAD & DESIGN',
    skills: [
      {
        name: 'SolidWorks',
        note: '3D parametric modeling, drawing packages, and mechanical assemblies.',
        projectSlug: 'launcher',
        projectName: 'Used in Launcher & Ezer Concept',
      },
      {
        name: 'Onshape',
        note: 'Collaborative cloud modeling and parametric part studios.',
      },
      {
        name: 'Blender',
        note: 'Polygonal surface visualization and 3D rendering.',
      },
    ],
  },
  {
    category: 'PROGRAMMING',
    skills: [
      {
        name: 'Python',
        note: 'Engineering scripts, numerical analysis, and data processing.',
      },
      {
        name: 'C++',
        note: 'Object-oriented programming and embedded algorithms.',
      },
      {
        name: 'JavaScript',
        note: 'Extension architecture, DOM injection, and frontend logic.',
        projectSlug: 'unirate',
        projectName: 'Used in UniRate',
      },
      {
        name: 'HTML/CSS',
        note: 'Responsive layout systems and modern interface styling.',
        projectSlug: 'unirate',
        projectName: 'Used in UniRate',
      },
    ],
  },
  {
    category: 'EMBEDDED / HARDWARE',
    skills: [
      {
        name: 'Raspberry Pi Pico 2 W',
        note: 'Primary microcontroller platform; RP2350 dual-core architecture.',
        projectSlug: 'dualsense',
        projectName: 'Used in DualSense',
      },
      {
        name: 'Soldering',
        note: 'Header pins, wiring harnesses, and through-hole connections.',
        projectSlug: 'dualsense',
        projectName: 'Used in DualSense',
      },
      {
        name: 'Electronics Integration',
        note: 'Sensors, actuators, USB HID translation, and power rails.',
        projectSlug: 'dualsense',
        projectName: 'Used in DualSense',
      },
    ],
  },
  {
    category: 'FABRICATION / TOOLS',
    skills: [
      {
        name: '3D Printing',
        note: 'Rapid iterative geometry validation and custom bracketry.',
      },
      {
        name: 'Laser Cutting',
        note: 'Sheet stock profiling, mechanical linkages, and templates.',
      },
      {
        name: 'Hand & Power Tools',
        note: 'Drilling, fastening, cutting, and structural assembly.',
        projectSlug: 'launcher',
        projectName: 'Used in Launcher Prototyping',
      },
      {
        name: 'Excel',
        note: 'Engineering budgets, project metrics, and commercial margin calculations.',
        projectSlug: 'launcher',
        projectName: 'Used in Launcher Margin Scoring',
      },
    ],
  },
];

export const EXPERIENCE_DATA = [
  {
    role: 'Security Guard',
    company: 'Kero Security',
    location: 'California',
    period: 'March 2026 – August 2026',
    type: 'Professional Experience',
    summary:
      'Monitored assigned facilities, conducted routine patrols, and helped maintain a secure and safe environment.',
    responsibilities: [
      'Monitored assigned facilities and conducted routine patrols.',
      'Exercised dependability, situational awareness, and calm judgment on duty.',
      'Communicated clearly and professionally with staff and visitors.',
      'Responded promptly and calmly to facility needs and incidents.',
    ],
  },
];

export const LAUNCHER_TIMELINE = [
  {
    phase: '01',
    stage: 'Constraints',
    title: 'Baseline Target',
    detail: '~100 ft target distance with strict out-of-pocket budget bounds and required commercial margin scoring.',
  },
  {
    phase: '02',
    stage: 'Disruption',
    title: 'Pre-Competition Failure',
    detail: 'An unauthorized modification roughly one week before competition severely compromised the mechanism.',
  },
  {
    phase: '03',
    stage: 'Triage',
    title: 'Failure Recovery',
    detail: 'Assembled the ~15-person team, assessed surviving components, and chose to redesign around altered parts.',
  },
  {
    phase: '04',
    stage: 'Iteration',
    title: 'Compacted Redesign',
    detail: 'Fabricated a more compact, stiffer chassis with an optimized pivot ratio and reduced structural deflection.',
  },
  {
    phase: '05',
    stage: 'Victory',
    title: 'Class Winner',
    detail: 'Achieved ~300 ft range (3× target distance) and ~30–40% profit margin, winning 1st place in the class competition.',
  },
];

export const LEADERSHIP_DATA = [
  {
    title: 'Engineering Project Lead — Launcher Team',
    subtitle: '~15-Person Student Engineering Team',
    period: '2024',
    description:
      'Led a ~15-person student engineering team through the complete lifecycle of a high-performance mechanical launcher project. When an unauthorized component change compromised the mechanism one week before competition, directed recovery efforts, redesigned around existing damaged parts, and led the team to a 1st place class victory.',
  },
  {
    title: 'Mathematics Tutor',
    subtitle: 'Community & Church Education',
    period: 'Ongoing',
    description:
      'Tutored mathematics for students and community members through church and peer educational sessions. Focused on breaking down complex mathematical concepts into intuitive physical interpretations.',
  },
  {
    title: 'Community Volunteer',
    subtitle: 'Service & Civic Initiatives',
    period: 'Ongoing',
    description:
      'Participated in community outreach and event support through church initiatives, emphasizing teamwork, dependability, and practical contribution.',
  },
];

export const PROJECTS: Project[] = [
  {
    slug: 'launcher',
    title: 'Precision Tennis Ball Launcher',
    type: 'Mechanical Design / Prototype / Competition',
    category: 'Mechanical & Prototyping',
    role: 'Project Lead',
    year: '2024',
    status: '1st Place — Class Winner',
    shortDescription:
      'Led a ~15-person engineering team to design, fabricate, and test a mechanical launcher. Rebuilt the system under tight pressure after a severe pre-competition failure, reaching ~300 ft (3× target distance) with ~30-40% profit margin.',
    longDescription:
      'A comprehensive engineering design and build challenge in Introduction to Engineering and Design at Cal Poly Pomona. The mission: engineer a tennis ball launcher capable of hitting a ~100 ft target while balancing real-world product costs and target profit margins. When an unauthorized modification damaged key linkages one week before the final competition, I led the team through emergency failure recovery, redesigned around damaged parts, compacted the geometry, and won 1st place in the class competition.',
    techStack: ['Mechanical Design', 'Rapid Prototyping', 'Power Tools', 'Team Leadership', 'Cost Analysis', 'Testing & Iteration'],
    metrics: [
      { label: 'Target Distance', value: '~100 ft' },
      { label: 'Achieved Range', value: '~300 ft', highlight: true },
      { label: 'Performance', value: '3× Target Range' },
      { label: 'Team Size', value: '~15 Members' },
      { label: 'Profit Margin', value: '~30–40%' },
      { label: 'Competition Rank', value: '1st / Winner' },
    ],
    sections: [
      {
        number: '01',
        title: 'Project Overview',
        content:
          'In Introduction to Engineering and Design at Cal Poly Pomona, student engineering teams designed, funded, built, and competed a tennis ball launcher. The challenge demanded both mechanical precision and commercial discipline: student teams funded project costs out of pocket, material budgets were constrained, and final designs were evaluated on both competition performance and calculated commercial profit margins (~30–40% margin achieved).',
      },
      {
        number: '02',
        title: 'The Engineering Problem',
        content:
          'Design an efficient, repeatable mechanical launching mechanism capable of propelling a standard tennis ball accurately to a target distance of approximately 100 feet. The mechanism had to withstand high dynamic shock loads without structural failure, remain portable, allow reliable reloading, and stay within strict budgetary bounds.',
      },
      {
        number: '03',
        title: 'Real-World Constraints',
        content:
          'Unlike theoretical textbook problems, this build had hard physical and financial constraints: out-of-pocket funding dictated material selection, components had to be fabricated with available student shop hand and power tools, and the final bill of materials directly factored into the competition scoring formula where commercial viability and profit margins were scored alongside mechanical reach.',
      },
      {
        number: '04',
        title: 'My Role & Leadership',
        content:
          'Served as Project Lead for approximately 15 engineering students. My responsibilities included establishing the engineering schedule, coordinating workstreams (structural frame, release trigger, energy storage, base stability), tracking material expenses, maintaining focus on the competition criteria, and directly participating in fabrication and testing.',
      },
      {
        number: '05',
        title: 'Engineering Approach',
        content:
          'We focused on maximum energy density and structural stiffness. By keeping the structural load path clean and minimizing friction along the launch pivot, we minimized kinetic energy loss. We prioritized an intuitive trigger mechanism that ensured repeatable release angles during successive launches.',
      },
      {
        number: '06',
        title: 'Fabrication & Implementation',
        content:
          'The launcher was fabricated using robust structural lumber, reinforced pivot brackets, custom release linkages, and high-tension energy storage elements. Fasteners, bushings, and pivot points were systematically checked for axial play to guarantee that launch vectors remained perpendicular to the firing plane.',
      },
      {
        number: '07',
        title: 'Critical Challenge & Failure Recovery',
        content:
          'Approximately one week prior to the competition day, an unauthorized modification was implemented on the launcher with the intention of improving performance. Instead, it severely compromised the primary structural geometry and damaged critical pivot components. With only days remaining, blaming or panicking was not an option. I assembled the team, conducted a triage assessment of surviving components, and formulated an emergency redesign: rather than attempting to recreate the original bulky frame, we redesigned the assembly around the surviving pieces, creating a more compact, stiffer chassis with an optimized pivot-to-mass ratio.',
      },
      {
        number: '08',
        title: 'Testing & Iteration',
        content:
          'The newly compacted launcher was subjected to rigorous test launches. The stiffer frame reduced structural deflection during high-tension release, resulting in significantly higher velocity and tighter grouping than our previous iterations.',
      },
      {
        number: '09',
        title: 'Competition Result',
        content:
          'At the class competition, our launcher reached approximately 300 feet—tripling the target distance while maintaining consistent accuracy. Paired with our 30–40% financial profit margin analysis, our team won 1st place in the class competition.',
      },
      {
        number: '10',
        title: 'Key Engineering Takeaways',
        content:
          'Physical engineering will always present unexpected failures. Real engineering capability is not avoiding failure altogether, but having the technical clarity and leadership poise to assess damage calmly, extract surviving value, iterate rapidly under pressure, and emerge with a mechanically superior design.',
      },
    ],
  },
  {
    slug: 'unirate',
    title: 'UniRate',
    type: 'Browser Extension / Product Development',
    category: 'Product & Software',
    role: 'Solo Developer (AI-assisted)',
    year: '2024–Present',
    status: 'Published — Chrome Web Store',
    shortDescription:
      'Solo-built Chrome extension that injects Rate My Professors metrics directly into university course registration portals. Features fuzzy professor matching, difficulty ratings, review popovers, and multi-school support.',
    longDescription:
      'UniRate is a publicly released Chrome extension created to eliminate the friction students face every semester during course registration. Instead of manually cross-referencing dozens of professors across tabs while seats evaporate, UniRate seamlessly queries and injects professor quality scores, difficulty indices, and student review sentiment right onto the university portal registration table.',
    techStack: ['JavaScript', 'HTML5', 'CSS3', 'Python', 'Chrome Extensions API', 'DOM Injection'],
    metrics: [
      { label: 'Status', value: 'Live on Web Store', highlight: true },
      { label: 'Development', value: 'Solo + AI-Assisted' },
      { label: 'Core Language', value: 'JavaScript (~70%)' },
      { label: 'Portal Support', value: 'Multi-School Capable' },
    ],
    links: {
      chromeStore:
        'https://chromewebstore.google.com/detail/unirate/eeehacjdlohcgmhghnihgbgfmkbopcho',
    },
    sections: [
      {
        number: '01',
        title: 'Overview',
        content:
          'UniRate is a published Chrome extension that integrates Rate My Professors metrics directly into college and university schedule search and course registration portals. Conceived, designed, and developed solo with AI-assisted debugging and code expansion.',
      },
      {
        number: '02',
        title: 'The Problem',
        content:
          'During university registration periods, class sections fill within seconds. Students must repeatedly copy professor names, open external rating sites, search each faculty member, filter reviews, and jump back to the registration portal. This manual context-switching causes missed class enrollments and unnecessary anxiety.',
      },
      {
        number: '03',
        title: 'Design Constraints',
        content:
          'The extension must run silently across diverse university portal layouts (often rendered in legacy table structures or dynamic single-page applications) without causing DOM redraw lag, breaking portal authentication, or leaking user session data.',
      },
      {
        number: '04',
        title: 'My Role & Development Model',
        content:
          'Solo builder. I originated the product vision, created the core architecture, designed the injected UI components, and managed Chrome Web Store publication. I utilized AI-assisted development tools to review code, troubleshoot edge cases in DOM traversal, and accelerate multi-institution compatibility, while maintaining 100% ownership of product architecture, feature priorities, and user testing.',
      },
      {
        number: '05',
        title: 'Architecture & Approach',
        content:
          'Content scripts parse schedule tables on the active tab, identify instructor naming strings, query structured professor data via background endpoints, and dynamically append an unobtrusive rating badge. Hovering or clicking triggers a lightweight, custom-styled review popover displaying overall rating, difficulty, "would take again" percentage, and recent student reviews.',
      },
      {
        number: '06',
        title: 'Core Features',
        content:
          'Includes direct rating chip beside professor names, detailed modal breakdown, minimum score filtering, support for manual search fallback when naming conventions differ, and institutional selection for multi-campus portals.',
      },
      {
        number: '07',
        title: 'Technical Challenge',
        content:
          'University schedules frequently list faculty names inconsistently: some use "Last, First M.", others use abbreviated nicknames ("Bob" vs "Robert"), or leave fields as "Staff". Rigid exact-match queries initially failed on approximately 25% of listings.',
      },
      {
        number: '08',
        title: 'Resolution & Testing',
        content:
          'Engineered a multi-stage string normalizer and fuzzy-matching heuristic that strips honorifics and middle initials, paired with a manual query button right inside the injected card if automated matching encounters ambiguity.',
      },
      {
        number: '09',
        title: 'Outcome & Release',
        content:
          'Successfully verified and published on the official Chrome Web Store. The extension actively assists college students in building balanced course schedules with instant, transparent faculty insights.',
      },
      {
        number: '10',
        title: 'What I Learned',
        content:
          'Building consumer software that injects into untrusted third-party DOMs demands rigorous defensive programming, zero assumptions about HTML structure, and clean decoupling between UI presentation and data retrieval layers.',
      },
    ],
  },
  {
    slug: 'ezer',
    title: 'Ezer',
    type: 'Local AI / Computer Automation / HCI',
    category: 'AI & Automation',
    role: 'Product Concept, Systems Design, UX, & AI-Assisted Development',
    year: '2025–Present',
    status: 'In Active Development',
    isInDevelopment: true,
    shortDescription:
      'Experimental local desktop assistant exploring fast on-device computer-use models. Investigating automated CAD workflows in SolidWorks with strict human-in-the-loop safety gates.',
    longDescription:
      'Ezer is an experimental local desktop assistant engineered to push the frontier of what lightweight, fast on-device models can accomplish in computer control. Instead of sending sensitive desktop telemetry to cloud endpoints, Ezer runs locally to automate repetitive professional workflows—with a particular long-term focus on assisting mechanical engineers inside CAD software like SolidWorks. The project pairs a modern desktop interface with structured automation pipelines and explicit confirmation barriers for destructive operations.',
    techStack: [
      'Tauri',
      'Rust (AI-Assisted)',
      'SolidJS',
      'SQLite',
      'Windows API / PowerShell',
      'Local Model Inference',
    ],
    metrics: [
      { label: 'Status', value: 'In Active Development', highlight: true },
      { label: 'Target Model', value: 'Local On-Device AI' },
      { label: 'Domain Focus', value: 'CAD / SolidWorks' },
      { label: 'Architecture', value: 'Tauri + Rust Backend' },
    ],
    links: {
      github: 'https://github.com/TheLeg336',
    },
    sections: [
      {
        number: '01',
        title: 'Project Concept',
        content:
          'Ezer was born from a simple engineering curiosity: how far can small, locally hosted AI models be pushed to execute complex, multi-step desktop tasks? Rather than relying on cloud-based web scrapers, Ezer is built as an edge-native desktop companion designed to understand engineering workflows.',
      },
      {
        number: '02',
        title: 'The CAD Automation Vision',
        content:
          'Mechanical engineers spend hours performing repetitive CAD tasks: generating standard mounting brackets, establishing sketch constraints, exporting drawing packages, or updating title blocks in SolidWorks. Ezer explores translating natural technical commands (e.g., "Create a mounting bracket in SolidWorks") into deterministic CAD actions.',
      },
      {
        number: '03',
        title: 'Safety & System Constraints',
        content:
          'Local execution is non-negotiable: proprietary engineering designs and CAD models cannot be streamed to third-party cloud servers. Furthermore, automated computer control carries serious risks; Ezer enforces strict "Needs Confirmation" gates before any file modification or execution step occurs.',
      },
      {
        number: '04',
        title: 'My Role & Development Model',
        content:
          'I am the product architect, systems designer, and UX engineer for Ezer. I defined the core interaction paradigms, safety schemas, state machines, and task queues. I am not an expert Rust or SolidJS developer; I intentionally leverage AI-assisted coding to write, review, and debug the underlying systems code while maintaining authoritative control over architecture, testing, and UX design.',
      },
      {
        number: '05',
        title: 'Current Project State',
        content:
          'The frontend user interface—featuring dynamic cognitive state indicators, task queue inspectors, and interactive approval prompts—is nearing visual completion. The backend computer-control bridge and SolidWorks macro integration layers are actively in development.',
      },
      {
        number: '06',
        title: 'System States',
        content:
          'Ezer communicates its operational status via structured visual feedback: Idle (awaiting prompt), Planning (decomposing instruction into step sequence), Working (executing subtasks), Needs Confirmation (holding for user review before file/macro write), and Complete (task verified).',
      },
      {
        number: '07',
        title: 'Technical Hurdle',
        content:
          'Desktop CAD software like SolidWorks relies on complex internal feature trees. If an automation script clicks an unconstrained coordinate or misses a prerequisite sketch plane, subsequent rebuilds fail silently or corrupt the model.',
      },
      {
        number: '08',
        title: 'Architectural Solution',
        content:
          'Exploring structured API and macro commands with explicit pre-condition checks, aiming to guarantee that CAD feature operations are validated before execution.',
      },
      {
        number: '09',
        title: 'Next Milestones',
        content:
          'Finalizing the bridge between local model tool-calling outputs and the Windows automation daemon, followed by controlled testing on basic parametric bracket geometries.',
      },
      {
        number: '10',
        title: 'What I Learned',
        content:
          'Product design in AI tools is fundamentally about establishing human trust. An agent that acts silently is dangerous; an agent that communicates state clearly, asks for confirmation at critical junctures, and runs with complete local privacy is genuinely useful.',
      },
    ],
  },
  {
    slug: 'dualsense',
    title: 'DualSense PC Interface',
    type: 'Embedded Systems / Electronics',
    category: 'Embedded Systems',
    role: 'Designer / Builder',
    year: '2025',
    hardware: 'Raspberry Pi Pico 2 W (RP2350)',
    status: 'Built / Fully Functional',
    shortDescription:
      'Raspberry Pi Pico 2 W-based hardware bridge between a PlayStation DualSense controller and a PC. Handles low-latency I/O translation, dual haptic feedback, adaptive trigger effects, and audio communication.',
    longDescription:
      'Modern gaming controllers like Sony’s DualSense feature sophisticated force-feedback mechanisms—including dual voice-coil haptic actuators and motorized adaptive triggers—that often degrade or fail to communicate over standard PC Bluetooth drivers. This project is a dedicated embedded hardware bridge using the Raspberry Pi Pico 2 W (RP2350) to translate bidirectional communication, emulate a wired interface, and bridge controller inputs and telemetry between PC and controller.',
    techStack: [
      'Raspberry Pi Pico 2 W',
      'RP2350 Microcontroller',
      'Embedded C++ / MicroPython',
      'Precision Soldering',
      'USB HID Translation',
      'Electronics Integration',
    ],
    metrics: [
      { label: 'Microcontroller', value: 'RP2350 (Pico 2 W)' },
      { label: 'Status', value: 'Built & Functional', highlight: true },
      { label: 'Signal Channels', value: '4 Bidirectional' },
      { label: 'Key Telemetry', value: 'Haptics & Triggers' },
      { label: 'Hardware Interface', value: 'Direct Wired Bridge' },
    ],
    links: {
      github: 'https://github.com/TheLeg336',
    },
    sections: [
      {
        number: '01',
        title: 'Project Overview',
        content:
          'An embedded hardware bridge designed around the Raspberry Pi Pico 2 W microcontroller to connect a PlayStation DualSense controller to a PC. The system acts as a translation intermediary, ensuring controller inputs, haptic feedback, adaptive trigger resistance, and microphone/audio communication operate smoothly over a wired bridge.',
      },
      {
        number: '02',
        title: 'The Engineering Challenge',
        content:
          'PCs running standard Bluetooth stacks frequently restrict DualSense controllers to basic generic input modes, stripping out the dual-coil haptic effects, dynamic trigger resistance profiles, and microphone/audio capabilities that make the hardware distinctive.',
      },
      {
        number: '03',
        title: 'System Requirements',
        content:
          'Maintain responsive real-time control input translation and concurrent bidirectional data streams without packet collisions, ensuring clean physical wiring and power distribution across the microcontroller.',
      },
      {
        number: '04',
        title: 'My Role & Hardware Work',
        content:
          'Conceived and built the physical and embedded system. Selected the Raspberry Pi Pico 2 W (leveraging my deep familiarity with the Pico platform), designed the wiring breakout, hand-soldered all header and interconnect pins, flashed and debugged firmware, and verified signal continuity with digital multimeters.',
      },
      {
        number: '05',
        title: 'Hardware Architecture',
        content:
          'Leveraged the dual-core RP2350 architecture on the Pico 2 W to orchestrate polling for controller inputs while handling downstream PC telemetry packets for haptics and trigger resistance.',
      },
      {
        number: '06',
        title: 'Signal Channels & Telemetry',
        content:
          'The interface orchestrates four distinct communication channels: (1) Controller Input: analog stick coordinates, digital buttons, and gyro/accelerometer readings; (2) Haptic Feedback: Dual voice-coil displacement data; (3) Adaptive Triggers: Motorized braking resistance curves; (4) Audio / Microphone: Bidirectional peripheral telemetry.',
      },
      {
        number: '07',
        title: 'Debugging & Signal Bottlenecks',
        content:
          'Initial prototypes experienced intermittent input delays when simultaneous haptic vibration commands were sent down from the PC. Buffer analysis revealed that downstream telemetry was competing for the shared endpoint buffer.',
      },
      {
        number: '08',
        title: 'Optimization & Resolution',
        content:
          'Separated endpoint buffers into prioritized input pipelines and asynchronous telemetry queues, eliminating input starvation while maintaining crisp force-feedback response.',
      },
      {
        number: '09',
        title: 'Functional Outcome',
        content:
          'A working, reliable hardware bridge that enables DualSense functionality on PC with wired reliability and consistent communication.',
      },
      {
        number: '10',
        title: 'What I Learned',
        content:
          'Hands-on embedded design requires rigorous respect for clock cycles, real-time operating constraints, and clean physical wiring. Bridging the gap between raw physical silicon and high-level operating system APIs solidified my appreciation for mechatronic systems.',
      },
    ],
  },
];
