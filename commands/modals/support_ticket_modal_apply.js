import { InteractionResponseType, MessageComponentTypes, ButtonStyleTypes } from "discord-interactions";
import { CreateChannel, SendMessage, ToPermissions } from "../../utils";

export default async (req, res) => {
    const date = new Date();
    const interaction = req.body;

    let userid = null;
    let username = null;
    if (interaction.user != null) {
        // The command was a DM
        userid = interaction.user.id;
        username = interaction.user.username;
    } else if (interaction.member != null) {
        // The command was in a server
        userid = interaction.member.user.id;
        username = interaction.member.user.username;
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
    console.log(interaction);
    const channel = await CreateChannel(process.env.GUILD_ID, {
        type: 0,
        name: `apply-${userid}`,
        topic: `Apply for ${username} - ${userid}`,
        parent_id: "1286727301723324476",
        nsfw: false,
        permission_overwrites: [
            {
                id: interaction.guild.id,
                type: 0,
                allow: null,
                deny: ToPermissions({
                    view_channel: true
                })
            },
            {
                id: userid,
                type: 1,
                allow: ToPermissions({
                    view_channel: true,
                    send_messages: true
                }),
                deny: null
            }
        ]
    });

    if (channel == null && channel?.id == null) {
        return res.status(200).send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: "Failed to create the apply ticket.",
                flags: 1 << 6
            },
        });
    }
    // Sends a message in the newly created channel
    await SendMessage(channel.id, {
        content: null,
        embeds: [
            {
                title: "Need Support?",
                description: `Hello, <@${userid}>! I am here to help!\n\n**Reason:**\n`,
                color: parseInt("FF69B4", 16),
                footer: {
                    text: "https://ko-fi.com/jforjo",
                    icon_url: "https://storage.ko-fi.com/cdn/brandasset/kofi_s_logo_nolabel.png"
                },
                timestamp: date.toISOString(),
            }
        ],
    });

    return res.status(200).send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: `Apply ticket created: <#${channel.id}>`,
            flags: 1 << 6
        },
    });
}

