#!/usr/bin/env node

const { select } = require('@inquirer/prompts');
const chalk = require('chalk');

(async () => {
    const banner = chalk.blue.bold(`
        ⢎⡑ ⢀⣀ ⣀⡀ ⢀⣸ ⢀⡀ ⡀⣀ ⣇⡀ ⢀⣸
        ⠢⠜ ⠣⠼ ⠇⠸ ⠣⠼ ⠣⠭ ⠏  ⠇⠸ ⠣⠼
    `);

    console.log(banner);

    const feature = await select({
        message: 'Select starter:',
        choices: [
            { name: 'NextJS Starter', value: 'nextjs' },
            { name: 'Discord JS', value: 'discordjs' },
            { name: 'Discord TS', value: 'discordts' },
        ],
    });

    console.log('Selected:', feature);
})();
