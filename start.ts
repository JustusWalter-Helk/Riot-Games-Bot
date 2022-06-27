import {Bot} from "./src/Bot"
import { RiotAPI } from "./src/helpers/RiotAPI";
import {Commands} from "./src/helpers/Commands";
import {config} from "dotenv";
config()

const clientId = process.env.BOT_CLIENTID;
const botToken = process.env.BOT_TOKEN;

if(clientId == null) {console.log("ClientId in config file is undefined!"); process.exit();}
if(botToken == null) {console.log("BotToken in config file is undefined!"); process.exit()}

const bot = Bot.createNewClient();

Bot.ListenToEvents(bot);
Bot.ListenToCommands(bot)
Commands.setToken(botToken)
Commands.registerCommands(clientId)

setInterval(function(){RiotAPI.CompareLocalToLatest(bot)}, 60000)

Bot.startBot(bot,botToken);
