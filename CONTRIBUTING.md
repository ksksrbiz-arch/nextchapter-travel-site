# Contributing to Next Chapter Travel Website

Thank you for your interest in contributing to the Next Chapter Travel website! This document provides guidelines for maintaining code quality and consistency.

## Code Quality Standards

### HTML Best Practices

1. **Semantic HTML**
   - Use appropriate HTML5 semantic elements (`<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`, `<article>`)
   - Include ARIA roles where appropriate
   - Ensure proper heading hierarchy (h1 → h2 → h3, etc.)

2. **Accessibility**
   - All images must have descriptive `alt` attributes
   - Forms must have associated `<label>` elements
   - Include `aria-label` for icon-only buttons
   - Provide skip navigation links for keyboard users
   - Use `aria-required` on required form fields

3. **Structure**
   - Maintain consistent indentation (2 spaces)
   - Include proper DOCTYPE and language attribute
   - Add security meta tags (CSP, X-Frame-Options, X-Content-Type-Options)

### CSS Best Practices

1. **Organization**
   - Group related styles together
   - Use comments to separate sections
   - Follow this order:
     1. Reset/Base styles
     2. Layout
     3. Typography
     4. Components
     5. Utilities
     6. Responsive (media queries)

2. **Naming Conventions**
   - Use kebab-case for class names (`.hero-content`, not `.heroContent`)
   - Be descriptive but concise (`.btn-primary` over `.b1`)
   - Avoid overly specific selectors

3. **Performance**
   - Minimize use of `!important`
   - Avoid deep nesting (max 3 levels)
   - Use shorthand properties where possible
   - Group media queries at the end

4. **Consistency**
   - Button classes: `.btn-primary`, `.btn-secondary`, `.button`, `.cta-btn` (standardize these)
   - Spacing units: Use rem for typography, px for borders
   - Color palette: Define and reuse colors consistently

### Video and Media Guidelines

1. **Video Specifications**
   - Format: MP4 (H.264)
   - Length: 8-15 seconds
   - File size: 3-6 MB
   - Resolution: 1920x1080 (Full HD)
   - Encoding: Use high-quality compression

2. **Video Optimization**
   ```bash
   # Example FFmpeg command for optimization
   ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 128k -movflags +faststart output.mp4
   ```

3. **Fallback Images**
   - Provide fallback images in `/images/` directory
   - Format: JPG for photos
   - Resolution: 1200x800 minimum
   - Optimized file size: under 200KB

### Accessibility Requirements

1. **Minimum Standards**
   - WCAG 2.1 Level AA compliance
   - Keyboard navigation support
   - Screen reader compatible
   - Color contrast ratio of at least 4.5:1 for text

2. **Testing**
   - Test with keyboard only (Tab, Enter, Space, Arrows)
   - Test with screen reader (NVDA, JAWS, or VoiceOver)
   - Validate with axe DevTools or WAVE
   - Check color contrast with WebAIM Contrast Checker

### Security Guidelines

1. **Always Include Security Headers**
   ```html
   <meta http-equiv="X-Content-Type-Options" content="nosniff">
   <meta http-equiv="X-Frame-Options" content="SAMEORIGIN">
   <meta http-equiv="Content-Security-Policy" content="...">
   ```

2. **Form Security**
   - Always validate on server-side
   - Use appropriate input types (`email`, `tel`, `url`)
   - Set appropriate `maxlength` attributes
   - Include `novalidate` to handle validation yourself

3. **Sensitive Data**
   - Never commit API keys or credentials
   - Use environment variables for sensitive config
   - Don't expose internal paths or structure

### Browser Compatibility

Target browsers:
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile Safari (iOS 12+)
- Chrome Mobile (Android 9+)

## Development Workflow

### Before Making Changes

1. **Review existing code** - Understand current patterns
2. **Check issues** - See if your change is already discussed
3. **Test locally** - Verify your changes work

### Making Changes

1. **Keep changes focused** - One feature or fix per commit
2. **Follow existing patterns** - Match the style of surrounding code
3. **Test thoroughly** - Check on multiple browsers and devices
4. **Validate HTML** - Use W3C Validator
5. **Check accessibility** - Use automated tools and manual testing

### Commit Messages

Format:
```
Type: Brief description (50 chars or less)

More detailed explanation if needed. Wrap at 72 characters.
Explain the problem and your solution.

- Bullet points are okay
- Use present tense ("Add feature" not "Added feature")
```

Types:
- `Fix:` Bug fixes
- `Add:` New features
- `Update:` Changes to existing features
- `Remove:` Removing code or features
- `Docs:` Documentation changes
- `Style:` Code style changes (formatting, semicolons, etc.)
- `Refactor:` Code restructuring without behavior change
- `Test:` Adding or updating tests
- `Security:` Security improvements

### Pull Request Process

1. **Describe your changes** - Explain what and why
2. **Link related issues** - Reference issue numbers
3. **Provide test results** - Screenshots, test outcomes
4. **Be responsive** - Address review comments promptly

## Testing Checklist

Before submitting:

- [ ] HTML validates with W3C Validator
- [ ] CSS validates with W3C CSS Validator
- [ ] Works on Chrome, Firefox, Safari, and Edge
- [ ] Works on mobile devices (iOS and Android)
- [ ] Keyboard navigation works properly
- [ ] Screen reader announces content correctly
- [ ] Color contrast meets WCAG AA standards
- [ ] Videos load and play correctly
- [ ] Fallback images work when videos are disabled
- [ ] Forms validate properly
- [ ] No console errors
- [ ] Security headers are present

## Code Review Standards

When reviewing code:

1. **Be constructive** - Suggest improvements, don't just criticize
2. **Ask questions** - Understand intent before suggesting changes
3. **Check for consistency** - Does it match project patterns?
4. **Test the changes** - Pull and verify locally
5. **Consider security** - Look for potential vulnerabilities
6. **Think about accessibility** - Can all users access it?

## Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [W3C HTML Validator](https://validator.w3.org/)
- [W3C CSS Validator](https://jigsaw.w3.org/css-validator/)
- [WebAIM Accessibility Resources](https://webaim.org/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Can I Use](https://caniuse.com/) - Browser compatibility

## Questions?

If you have questions about contributing, please:
1. Check existing documentation
2. Search closed issues
3. Open a new issue with your question

Thank you for contributing to Next Chapter Travel!
