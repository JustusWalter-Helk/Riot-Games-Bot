const url:string = "https://www.spitfox.com/riot/get/latest";

var LatestVersion:string;
var LocalVersion:string;

var FullArticleData:any;

const delay = (ms:any) => new Promise(resolve => setTimeout(resolve, ms))

import { channel } from "diagnostics_channel";
import { AnyChannel, Channel, Client, MessageEmbed } from "discord.js";
import fs from "fs"
import fetch from "node-fetch"

class RiotAPI
{
    public static getData(url:string,cb:Function)
    {
        try{
            
            fetch(url).catch()
            .then(response => response.json()).catch()
            .then(result => cb(result)).catch();
        }
        catch(ex)
        {
            console.log(ex)
        }
    }

    public static getLatest()
    {
        try {
            this.getData(url, (data: any)=> {LatestVersion = data.articles[0].title; console.log(data.articles[0].title)})   
        } catch (error) {
            console.log(error)
        }
    }

    public static getLocal()
    {
        try {
            var data = fs.readFileSync(__dirname + "/latestArticle.txt", {encoding: "utf-8"})
	        LocalVersion = data;
        } catch (error) {
            console.log(error)
        }
    }

    public static async getFullArticleData()
    {
        await this.getData(url, (data: any)=> {FullArticleData = data.articles[0]})
    }

    public static writeSaveFile(data:string)
    {
        fs.writeFile(__dirname + "/latestArticle.txt", data, err =>{
            if(err)
            {
                console.log(err)
            }
        })
    }

    public static CompareLocalToLatest(bot:Client)
    {
        var latest = this.getLatest()
        var local = this.getLocal()
	
    //console.log("Local Version is " + testLocal)
    //console.log("Remote Version is " + testLatest)	



        if(LocalVersion != LatestVersion && LatestVersion != null)
        {
            this.writeSaveFile(LatestVersion);
            this.SendNewArticleToAllGuilds(bot);
        }
    }

    public static async SendLatestArticleToGuild(bot:Client)
    {
        try{
        await this.getFullArticleData()
        await delay(2000)
        var image = FullArticleData.image
        var title = FullArticleData.title
        var secondTitle = FullArticleData.secondtitle
        var date = FullArticleData.date
        var link = FullArticleData.link

        var Rguild = bot.guilds.cache.get("703280953790955521")
        if(Rguild == null) return;
        //console.log(Rguild?.channels.cache.find(channel => channel.name == "riot-games-news"))
        
        if(Rguild.channels.cache.find(channel => channel.name == "riot-games-news"))
            {   
                var channel1 = Rguild.channels.cache.find(channel => channel.name == "riot-games-news")
                console.log(channel1)
                var embed = new MessageEmbed()
                .setColor("#eb3434")
                .setTitle(title)
                .setAuthor("Riot Games News")
                .setFooter("Article from " + date)
                .setDescription(secondTitle + "\u200B" + "[Read the Full Article] (" + link + ")")
                .setImage(image)
                .setTimestamp()

                if(Rguild.me == null) return
                if(channel1?.permissionsFor(Rguild.me)?.has("SEND_MESSAGES") && channel1.permissionsFor(Rguild.me).has("VIEW_CHANNEL"))
                {
                    if(channel1.type == "GUILD_TEXT")
                    {
                        try {
                            channel1.send({embeds: [embed]})
                        } catch (error) {
                            console.log(error)
                        }
                    }
                }
            }
        } catch(error)
        {
            console.log(error)
        }
    }

    public static async SendNewArticleToAllGuilds(bot:Client)
    {
        await this.getFullArticleData()
        await delay(2000)
        var image = FullArticleData.image
        var title = FullArticleData.title
        var secondTitle = FullArticleData.secondtitle
        var date = FullArticleData.date
        var link = FullArticleData.link

        var guildIds = bot.guilds.cache.map(guild => guild.id);

        guildIds.forEach(guild =>{
            try
            {
            var Rguild = bot.guilds.cache.get(guild)
            if(Rguild?.channels.cache.find(channel => channel.name == "riot-games-news"))
            {
                var channel1 = Rguild?.channels.cache.find(channel => channel.name == "riot-games-news")
                var embed = new MessageEmbed()
                .setColor("#eb3434")
                .setTitle(title)
                .setAuthor("Riot Games News")
                .setFooter("Article from " + date)
                .setDescription(secondTitle + "\u200B" + "[Read the full article] (" + link + ")")
                .setImage(image)
                .setTimestamp()

                if(Rguild.me == null) return
                if(channel1?.permissionsFor(Rguild.me)?.has("SEND_MESSAGES") && channel1.permissionsFor(Rguild.me).has("VIEW_CHANNEL"))
                {
                    if(channel1.type == "GUILD_TEXT")
                    {
                        try {
                            channel1.send({embeds: [embed]})
                        } catch (error) {
                            console.log(error)
                        }
                    }
                }
            }
            } catch (error)
            {
                console.log(error)
            }
        })
    }
}

export {RiotAPI}