import {getRepository} from "typeorm";
import Server from "../entity/Server";
import {findPoll} from "../utils/findPoll";
import {checkPoll} from "../utils/checkPoll";

module.exports = {
    name: "check poll",
    alt: ["check", "results"],
    usage: "[poll name]",
    description: "Get the results of an open or recently closed poll.",
    cooldown: process.env.DEFAULT_COOLDOWN,
    async execute(message, args) {
        if (args.length < 1) return message.reply("You must provide the name of the poll you wish to close");


        const name = args.shift();
        const server = await getRepository(Server).findOne(message.guild.id);

        const { openPolls, closedPolls } = await findPoll(name, server);

        let poll;
        if (closedPolls.length > 0) poll = closedPolls[0];
        else if (openPolls.length > 0) poll = openPolls[0];
        else return message.reply(`I couldn't find a poll by the name: \`${name}\``);

        message.reply(await checkPoll(poll));
    }
}