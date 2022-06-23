import {REST} from "@discordjs/rest"
import {Routes}from "discord-api-types/v10"
import {SlashCommandBuilder} from "@discordjs/builders";

class Commands
{
    private static rest: REST;

    public static setToken(token:string)
    {
        this.rest = new REST({version: "9"}).setToken(token);
    }

    public static async registerCommands(clientid:string)
    {
        console.log("Started refreshing application (/) commands.");

        await this.rest.put(
            Routes.applicationCommands(clientid),
            {
                body: [this.sendSetupGuideCommand]
            }
        )
    }

    //Commands

    private static sendSetupGuideCommand = new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Allows you to setup the Bot for your Server!")
}

export {Commands}