import { InstallGlobalCommands } from "./utils";

const COMMANDS = [];

COMMANDS.push({
    name: 'slap',
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
    name: 'invite',
    description: 'Get an invite link to add the bot to your server',
    type: 1,
});

COMMANDS.push({
    name: 'support',
    description: 'Like this bot? Support me!',
    type: 1,
});

COMMANDS.push({
    name: 'ping',
    description: 'Ping the bot',
    type: 1,
});

export default async (req, res) => {
    const status = await InstallGlobalCommands(process.env.APPLICATION_ID, COMMANDS);
    if (status.ok) return res.json({ message: "Commands Loaded" });
    else return res.json({ message: "Commands NOT Loaded" });
}