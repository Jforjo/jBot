import { InteractionType, InteractionResponseType } from "discord-interactions";
import { ContainsWhiteSpace } from "../utils";


const getUUID = async (username) => {
    if (username == null || ContainsWhiteSpace(username)) return {
        success: false,
        message: 'Invalid username'
    }
    const res = await fetch('https://api.mojang.com/users/profiles/minecraft/' + username, {
        mode: 'no-cors'
    });
    const data = await res.json();
    if (!res.ok) {
        return {
            success: false,
            message: 'Bad response from Mojang'
        }
    }
    if (data.id === null) return {
        success: false,
        message: 'Username not found'
    }
    return {
        success: true,
        uuid: data.id,
        name: data.name
    }

}
const isInventoryAPI = async (profiledata) => {
    return "inventory" in profiledata && "inv_contents" in profiledata.inventory;
}
const isCollectionAPI = async (profiledata) => {
    return "collection" in profiledata;
}
const isBankingAPI = async (profile) => {
    return "banking" in profile && "balance" in profile.banking && profile.banking.balance != -1;
}
const isPersonalVaultAPI = async (profiledata) => {
    return "inventory" in profiledata && "personal_vault_contents" in profiledata.inventory;
}
const isSkillsAPI = async (profiledata) => {
    return "experience" in profiledata.player_data;
}
const checkAPI = async (uuid, profilename) => {
    const res = await fetch('https://api.hypixel.net/v2/skyblock/profiles?uuid=' + uuid, {
        method: 'GET',
        headers: {
            'API-Key': process.env.HYPIXEL_API_KEY
        }
    });
    const data = await res.json();
    if (!res.ok) {
        if (data && data.cause) {
            return {
                success: false,
                message: data.cause
            }
        }
        return {
            success: false,
            message: 'Bad response from Hypixel'
        }
    }
    if (data.profiles.length === 0) {
        return {
            success: false,
            message: 'User has no profiles'
        }
    }
    let profile = data.profiles.find((p) => p.cute_name === profilename);
    if (!profile) profile = data.profiles.find((p) => p.selected);
    const profiledata = profile.members[uuid];

    return {
        success: true,
        name: profile.cute_name,
        inventory: isInventoryAPI(profiledata),
        collection: isCollectionAPI(profiledata),
        banking: isBankingAPI(profile),
        vault: isPersonalVaultAPI(profiledata),
        skills: isSkillsAPI(profiledata)
    }
}

export default async (req, res) => {
    const interaction = req.body;
    const date = new Date();
    const options = Object.fromEntries(interaction.data.options.map(option => [option.name, option.value]));
    const username = options.name;
    const profile = options.profile;
    const yes = "✅";
    const no = "❌";
    const mojang = await getUUID(username);
    if (!mojang.success) {
        return res.status(200).send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: null,
                embeds: [
                    {
                        title: "Something went wrong!",
                        description: mojang.message,
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
    const { success, message, name, inventory, collection, banking, vault, skills } = await checkAPI(mojang.uuid, profile);
    if (!success) {
        return res.status(200).send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: null,
                embeds: [
                    {
                        title: "Something went wrong!",
                        description: message,
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
    return res.status(200).send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: null,
            embeds: [
                {
                    title: mojang.name,
                    url: `https://sky.shiiyu.moe/stats/${mojang.uuid}/${name}`,
                    description: `
                        ${inventory ? yes : no} Inventory API
                        ${banking ? yes : no} Banking API
                        ${collection ? yes : no} Collection API
                        ${skills ? yes : no} Skills API
                        ${vault ? yes : no} Personal Vault API
                    `,
                    color: parseInt("FF69B4", 16),
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