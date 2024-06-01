import { InteractionResponseType } from "discord-interactions";
import { InstallGlobalCommands, DeleteGlobalCommands } from "../utils";

const COMMANDS = [];

// COMMANDS.push({
//     name: 'invite',
//     description: 'Get an invite link to add the bot to your server',
//     type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
// });

// COMMANDS.push({
//     name: 'support',
//     description: 'Like this bot? Support me!',
//     type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
// });

// COMMANDS.push({
//     name: 'ping',
//     description: 'Replies with Pong!',
//     type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
// });

COMMANDS.push({
    name: 'clicker',
    description: 'Play a clicker game!',
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
});

export default async (req, res) => {
    await InstallGlobalCommands(process.env.APPLICATION_ID, COMMANDS);
    // await DeleteGlobalCommands(process.env.APPLICATION_ID, []);
    return res.json({ message: "Commands Loaded" });
}