export const projects = [
  {
    slug: 'information-retrieval-engine',
    title: 'Information Retrieval Engine',
    category: 'Search & Algorithms',
    description:
      'A from-scratch search system covering the full retrieval pipeline — crawling, indexing, ranking, clustering, and recommendation.',
    highlights: [
      'Custom multithreaded web crawler with politeness/robots.txt handling',
      'PageRank implementation for link-based document authority',
      'Boolean retrieval model over an inverted index',
      'K-Means clustering for unsupervised document grouping',
      'Content-based recommendation engine for related results',
    ],
    tech: ['Python', 'C++', 'NumPy', 'Flask'],
    links: { github: 'https://github.com/your-username/ir-engine', demo: null },
  },
  {
    slug: 'hospital-management-system',
    title: 'Hospital Management System',
    category: 'System Design',
    description:
      'An academic group project translating real hospital workflows — patient intake, scheduling, billing, records — into a structured, role-based application.',
    highlights: [
      'Full SDLC: requirements, use-case diagrams, ER modeling',
      'Layered architecture separating data, business logic, and UI',
      'Role-based access for admins, doctors, and reception staff',
      'Relational schema designed for data integrity and auditability',
    ],
    tech: ['Java', 'C#', '.NET', 'SQL'],
    links: { github: 'https://github.com/your-username/hospital-management', demo: null },
  },
  {
    slug: 'interactive-content-platform',
    title: 'Interactive Content Platform',
    category: 'Full-Stack Web',
    description:
      'A content hub built to host technical writing and small interactive experiences side by side — part blog, part playground.',
    highlights: [
      'Markdown/MDX-based article and blog pipeline',
      'Embedded mini-games rendered as interactive components',
      'Responsive, component-driven UI with reusable layout primitives',
      'Authentication and content management for publishing flow',
    ],
    tech: ['React', 'Next.js', 'Node.js', 'MongoDB'],
    links: { github: 'https://github.com/NonTecyUser/content-platform', demo: 'https://your-demo-url.com' },
  },
];