import { InteractionResponseType, MessageComponentTypes, ButtonStyleTypes } from "discord-interactions";
import { CreateChannel, SendMessage, ToPermissions } from "../../utils";

export default async (req, res) => {
    const date = new Date();
    const interaction = req.body;

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

    const channel = await CreateChannel("", `support-${userid}`, {
        type: 0,
        name: `support-${userid}`,
        topic: `Support for ${userid}`,
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

    console.log(channel);

    if (channel == null && channel?.id == null) {
        return res.status(200).send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: "Failed to create the support ticket.",
                flags: 1 << 6
            },
        });
    }

    SendMessage(channel.id, {
        content: `Hello, <@${userid}>! I am here to help!`,
    });

    return res.status(200).send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: `Support ticket created: <#${channel.id}>`,
            flags: 1 << 6
        },
    });
}

