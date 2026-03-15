# Vite Optimization Recommendations
- Enable code splitting: build.rollupOptions.output.manualChunks
- Enable tree-shaking: build.rollupOptions.treeshake
- Optimize dependencies: optimizeDeps.include
- Source maps for production: build.sourcemap = 'hidden'
- CSS code splitting: build.rollupOptions.output.assetFileNames
