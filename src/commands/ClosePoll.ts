import {getRepository} from "typeorm";
import Poll from "../entity/Poll";
import Server from "../entity/Server";
import {checkPoll} from "../utils/checkPoll";
import {findPoll} from "../utils/findPoll";

module.exports = {
    name: "close poll",
    alt: ["close", "end"],
    usage: "[poll name]",
    description: "End an open poll in the server manually",
    cooldown: process.env.DEFAULT_COOLDOWN,
    async execute(message, args) {

        if (args.length < 1) return message.reply("You must provide the name of the poll you wish to close");


        const name = args.shift();
        const server = await getRepository(Server).findOne(message.guild.id);
        const pollRepo = getRepository(Poll);

        const { openPolls, closedPolls } = await findPoll(name, server);

        if (closedPolls.length === 0 && openPolls.length === 0) return message.reply(`I couldn't find a poll by the name: \`${name}\``);

        if (closedPolls.length != 0) return message.reply(`The poll \`${name}\` has already closed`);

        const poll = openPolls[0];
        poll.finished = true;
        poll.closeTime = new Date();
        await pollRepo.save(poll);

        message.reply(`Poll \`${name}\` has closed.`)
        message.reply(await checkPoll(poll));
    }
}