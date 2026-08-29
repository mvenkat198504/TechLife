export const categories = [
  {
    id: 'csharp',
    slug: 'csharp',
    name: 'C#',
    description: 'C# language fundamentals, OOP, async/await, LINQ, and advanced concepts',
    icon: 'code-slash',
    displayOrder: 1,
  },
  {
    id: 'aspnet-core',
    slug: 'aspnet-core',
    name: 'ASP.NET Core',
    description: 'Web framework, middleware, dependency injection, and request pipeline',
    icon: 'globe',
    displayOrder: 2,
  },
  {
    id: 'ef-core',
    slug: 'ef-core',
    name: 'Entity Framework Core',
    description: 'ORM, LINQ to Entities, migrations, and database design patterns',
    icon: 'database',
    displayOrder: 3,
  },
   {
    id: 'javascript',
    slug: 'javascript',
    name: 'JavaScript',
    description: 'ES6+, closures, prototypes, async patterns, and browser APIs',
    icon: 'file-earmark-code',
    displayOrder: 12,
  },
  {
    id: 'react',
    slug: 'react',
    name: 'React',
    description: 'Components, hooks, state management, performance optimization',
    icon: 'braces',
    displayOrder: 10,
  },
  {
    id: 'angular',
    slug: 'angular',
    name: 'Angular',
    description: 'TypeScript framework, directives, services, and RxJS',
    icon: 'brackets',
    displayOrder: 11,
  },
  {
    id: 'sql-server',
    slug: 'sql-server',
    name: 'SQL Server',
    description: 'Queries, indexing, performance tuning, and database design',
    icon: 'table',
    displayOrder: 4,
  },
  {
    id: 'azure',
    slug: 'azure',
    name: 'Azure',
    description: 'Cloud services, App Service, databases, and deployment',
    icon: 'cloud',
    displayOrder: 5,
  },
  {
    id: 'devops',
    slug: 'devops',
    name: 'Azure DevOps',
    description: 'CI/CD pipelines, git, deployment strategies, and monitoring',
    icon: 'tools',
    displayOrder: 6,
  },
  {
    id: 'microservices',
    slug: 'microservices',
    name: 'Microservices',
    description: 'Service design, communication patterns, and distributed systems',
    icon: 'diagram-3',
    displayOrder: 7,
  },
  {
    id: 'design-patterns',
    slug: 'design-patterns',
    name: 'Design Patterns',
    description: 'SOLID principles, creational, structural, and behavioral patterns',
    icon: 'pencil-square',
    displayOrder: 8,
  },
  {
    id: 'system-design',
    slug: 'system-design',
    name: 'System Design',
    description: 'Scalability, load balancing, caching, and architectural decisions',
    icon: 'bezier2',
    displayOrder: 9,
  },
  
 
];

export const getCategoryById = (id) => {
  return categories.find((cat) => cat.id === id);
};

export const getCategoryBySlug = (slug) => {
  return categories.find((cat) => cat.slug === slug);
};
