import { InteractionResponseType, MessageComponentTypes, ButtonStyleTypes } from "discord-interactions";

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

    console.log("apply btn");

    return res.status(200).send({
        type: InteractionResponseType.MODAL,
        data: {
            title: "Apply for Support",
            custom_id: "support_ticket_modal_apply",
            components: [
                {
                    type: MessageComponentTypes.TEXT_INPUT,
                    custom_id: "support_ticket_modal_apply_name",
                    label: "Name",
                    style: 1,
                    min_length: 3,
                    max_length: 16,
                    placeholder: "Your name",
                    required: true
                },
                {
                    type: MessageComponentTypes.TEXT_INPUT,
                    custom_id: "support_ticket_modal_apply_reason",
                    label: "Reason",
                    style: 2,
                    min_length: 5,
                    max_length: 100,
                    placeholder: "What do you need support with?",
                    required: true
                }
            ]
        },
    });
}

