"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Command } = require('commander');
const chalk = require('chalk');
const program = new Command();
program
    .name('code-quality-analyzer')
    .description('CLI for Code Quality Analyzer')
    .version('0.1.0');
program
    .command('analyze [path]')
    .description('Analyze a project')
    .option('--no-open', 'Do not open report')
    .option('--output <dir>', 'Output directory', './code-quality-report')
    .option('--ignore <patterns...>', 'Ignore glob patterns')
    .action(async (target = '.', options) => {
    const root = target;
    const output = options.output;
    const openFlag = options.open;
    const ignore = options.ignore || undefined;
    try {
        // dynamic require to give friendlier errors during development when packages are not built
        let core;
        try {
            core = require('@code-quality/core');
        }
        catch (e) {
            // try loading local src for development
            try {
                require('ts-node/register');
                core = require('../../core/src/index');
            }
            catch (err) {
                console.error(chalk.red('Failed to load @code-quality/core. Make sure workspace packages are installed and built.'));
                console.error(chalk.yellow('Run `npm install` at the repo root and `npm run build:all` before using the CLI.'));
                process.exit(1);
            }
        }
        if (!core || typeof core.analyzeProject !== 'function') {
            console.error(chalk.red('Core analyzeProject API not available.'));
            process.exit(1);
        }
        await core.analyzeProject({ root, output, open: openFlag, ignore });
    }
    catch (err) {
        console.error(chalk.red('Analysis failed:'), err && err.message ? err.message : err);
        process.exit(1);
    }
});
if (require.main === module)
    program.parse(process.argv);
exports.default = program;
//# sourceMappingURL=index.js.map