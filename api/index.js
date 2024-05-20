import { InteractionResponseType, InteractionType, verifyKey } from "discord-interactions";
import getRawBody from "raw-body";

const SLAP_COMMAND = {
    name: 'Slap',
    description: 'Sometimes you gotta slap a person with a large trout',
    options: [
        {
            name: 'user',
            description: 'The user to slap',
            type: 6,
            required: true,
        },
    ],
};

const INVITE_COMMAND = {
    name: 'Invite',
    description: 'Get an invite link to add the bot to your server',
};

const SUPPORT_COMMAND = {
    name: 'Support',
    description: 'Like this bot? Support me!',
};

const PING_COMMAND = {
    name: 'Ping',
    description: 'Ping the bot'
}

const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${process.env.APPLICATION_ID}&scope=applications.commands`;

export default async (req, response) => {
    if (req?.method === 'POST') {
        const signature = req.get('X-Signature-Ed25519');
        const timestamp = req.get('X-Signature-Timestamp');

        const isValidRequest = verifyKey(
            req.rawBody,
            signature,
            timestamp,
            process.env.PUBLIC_KEY
        );

        if (!isValidRequest) {
            console.error('Invalid Request');
            return res.status(401).send({ error: 'Bad request signature' });
        }

        const message = req.body;

        if (message.type === InteractionType.PING) {
            console.log('Handling Ping request');
            return res.send({
                type: InteractionResponseType.PONG,
            });
        } else if (message.type === InteractionType.APPLICATION_COMMAND) {
            switch (message.data.name.toLowerCase()) {
                case SLAP_COMMAND.name.toLowerCase():
                    return res.status(200).send({
                        type: 4,
                        data: {
                            content: `*<@${message.member.user.id}> slaps <@${message.data.options[0].value}> around a bit with a large trout*`,
                        },
                    });
                    console.log('Slap Request');
                    break;
                case INVITE_COMMAND.name.toLowerCase():
                    return res.status(200).send({
                        type: 4,
                        data: {
                            content: INVITE_URL,
                            flags: 64,
                        },
                    });
                    console.log('Invite request');
                    break;
                case SUPPORT_COMMAND.name.toLowerCase():
                    return res.status(200).send({
                        type: 4,
                        data: {
                            content:
                            "Thanks for using my bot! Let me know what you think on twitter (@IanMitchel1). If you'd like to contribute to hosting costs, you can donate at https://github.com/sponsors/ianmitchell",
                            flags: 64,
                        },
                    });
                    console.log('Support request');
                    break;
                case PING_COMMAND.name.toLowerCase():
                    return res.status(200).send({
                        type: 4,
                        data: {
                            content: "Pong!"
                        },
                    });
                    console.log('Support request');
                    break;
                default:
                    console.error('Unknown Command');
                    return res.status(400).send({ error: 'Unknown Type' });
                    break;
            }
        } else {
            console.error('Unknown Type');
            return res.status(400).send({ error: 'Unknown Type' });
        }
    } else {
        return res.json({ error: "Request method must be of type POST" });
    }
};