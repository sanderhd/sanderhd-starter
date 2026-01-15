#!/usr/bin/env node

const prompts = require('@inquirer/prompts')
const chalk = require('chalk');
const { spawn } = require('child_process');

(async () => {
    const banner = chalk.blue.bold(`
        ⢎⡑ ⢀⣀ ⣀⡀ ⢀⣸ ⢀⡀ ⡀⣀ ⣇⡀ ⢀⣸
        ⠢⠜ ⠣⠼ ⠇⠸ ⠣⠼ ⠣⠭ ⠏  ⠇⠸ ⠣⠼
    `);

    console.log(banner);

    const feature = await prompts.select({
        message: 'Select starter:',
        choices: [
            { name: 'NextJS Starter', value: 'nextjs' },
            { name: 'Discord JS', value: 'discordjs' },
            { name: 'Discord TS', value: 'discordts' },
        ],
    });

    if (feature === 'nextjs') {
        const appName = await prompts.input({
            message: 'Enter a name for your Next.JS app:',
            initial: 'my-next-app', 
        })

        console.log(`${new Date().toLocaleTimeString()} ${chalk.blue(`INFO:`)} Creating Next.JS app: ${appName}\n`);

        const args = [
            'create-next-app@latest',
            appName,
            '--typescript',
            '--eslint',
            '--tailwind',
            '--app',
            '--src-dir',
            '--import-alias', '@/*',
            '--no-turbopack'
        ];

        const child = spawn('npx', args, {
            stdio: 'inherit',
            shell: true
        });

        child.on('exit', (code) => {
            if (code === 0) {
                console.log(chalk.green(`\n✓ Next.JS app "${appName}" is ready!`));
                console.log(chalk.blue(`\nTo get started:\n  cd ${appName}\n  npm run dev`));
            } else {
                console.log(chalk.red(`\n✗ Failed to create Next.JS app. Exit code ${code}`))
            }
        })
    }
})();
