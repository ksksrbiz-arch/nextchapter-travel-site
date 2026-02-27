# Security Guidelines

This document outlines the security measures implemented in the Next Chapter Travel website and provides guidelines for maintaining security.

## Implemented Security Measures

### Content Security Policy (CSP)

All HTML pages include Content Security Policy headers to prevent XSS attacks:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data:; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; form-action 'self';">
```

**What it does:**
- Restricts content sources to same origin by default
- Allows inline scripts and styles (required for current implementation)
- Permits external fonts from Google Fonts
- Restricts form submissions to same origin

### Additional Security Headers

**X-Content-Type-Options:**
```html
<meta http-equiv="X-Content-Type-Options" content="nosniff">
```
Prevents MIME type sniffing attacks.

**X-Frame-Options:**
```html
<meta http-equiv="X-Frame-Options" content="SAMEORIGIN">
```
Prevents clickjacking by disallowing the site to be embedded in iframes from other domains.

### Form Security

The contact form in `/nextchapter/contact.html` includes:

1. **Input Validation:**
   - Name: 2-100 characters
   - Email: Valid email format with pattern validation
   - Message: 10-1000 characters

2. **ARIA Attributes:**
   - `aria-required="true"` for all required fields
   - Proper `id` and `for` associations between labels and inputs

3. **HTML5 Validation:**
   - `required` attribute on all fields
   - `minlength` and `maxlength` constraints
   - Email pattern validation

## Recommendations for Production

### 1. Server-Side Form Handling

The current contact form uses `action="#"` which is a placeholder. For production:

- **Implement server-side validation** - Never trust client-side validation alone
- **Use CSRF tokens** - Add Cross-Site Request Forgery protection
- **Sanitize all inputs** - Clean data before processing
- **Rate limiting** - Prevent spam and abuse
- **Email validation** - Verify email addresses before sending

Example CSRF implementation (to be added):
```html
<input type="hidden" name="csrf_token" value="GENERATED_TOKEN">
```

### 2. HTTPS Enforcement

- **Always use HTTPS in production**
- Configure your web server to redirect HTTP to HTTPS
- Implement HSTS (HTTP Strict Transport Security) headers

For Netlify (already configured in netlify.toml):
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Strict-Transport-Security = "max-age=31536000; includeSubDomains"
```

### 3. Email Link Security

Current implementation uses `mailto:` links. Consider:
- Using a contact form instead of direct email links (reduces spam)
- If using mailto, be aware of email harvesting by bots
- Consider obfuscating email addresses or using a contact form service

### 4. Video and Media Security

- **Host videos on CDN** - Use a dedicated CDN for video content
- **Compress and optimize** - Keep video files 3-6 MB, 8-15 seconds
- **Access control** - If content is sensitive, implement access controls
- **Hotlink protection** - Prevent unauthorized embedding of your videos

### 5. Dependency Management

This is a static site with no dependencies, but if you add:
- Keep all dependencies up to date
- Regularly audit for vulnerabilities
- Use tools like npm audit or Dependabot

### 6. Content Management

- **Sanitize user-generated content** - If you add comments or reviews
- **File upload validation** - If allowing uploads, validate file types and sizes
- **Database security** - If adding a backend, use parameterized queries

## Security Checklist for Deployment

- [ ] HTTPS is enabled and enforced
- [ ] CSP headers are properly configured
- [ ] Forms have server-side validation
- [ ] CSRF protection is implemented
- [ ] Rate limiting is in place
- [ ] Error messages don't reveal sensitive information
- [ ] Backup system is in place
- [ ] Security headers are tested (use securityheaders.com)
- [ ] Regular security audits are scheduled

## Reporting Security Issues

If you discover a security vulnerability, please:
1. **Do not** open a public GitHub issue
2. Email security concerns to: [YOUR_SECURITY_EMAIL]
3. Provide detailed information about the vulnerability
4. Allow reasonable time for a fix before public disclosure

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Mozilla Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)
- [Content Security Policy Reference](https://content-security-policy.com/)
- [Security Headers Test](https://securityheaders.com/)

## License and Legal

- Ensure all content complies with copyright laws
- Disney trademarks and properties require proper authorization
- Include appropriate attribution for third-party content
- Maintain privacy policy if collecting user data
