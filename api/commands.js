import { InstallGlobalCommands } from "./utils";

const COMMANDS = [];

COMMANDS.push({
    name: 'Slap',
    description: 'Sometimes you gotta slap a person with a large trout',
    type: 1,
    options: [
        {
            name: 'user',
            description: 'The user to slap',
            type: 6,
            required: true,
        },
    ],
});

COMMANDS.push({
    name: 'Invite',
    description: 'Get an invite link to add the bot to your server',
    type: 1,
});

COMMANDS.push({
    name: 'Support',
    description: 'Like this bot? Support me!',
    type: 1,
});

COMMANDS.push({
    name: 'Ping',
    description: 'Ping the bot',
    type: 1,
});

InstallGlobalCommands(process.env.APPLICATION_ID, COMMANDS);