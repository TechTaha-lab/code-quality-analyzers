#!/usr/bin/env node
const { Command } = require('commander');

const program = new Command();

program
  .name('cqa')
  .description('CLI for Code Quality Analyzer')
  .version('0.1.2');

program
  .command('analyze [path]')
  .alias('a')
  .description('Analyze a project')
  .option('--no-open', 'Do not open report')
  .option('--output <dir>', 'Output directory', './code-quality-report')
  .option('--ignore <patterns...>', 'Ignore glob patterns')
  .action(async (target = '.', options: any) => {
    const root = target;
    const output = options.output;
    const openFlag = options.open;
    const ignore = options.ignore || undefined;

    try {
      console.log('Code Quality Analyzer');
      console.log(`Target: ${root}`);
      console.log(`Output: ${output}`);
      console.log();

      // dynamic require to give friendlier errors during development when packages are not built
      let core: any;
      try {
        core = require('@code-quality/core');
      } catch (e) {
        // try loading local src for development
        try {
          require('ts-node/register');
          core = require('../../core/src/index');
        } catch (err) {
          console.error('Failed to load @code-quality/core. Make sure workspace packages are installed and built.');
          console.error('Run `npm install` at the repo root and `npm run build:all` before using the CLI.');
          process.exit(1);
        }
      }

      if (!core || typeof core.analyzeProject !== 'function') {
        console.error('Core analyzeProject API not available.');
        process.exit(1);
      }

      await core.analyzeProject({ root, output, open: openFlag, ignore });
    } catch (err: any) {
      console.error('Analysis failed:', err && err.message ? err.message : err);
      process.exit(1);
    }
  });

if (require.main === module) program.parse(process.argv);

export default program;

