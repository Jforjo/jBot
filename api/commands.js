import { InteractionResponseType } from "discord-interactions";
import { InstallGlobalCommands } from "./utils";

const COMMANDS = [];

COMMANDS.push({
    name: 'slap',
    description: 'Sometimes you gotta slap a person with a large trout',
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
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
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
});

COMMANDS.push({
    name: 'support',
    description: 'Like this bot? Support me!',
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
});

COMMANDS.push({
    name: 'ping',
    description: 'Ping the bot',
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
});

export default async (req, res) => {
    await InstallGlobalCommands(process.env.APPLICATION_ID, COMMANDS);
    return res.json({ message: "Commands Loaded" });
}