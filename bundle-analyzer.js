// Run: npx webpack-bundle-analyzer dist/stats.json
// Helps identify large dependencies and optimize them
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      generateStatsFile: true,
      statsFilename: 'bundle-stats.json',
    }),
  ],
};
