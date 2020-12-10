import {getRepository} from "typeorm";
import Server from "../entity/Server";

module.exports = {
    name: "set channel",
    alt: ["set", "default"],
    usage: "[channel name]",
    description: "Server Owner Only - Set default channel for notifications that don't directly reply to a user action",
    cooldown: process.env.DEFAULT_COOLDOWN,
    async execute(message, args) {

        if (message.guild.ownerID != message.author.id) return message.reply("Sorry but this can only be done by the server owner");

        if (!args.length) return message.reply("You need to provide the name of the channel you want to set as deafult")

        const channel = message.guild.channels.cache.find(chn => chn.name === args[0]);

        if (!channel) return message.reply(`Sorry I couldn't find the channel \`${args[0]}\``);

        if (channel.type!="text") return message.reply("Sorry I can't be allocated to non-text channels.")
        if (!channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return message.reply("Sorry I can't seem to send messages in that channel.");

        const serverRepo = getRepository(Server)
        const server = await serverRepo.findOne(message.guild.id);
        server.channel = channel.id;
        await serverRepo.save(server);
        return message.reply(`Successfully changed the default channel to \`${channel.name} - ${channel.id}\`.`)

    }
}