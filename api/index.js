import { InteractionResponseType, InteractionType, verifyKey } from "discord-interactions";

const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${process.env.APPLICATION_ID}&scope=applications.commands`;

export default async (req, res) => {
    if (req?.method === 'POST') {
		const signature = req.headers["x-signature-ed25519"];
		const timestamp = req.headers["x-signature-timestamp"];

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
                case "slap":
                    return res.status(200).send({
                        type: SLAP_COMMAND.type,
                        data: {
                            content: `*<@${message.member.user.id}> slaps <@${message.data.options[0].value}> around a bit with a large trout*`,
                        },
                    });
                    console.log('Slap Request');
                    break;
                case "invite":
                    return res.status(200).send({
                        type: INVITE_COMMAND.type,
                        data: {
                            content: INVITE_URL,
                            flags: 64,
                        },
                    });
                    console.log('Invite request');
                    break;
                case "support":
                    return res.status(200).send({
                        type: SUPPORT_COMMAND.type,
                        data: {
                            content:
                            "Thanks for using my bot! Let me know what you think on twitter (@IanMitchel1). If you'd like to contribute to hosting costs, you can donate at https://github.com/sponsors/ianmitchell",
                            flags: 64,
                        },
                    });
                    console.log('Support request');
                    break;
                case "ping":
                    return res.status(200).send({
                        type: PING_COMMAND.type,
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