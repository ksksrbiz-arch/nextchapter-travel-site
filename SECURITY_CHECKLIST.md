# Security & Dependency Audit

## Dependency Management
- [ ] Run: npm audit
- [ ] Fix vulnerabilities: npm audit fix --force
- [ ] Update outdated packages: npm update
- [ ] Review supply chain: npm ls --depth=0

## Code Security
- [ ] No hardcoded secrets in code
- [ ] Environment variables for sensitive data
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection (output encoding)
- [ ] CORS configured properly

## Authentication & Authorization
- [ ] Secure password storage (bcrypt, Argon2)
- [ ] JWT signature verification
- [ ] Role-based access control (RBAC)
- [ ] Rate limiting on auth endpoints
- [ ] Session timeout implementation

## Deployment
- [ ] HTTPS enforced
- [ ] Security headers configured (CSP, HSTS)
- [ ] No debug info in production
- [ ] Secrets encrypted at rest
- [ ] Regular backup strategy
