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