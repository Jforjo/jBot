import { InteractionResponseType } from "discord-interactions";

export default async (req, res) => {
    const date = new Date();
    return res.status(200).send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: null,
            embeds: [
                {
                    title: "Invite the bot to your server!",
                    color: parseInt("FF69B4", 16),
                    footer: {
                        text: "https://ko-fi.com/jforjo",
                        icon_url: "https://storage.ko-fi.com/cdn/brandasset/kofi_s_logo_nolabel.png"
                    },
                    timestamp: date.toISOString(),
                }
            ],
            attachments: [],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "Invite me!",
                            style: 5,
                            url: `https://discord.com/oauth2/authorize?client_id=${process.env.APPLICATION_ID}&scope=applications.commands`
                        }
                    ]
                }
            ]
        },
    });
}