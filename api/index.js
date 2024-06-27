import { InteractionResponseType, InteractionType, verifyKey } from "discord-interactions";

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

        const interaction = req.body;

        if (interaction.type === InteractionType.PING) {
            console.log('Handling Ping request');
            return res.send({
                type: InteractionResponseType.PONG,
            });
        } else if (interaction.type === InteractionType.APPLICATION_COMMAND) {
            const command = require(`../commands/${interaction.data.name.toLowerCase()}.js`).default;
            if (command) {
                console.log(`Handling Command: ${interaction.data.name}`);
                await command(req, res);
            } else {
                console.error('Unknown Command');
                return res.status(400).send({ error: 'Unknown Command' });
            }
        // } else if (interaction.type === InteractionType.MESSAGE_COMPONENT) {
        //     const idparts = interaction.data.custom_id.split('_');
        //     const command = require(`../commands/${idparts[0]}.js`).default;
        //     if (command) {
        //         console.log(`Handling Component: ${idparts[0]} | ${idparts[1]}`);
        //         await command(req, res);
        //     } else {
        //         console.error('Unknown Component');
        //         return res.status(400).send({ error: 'Unknown Component' });
        //     }
        } else {
            console.error('Unknown Type');
            return res.status(400).send({ error: 'Unknown Type' });
        }
    } else {
        return res.json({ error: "Request method must be of type POST" });
    }
};
