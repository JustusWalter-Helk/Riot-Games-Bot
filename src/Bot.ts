import {Client,Intents} from "discord.js"
import {Listeners} from "./Listeners"

class Bot
{
    public static createNewClient()
    {
        const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
        console.log("Created new Client!")
        return client;
    }

    public static startBot(client:Client, token:string)
    {
        try {
         client.login(token)
         console.log("Client Successfully logged in!")
            return true;
        } catch (error) {
         return false;
        }
    }

    public static ListenToEvents(client:Client)
    {
        console.log("Starting to Listen To Events...")
        Listeners.listenToAllEvents(client);
    }

    public static ListenToCommands(client:Client)
    {
        console.log("Starting to Listen To Commands...")
        Listeners.listenToAllCommands(client);
    }
}

export {Bot}