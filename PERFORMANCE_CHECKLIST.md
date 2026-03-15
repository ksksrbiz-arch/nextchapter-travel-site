# Performance Optimization Checklist

## Bundle Optimization
- [ ] Enable code splitting (main, vendor, async chunks)
- [ ] Tree-shake unused code (Webpack/Vite native)
- [ ] Minify CSS/JS/HTML (production builds)
- [ ] Lazy load routes and components
- [ ] Implement dynamic imports for heavy libraries

## Image & Asset Optimization
- [ ] Compress images (WebP, AVIF formats)
- [ ] Use responsive images (<picture>, srcset)
- [ ] Implement lazy loading (IntersectionObserver)
- [ ] Cache bust with content hashes
- [ ] Use CDN for static assets

## Runtime Performance
- [ ] Implement virtual scrolling (long lists)
- [ ] Use React.memo for expensive components
- [ ] Implement request deduplication
- [ ] Add request caching (HTTP, app-level)
- [ ] Optimize database queries (n+1 prevention)

## Caching Strategy
- [ ] Service Worker for offline support
- [ ] HTTP caching headers (Cache-Control, ETag)
- [ ] Browser cache for static assets
- [ ] API response caching
- [ ] Database query caching

## Monitoring
- [ ] Core Web Vitals (LCP, FID, CLS)
- [ ] Performance budgets per bundle
- [ ] Error rate monitoring
- [ ] API latency tracking
- [ ] User experience metrics (RUM)
