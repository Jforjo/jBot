import { InteractionType, InteractionResponseType, MessageComponentTypes, ButtonStyleTypes } from "discord-interactions";
import { sql } from "@vercel/postgres";

const clickerHasUser = async (id) => {
    const { rows } = await sql`SELECT id FROM clicker WHERE id = ${id};`;
    return rows.length > 0;
}

export default async (req, res) => {
    const interaction = req.body;
    const date = new Date();
    let userid = null;
    if (interaction.user != null) {
        // The command was a DM
        userid = interaction.user.id;
    } else if (interaction.member != null) {
        // The command was in a server
        userid = interaction.member.user.id;
    }

    if (userid == null) {
        // Should never run
        return res.status(200).send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: null,
                embeds: [
                    {
                        title: "Something went wrong!",
                        description: "I could not detect who ran this command.",
                        color: parseInt("B00020", 16),
                        footer: {
                            text: "https://ko-fi.com/jforjo",
                            icon_url: "https://storage.ko-fi.com/cdn/brandasset/kofi_s_logo_nolabel.png"
                        },
                        timestamp: date.toISOString()
                    }
                ],
            },
        });
    }

    if (!await clickerHasUser(userid)) {
        await sql`INSERT INTO clicker (id) VALUES (${userid});`;
    }

    const { rows } = await sql`SELECT clicks FROM clicker WHERE id = ${userid};`;
    let clicks = rows[0].clicks;
    let responsetype = InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE;

    if (interaction.type === InteractionType.MESSAGE_COMPONENT) {
        const idparts = interaction.data.custom_id.split('_');
        if (idparts[1] === 'click') {
            await sql`UPDATE clicker SET clicks = ${clicks += 1}, updated_at = CURRENT_TIMESTAMP WHERE id = ${userid};`;
        }
        responsetype = InteractionResponseType.UPDATE_MESSAGE;
    }

    return res.status(200).send({
        type: responsetype,
        data: {
            content: null,
            embeds: [
                {
                    title: "Clicker",
                    description: `Clicks: **${clicks}**`,
                    color: parseInt("FF69B4", 16),
                    footer: {
                        text: "https://ko-fi.com/jforjo",
                        icon_url: "https://storage.ko-fi.com/cdn/brandasset/kofi_s_logo_nolabel.png"
                    },
                    timestamp: date.toISOString()
                }
            ],
            attachments: [],
            components: [
                {
                    type: MessageComponentTypes.ACTION_ROW,
                    components: [
                        {
                            type: MessageComponentTypes.BUTTON,
                            label: "Click me!",
                            style: ButtonStyleTypes.PRIMARY,
                            custom_id: `clicker_click_${interaction.id}`
                        }
                    ]
                }
            ]
        },
    });
}