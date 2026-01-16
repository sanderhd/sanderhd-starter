#!/usr/bin/env node

import { input, select } from '@inquirer/prompts';
import chalk from 'chalk';
import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
const packageJson = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

if (process.argv.includes('--version')) {
    console.log(chalk.blue.bold(`sanderhd-starter v${packageJson.version}`));
    process.exit(0);
}

if (process.argv.includes('--help')) {
    console.log(`
        ${chalk.blue.bold('sanderhd-starter')} v${packageJson.version}

        ${chalk.bold('Usage:')}
        sanderhd-starter [options]

        ${chalk.bold('Options:')}
        --version    Show version number
        --help       Show help

        ${chalk.bold('Starters:')}
        • NextJS Starter
        • Discord JS Classic
        • Discord JS Advanced
        `);
    process.exit(0);
}

console.clear();

(async () => {
    try {
        const banner = chalk.blue.bold(`
            ⢎⡑ ⢀⣀ ⣀⡀ ⢀⣸ ⢀⡀ ⡀⣀ ⣇⡀ ⢀⣸
            ⠢⠜ ⠣⠼ ⠇⠸ ⠣⠼ ⠣⠭ ⠏  ⠇⠸ ⠣⠼
        `);

        console.log(banner);

        const feature = await select({
            message: 'Select starter:',
            choices: [
                { name: 'NextJS Starter', value: 'nextjs' },
                { name: 'Discord JS Classic', value: 'discordjs-classic' },
                { name: 'Discord JS Advanced', value: 'discordjs' },
            ],
        });

        if (feature === 'nextjs') {
            const appName = await input({
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
                '--yes',
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
            });
        }

        if (feature === 'discordjs-classic') {
            const botName = await input({
                message: 'Enter a message for your discord bot:',
                initial: 'my-discord-bot'
            });

            const projectPath = path.join(process.cwd(), botName);

            console.log(`${new Date().toLocaleTimeString()} ${chalk.blue(`INFO:`)} Creating Discord Bot in: ${botName}\n`);

            fs.mkdirSync(projectPath, { recursive: true });
            process.chdir(projectPath);

            execSync('npm init -y', { stdio: `inherit` });

            execSync('npm install discord.js dotenv', { stdio: 'inherit' });

            fs.mkdirSync('src');
            fs.mkdirSync('src/events');
            fs.mkdirSync('src/commands');
            fs.mkdirSync('src/config')

            fs.writeFileSync('.env', 'DISCORD_TOKEN=\n');
            fs.writeFileSync('.env.example', 'DISCORD_TOKEN=your_token_here\n');

            fs.writeFileSync('src/config/config.json', JSON.stringify({
                prefix: "!",
                embedColor: "#5865F2",
                status: "Playing with sanderhd-starter"
            }, null, 4));


            fs.writeFileSync('src/index.js', `
const { Client, Collection, GatewayIntentBits, ActivityType } = require('discord.js');
require('dotenv').config();
const config = require('./config/config.json');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.commands = new Collection();

const fs = require('fs');
const path = require('path');

const eventsPath = path.join(__dirname, 'events');
for (const file of fs.readdirSync(eventsPath)) {
    const event = require(\`./events/\${file}\`);
    client.on(event.name, (...args) => event.execute(client, ...args));
}

const commandsPath = path.join(__dirname, 'commands');
for (const file of fs.readdirSync(commandsPath)) {
    const command = require(\`./commands/\${file}\`);
    client.commands.set(command.name, command);
}

client.on('messageCreate', (message) => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    command.execute(client, message, args, config);
});

client.login(process.env.DISCORD_TOKEN);
            `.trim());

            fs.writeFileSync('src/events/ready.js', `
module.exports = {
    name: 'ready',
    execute(client) {
        const config = require('../config/config.json');
        client.user.setActivity(config.status, { type: 0 });
        console.log(\`✅ Logged in as \${client.user.tag}\`);
        console.log(\`📡 Status set to: \${config.status}\`);
    }
};
            `.trim());

            fs.writeFileSync('src/commands/ping.js', `
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ping',
    execute(client, message, args, config) {
        const embed = new EmbedBuilder()
            .setTitle('🏓 Pong!')
            .setDescription(\`Latency: **\${client.ws.ping}ms**\`)
            .setColor(config.embedColor)
            .setFooter({ text: 'sanderhd-starter' });

        message.reply({ embeds: [embed] });
    }
};
            `.trim());

            console.log((`${new Date().toLocaleTimeString()} ${chalk.green(`SUCCES:`)} Discord bot ${botName} is ready!`));
            console.log((`${new Date().toLocaleTimeString()} ${chalk.blue(`INFO:`)} To get started: \n  cd ${botName}\n  node src/index.js`));
        }

        if (feature === 'discordjs') {
            const botName = await input({
                message: 'Enter a name for your Discord bot:',
                initial: 'my-discord-bot'
            });

            const projectPath = path.join(process.cwd(), botName);

            console.log(`${new Date().toLocaleTimeString()} ${chalk.blue(`INFO:`)} Creating Discord JS Advanced bot in ${botName}\n`);

            fs.mkdirSync(projectPath, { recursive: true });
            process.chdir(projectPath);

            execSync('npm init -y', { stdio: 'inherit' });
            execSync('npm install discord.js dotenv', { stdio: 'inherit' });

            fs.mkdirSync('src');
            fs.mkdirSync('src/events');
            fs.mkdirSync('src/commands');
            fs.mkdirSync('src/config');

            fs.writeFileSync('.env', 'DISCORD_TOKEN=\n');
            fs.writeFileSync('.env.example', 'DISCORD_TOKEN=your_token_here\n');

            fs.writeFileSync('src/config/config.json', JSON.stringify({
                prefix: "!",
                embedColor: "#5865F2",
                status: "Playing with sanderhd-starter"
            }, null, 4));

            fs.writeFileSync('src/index.js', `
const { Client, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const config = require('./config/config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
for (const file of fs.readdirSync(commandsPath)) {
    const command = require(\`./commands/\${file}\`);
    if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    }
}

client.once('ready', async () => {
    console.log(\`✅ Logged in as \${client.user.tag}\`);
    client.user.setActivity(config.status, { type: 0 });

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    try {
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        );
        console.log(\`📡 Slash commands registered!\`);
    } catch (err) {
        console.error(err);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction, config);
    } catch (err) {
        console.error(err);
        await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
    }
});

client.login(process.env.DISCORD_TOKEN);
        `.trim());

        fs.writeFileSync('src/commands/ping.js', `
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('🏓 Check the bot latency'),
    async execute(interaction, config) {
        const embed = new EmbedBuilder()
            .setTitle('🏓 Pong!')
            .setDescription(\`Latency: **\${Date.now() - interaction.createdTimestamp}ms**\`)
            .setColor(config.embedColor)
            .setFooter({ text: 'sanderhd-starter' });

        await interaction.reply({ embeds: [embed] });
    }
};
        `.trim());

        console.log(`${new Date().toLocaleTimeString()} ${chalk.green(`SUCCESS:`)} Discord JS Advanced bot "${botName}" is ready!`);
        console.log(`${new Date().toLocaleTimeString()} ${chalk.blue(`INFO:`)} To get started:\n  cd ${botName}\n  node src/index.js`);
        }
        
        } catch (err) {
            if (err?.name === 'ExitPromptError') {
                console.log('\n' + chalk.blue('Bye! Thanks for using sanderhd-starter!'));
                process.exit(0);
            } 

            console.error(chalk.red('Unexpected error:'), err);
            process.exit(1);
        }
    })
();