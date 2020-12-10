import {getNickname} from "./utils/getNickname";

require("dotenv").config();

import "reflect-metadata";
import {createConnection, Long} from "typeorm";
const fs = require("fs");

const Discord = require("discord.js");
const client = new Discord.Client();

const prefix = process.env.PREFIX;
const delimiter = process.env.DELIMITER;
const token = process.env.DISCORD_TOKEN;

import {checkServerUser} from "./utils/CheckServerUser";
import {updateAllPolls} from "./utils/updateAllPolls";
import {joinGuild} from "./utils/joinGuild";


// Start bot once database is connected
createConnection().then(async () => {

    // Dynamically add commands into bot
    client.commands = new Discord.Collection();
    const allCommands = fs.readdirSync(__dirname + "/commands").filter(file => file.endsWith('.js') || file.endsWith('.ts'))
    for (const file of allCommands) {
        const command = require(__dirname +`/commands/${file}`);
        client.commands.set(command.name, command);
    }

    client.on("ready", () => {
        console.log("ready!");
        updateAllPolls(client);
    });

    client.on("guildCreate", async (guild) => {
        try {
            let defaultChannel;
            if (guild.systemChannel) {
                console.log("I have a system channel")
                // guild.systemChannel.send("Hello, I'm Pollbot.");
                defaultChannel = guild.systemChannel;
            } else {
                defaultChannel = guild.channels.cache
                    .filter(c => c.type=="text" && c.permissionsFor(guild.me).has("SEND_MESSAGES"))
                    .sort((a, b) => a.position - b.position || Long.fromString(a.id).subtract(Long.fromString(b.id)).toNumber())
                    .first();
            }
            await joinGuild(guild, defaultChannel);
            defaultChannel.send("Hello, I'm Pollbot.");
        } catch (e) {
            console.error("Error joining guild")
            // console.error(e)
        }
    });

    client.on("message", async message => {
        // early exit
        if(!message.content.startsWith(prefix) || message.author.bot) return;

        // check user/server pair is in DB
        await checkServerUser(message);

        // split command into args
        const splitRegex = new RegExp(`${delimiter}[ ]*`, "g");
        let args = message.content.slice(prefix.length).trim().split(splitRegex);
        args = args.map(arg => arg.trim())
        console.log(args);
        const commandName = args.shift().toLowerCase();

        // attempt to find by name or alt name then execute
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.alt && cmd.alt.includes(commandName));

        if (!command) {
            return message.reply(`I couldn't find the command \`${commandName}\`, ${getNickname(message) || message.author.username}`)
        }
        try {
            command.execute(message, args);
        } catch(e) {
            console.error(e);
            message.reply(`Whoops, I made an error trying to make that command.`);
        }
    });

    // load bot
    client.login(token);

}).catch(error => console.log(error));

