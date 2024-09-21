import { InteractionResponseType } from "discord-interactions";
import { InstallGlobalCommands, DeleteGlobalCommands, InstallGuildCommands } from "../utils";

const COMMANDS = [];

COMMANDS.push({
    name: 'invite',
    description: 'Get an invite link to add the bot to your server',
});

COMMANDS.push({
    name: 'support',
    description: 'Like this bot? Support me!',
});

COMMANDS.push({
    name: 'ping',
    description: 'Replies with Pong!',
});

COMMANDS.push({
    name: 'checkapi',
    description: 'Hypixel Skyblock command: Check if a user\'s API is enabled',
    options: [
        {
            name: 'username',
            description: 'The username of the user',
            type: 3,
            required: true
        },
        {
            name: 'profile',
            description: 'The profile of the user',
            type: 3,
        }
    ]
});

COMMANDS.push({
    name: 'clicker',
    description: 'Play a clicker game!',
});

COMMANDS.push({
    name: 'ticket',
    description: 'Display a ticket embed',
});

export default async (req, res) => {
    // await InstallGlobalCommands(process.env.APPLICATION_ID, COMMANDS);
    await DeleteGlobalCommands(process.env.APPLICATION_ID, COMMANDS);
    await InstallGuildCommands(process.env.APPLICATION_ID, process.env.GUILD_ID, COMMANDS);
    return res.json({ message: "Commands Loaded" });
}
