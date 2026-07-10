const path = require('path');
const { analyzeProject } = (() => {
  try {
    return require('@code-quality/core');
  } catch (e) {}
  try { return require(path.join(__dirname, '..', 'packages', 'core', 'dist', 'index.js')); } catch (e) {}
  try { require('ts-node/register'); return require(path.join(__dirname, '..', 'packages', 'core', 'src', 'index.ts')); } catch (e) {}
  console.error('Unable to load core analyzeProject. Build the project or install ts-node to run directly.');
  process.exit(1);
})();

(async ()=>{
  const sampleRoot = path.join(__dirname, '..', 'packages', 'examples', 'sample-project');
  await analyzeProject({ root: sampleRoot, output: path.join(sampleRoot, 'code-quality-report'), open: false });
  console.log('Sample analysis complete');
})();
