# Contributing to Next Chapter Travel

Thank you for your interest in contributing to Next Chapter Travel! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Security](#security)

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or derogatory comments
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

## Getting Started

### Prerequisites

- Node.js 22+ and pnpm 10.4.1+
- MySQL database (or MySQL-compatible like PlanetScale/TiDB)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/t7451/nextchapter-travel-site.git
   cd nextchapter-travel-site
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Run tests**
   ```bash
   pnpm test
   ```

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

### Creating a Feature

1. **Create a branch from develop**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write code
   - Add tests
   - Update documentation

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push and create pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(portal): add document scanner OCR integration
fix(auth): resolve JWT token expiration issue
docs(api): update tRPC endpoint documentation
refactor(components): extract common form validation logic
```

## Coding Standards

### TypeScript

- **Strict mode enabled** - No `any` types without justification
- **Use proper types** - Define interfaces for complex objects
- **Comment complex logic** - Help future developers understand your code
- **Prefer functional patterns** - Use pure functions when possible

**Example:**
```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  role: 'admin' | 'client';
}

function getUser(id: string): Promise<User | null> {
  // Implementation
}

// ❌ Bad
function getUser(id: any): any {
  // Implementation
}
```

### React Components

- **Functional components** - Use hooks instead of class components
- **Props interface** - Define prop types for all components
- **Meaningful names** - Use descriptive names for components and functions
- **Keep components small** - Extract complex logic into custom hooks

**Example:**
```typescript
// ✅ Good
interface UserCardProps {
  user: User;
  onEdit: (id: string) => void;
}

export function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <Card>
      <h3>{user.email}</h3>
      <Button onClick={() => onEdit(user.id)}>Edit</Button>
    </Card>
  );
}

// ❌ Bad
export function UserCard(props: any) {
  return <div>{props.u.email}</div>;
}
```

### File Organization

```
client/src/
├── _core/          # Core services and utilities
├── components/     # Reusable components
│   └── ui/        # Base UI components (buttons, inputs, etc.)
├── contexts/       # React contexts
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
├── pages/          # Page components
│   ├── admin/     # Admin pages
│   └── portal/    # Client portal pages
└── App.tsx         # Main app component

server/
├── _core/          # Server core
├── routers.ts      # tRPC routers
├── db.ts           # Database utilities
└── auth.ts         # Authentication logic
```

### CSS/Styling

- Use **Tailwind CSS** for styling
- Follow **mobile-first** approach
- Use **semantic class names**
- Avoid inline styles unless necessary

**Example:**
```typescript
// ✅ Good
<div className="flex flex-col gap-4 p-4 md:flex-row md:p-6">
  <Button className="w-full md:w-auto">Submit</Button>
</div>

// ❌ Bad
<div style={{ display: 'flex', padding: '16px' }}>
  <button style={{ width: '100%' }}>Submit</button>
</div>
```

## Testing

### Test Coverage Requirements

- **Unit tests** for business logic (aim for 70%+ coverage)
- **Integration tests** for API endpoints
- **E2E tests** for critical user flows

### Writing Tests

**Unit Test Example:**
```typescript
import { describe, it, expect } from 'vitest';
import { validateEmail } from './validation';

describe('validateEmail', () => {
  it('should accept valid email addresses', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  it('should reject invalid email addresses', () => {
    expect(validateEmail('invalid-email')).toBe(false);
  });
});
```

**Integration Test Example:**
```typescript
import { describe, it, expect } from 'vitest';
import { appRouter } from './routers';

describe('trips.list', () => {
  it('should return trips for authenticated user', async () => {
    const caller = appRouter.createCaller({ user: { id: 'user-1' } });
    const trips = await caller.trips.list();
    expect(Array.isArray(trips)).toBe(true);
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage
```

## Pull Request Process

### Before Submitting

1. ✅ **Tests pass** - `pnpm test`
2. ✅ **Linting passes** - `pnpm lint`
3. ✅ **Type checking passes** - `pnpm check`
4. ✅ **Build succeeds** - `pnpm build`
5. ✅ **Documentation updated** - If applicable
6. ✅ **Changelog updated** - For notable changes

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests pass locally
```

### Review Process

1. **Automated checks** run via GitHub Actions
2. **Code review** by at least one maintainer
3. **Address feedback** and update PR
4. **Approval** from maintainer
5. **Merge** to develop branch

## Security

### Reporting Security Issues

**DO NOT** open public issues for security vulnerabilities.

Instead, email: security@example.com (or contact repository owner)

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Security Best Practices

- **Never commit secrets** - Use environment variables
- **Sanitize user input** - Validate all inputs
- **Use HTTPS** - Always in production
- **Keep dependencies updated** - Regular security audits
- **Follow OWASP guidelines** - Secure coding practices

## Questions?

- Open a discussion on GitHub Discussions
- Join our community chat (if available)
- Contact maintainers

Thank you for contributing! 🎉
