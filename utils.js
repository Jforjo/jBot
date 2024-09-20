// import fetch from 'node-fetch';
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

export function ContainsWhiteSpace(s) {
    return /\s/g.test(s);
}

export async function DiscordRequest(endpoint, options) {
    // append endpoint to root API URL
    const url = 'https://discord.com/api/v10/' + endpoint;
    // Stringify payloads
    if (options.body) options.body = JSON.stringify(options.body);
    // Use node-fetch to make requests
    const res = await fetch(url, {
        headers: {
            Authorization: `Bot ${process.env.TOKEN}`,
            'Content-Type': 'application/json; charset=UTF-8',
        },
        ...options
    });
    // throw API errors
    if (!res.ok) {
        const data = await res.json();
        console.log(res.status);
        throw new Error(JSON.stringify(data));
    }
    // return original response
    return res;
}
  
export async function InstallGlobalCommands(appId, commands) {
    // API endpoint to overwrite global commands
    const endpoint = `applications/${appId}/commands`;
  
    try {
        // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
        await DiscordRequest(endpoint, { method: 'PUT', body: commands });
    } catch (err) {
        console.error(err);
    }
}
export async function DeleteGlobalCommands(appId, commands) {
    // API endpoint to overwrite global commands
    for (let i = 0; i < commands.length; i++) {
        const endpoint = `applications/${appId}/commands/${commands[i]}`;
      
        try {
            // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
            await DiscordRequest(endpoint, { method: 'DELETE' });
        } catch (err) {
            console.error(err);
        }
    }
}

export async function CreateChannel(guildId, options) {
    // https://discord.com/developers/docs/resources/guild#create-guild-channel
    const endpoint = `guilds/${guildId}/channels`;
    const body = options;
    try {
        const res = await DiscordRequest(endpoint, { method: 'POST', body: body });
        return res.json();
    } catch (err) {
        console.error(err);
    }
}

export async function SendMessage(channelId, data) {
    // https://discord.com/developers/docs/resources/message#create-message
    const endpoint = `channels/${channelId}/messages`;
    const body = data;
    try {
        const res = await DiscordRequest(endpoint, { method: 'POST', body: body });
        return res.json();
    } catch (err) {
        console.error(err);
    }
}

export function ToPermissions(permissions) {
    // https://discord.com/developers/docs/topics/permissions
    let perms = 0;
    if (permissions.create_instant_invite === true)                  perms |= 0x1;
    if (permissions.kick_members === true)                           perms |= 0x2;
    if (permissions.ban_members === true)                            perms |= 0x4;
    if (permissions.administrator === true)                          perms |= 0x8;
    if (permissions.manage_channels === true)                        perms |= 0x10;
    if (permissions.manage_guild === true)                           perms |= 0x20;
    if (permissions.add_reactions === true)                          perms |= 0x40;
    if (permissions.view_audit_log === true)                         perms |= 0x80;
    if (permissions.priority_speaker === true)                       perms |= 0x100;
    if (permissions.stream === true)                                 perms |= 0x200;
    if (permissions.view_channel === true)                           perms |= 0x400;
    if (permissions.send_messages === true)                          perms |= 0x800;
    if (permissions.send_tts_messages === true)                      perms |= 0x1000;
    if (permissions.manage_messages === true)                        perms |= 0x2000;
    if (permissions.embed_links === true)                            perms |= 0x4000;
    if (permissions.attach_files === true)                           perms |= 0x8000;
    if (permissions.read_message_history === true)                   perms |= 0x10000;
    if (permissions.mention_everyone === true)                       perms |= 0x20000;
    if (permissions.use_external_emojis === true)                    perms |= 0x40000;
    if (permissions.view_guild_insights === true)                    perms |= 0x80000;
    if (permissions.connect === true)                                perms |= 0x100000;
    if (permissions.speak === true)                                  perms |= 0x200000;
    if (permissions.mute_members === true)                           perms |= 0x400000;
    if (permissions.deafen_members === true)                         perms |= 0x800000;
    if (permissions.move_members === true)                           perms |= 0x1000000;
    if (permissions.use_vad === true)                                perms |= 0x2000000;
    if (permissions.change_nickname === true)                        perms |= 0x4000000;
    if (permissions.manage_nicknames === true)                       perms |= 0x8000000;
    if (permissions.manage_roles === true)                           perms |= 0x10000000;
    if (permissions.manage_webhooks === true)                        perms |= 0x20000000;
    if (permissions.manage_guild_expressions === true)               perms |= 0x40000000;
    if (permissions.use_application_commands === true)               perms |= 0x80000000;
    if (permissions.request_to_speak === true)                       perms |= 0x100000000;
    if (permissions.manage_events === true)                          perms |= 0x200000000;
    if (permissions.manage_threads === true)                         perms |= 0x400000000;
    if (permissions.create_public_threads === true)                  perms |= 0x800000000;
    if (permissions.create_private_threads === true)                 perms |= 0x1000000000;
    if (permissions.use_external_stickers === true)                  perms |= 0x2000000000;
    if (permissions.send_messages_in_threads === true)               perms |= 0x4000000000;
    if (permissions.start_embedded_activities === true)              perms |= 0x8000000000;
    if (permissions.moderate_members === true)                       perms |= 0x10000000000;
    if (permissions.view_creator_monetization_analytics === true)    perms |= 0x20000000000;
    if (permissions.use_soundboard === true)                         perms |= 0x40000000000;
    if (permissions.create_guild_expressions === true)               perms |= 0x80000000000;
    if (permissions.create_events === true)                          perms |= 0x100000000000;
    if (permissions.use_external_sounds === true)                    perms |= 0x200000000000;
    if (permissions.send_voice_messages === true)                    perms |= 0x400000000000;
    if (permissions.send_polls === true)                             perms |= 0x2000000000000;
    if (permissions.use_external_apps === true)                      perms |= 0x4000000000000;
    return perms;
}