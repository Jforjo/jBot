import { InteractionResponseType, InteractionType, verifyKey } from "discord-interactions";

const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${process.env.APPLICATION_ID}&scope=applications.commands`;

export default async (req, res) => {
    if (req?.method === 'POST') {
		const signature = req.headers["x-signature-ed25519"];
		const timestamp = req.headers["x-signature-timestamp"];
        const rawBody = JSON.stringify(req.body); 

        const isValidRequest = verifyKey(
            rawBody,
            signature,
            timestamp,
            process.env.PUBLIC_KEY
        );

        if (!isValidRequest) {
            console.error('Invalid Request');
            return res.status(401).send({ error: 'Bad request signature' });
        }

        const message = req.body;
        const date = new Date();


        if (message.type === InteractionType.PING) {
            console.log('Handling Ping request');
            return res.send({
                type: InteractionResponseType.PONG,
            });
        } else if (message.type === InteractionType.APPLICATION_COMMAND) {
            switch (message.data.name.toLowerCase()) {
                // case "slap":
                //     console.log('Slap Request');
                //     return res.status(200).send({
                //         type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                //         data: {
                //             content: `*<@${message.member.user.id}> slaps <@${message.data.options[0].value}> around a bit with a large trout*`,
                //         },
                //     });
                //     break;
                case "invite":
                    console.log('Invite request');
                    return res.status(200).send({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: {
                            content: INVITE_URL,
                            flags: 64,
                        },
                    });
                    break;
                case "support":
                    console.log('Support request');
                    return res.status(200).send({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: {
                            content: null,
                            embeds: [
                                {
                                    title: "What to support me?",
                                    color: 16738740,
                                    footer: {
                                        text: "https://ko-fi.com/jforjo",
                                        icon_url: "https://storage.ko-fi.com/cdn/brandasset/kofi_s_logo_nolabel.png"
                                    },
                                    timestamp: date.toISOString(),
                                    image: {
                                        url: "https://storage.ko-fi.com/cdn/brandasset/kofi_button_red.png"
                                    }
                                }
                            ],
                            attachments: [],
                            components: [
                                {
                                    type: 1,
                                    components: [
                                        {
                                            type: 2,
                                            label: "Support me!",
                                            style: 5,
                                            url: "https://ko-fi.com/jforjo"
                                        }
                                    ]
                                }
                            ]
                        },
                    });
                    break;
                case "ping":
                    console.log('Ping request');
                    return res.status(200).send({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: {
                            content: "Pong!"
                        },
                    });
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