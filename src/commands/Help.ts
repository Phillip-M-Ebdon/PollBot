const Discord = require("discord.js");
module.exports = {
    name: "help",
    alt: ["h"],
    usage: "[command name](optional)",
    description: "Fetch a list of commands, or get information on a particular command.",
    cooldown: process.env.DEFAULT_COOLDOWN,
    async execute(message, args) {
        const allCommands = message.client.commands
        if (!args.length) {
            // list all commands
            let reply = new Discord.MessageEmbed()
                .setTitle("All Commands")
            allCommands.map(cmd => reply.addField(cmd.name, cmd.description));
            reply.addFields()
            return message.reply(reply)

        }
        else {
            const command = allCommands.get(args[0]) || allCommands.find(cmd => cmd.alt && cmd.alt.includes(args[0]));
            if (!command) return message.reply(`Couldn't find command \`${args[0]}\``);
            let reply = new Discord.MessageEmbed()
                .setTitle(`${args[0]} Help`)
                .addFields(
                    { name: "Name", value: command.name},
                    { name: "Alts", value: command.alt},
                    { name: "Usage", value: `${process.env.PREFIX}${command.name}${process.env.DELIMITER} ${command.usage}`},
                    { name: "Description", value: command.description},
                    { name: "Cooldown", value: command.cooldown + " seconds"}
                );
            return message.reply(reply)
        }

    }
}