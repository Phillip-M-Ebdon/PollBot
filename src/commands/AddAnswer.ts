import {getRepository} from "typeorm";
import Answer from "../entity/Answer";
import Poll from "../entity/Poll";
import Server from "../entity/Server";

module.exports = {
    name: "add answer",
    alt: ["add", "answer"],
    usage: `[Poll Name]${process.env.DELIMITER} [Option Name]`,
    description: "Add a new option to an existing poll.",
    cooldown: process.env.DEFAULT_COOLDOWN,
    async execute(message, args) {

        if (args.length < 2) return message.reply(`You require two arguments, the poll name, and the new option name`);

        const name = args.shift()
        const option = args.shift()
        const server = await getRepository(Server).findOne(message.guild.id);

        const pollRepo = getRepository(Poll);
        const answerRepo = getRepository(Answer);

        // attempt fetch existing poll on server
        const poll = await pollRepo.findOne({
            where: {
                server: server,
                name: name,
                finished: false
            }
        });
        if (!poll) return message.reply(`I couldn't find the active poll \`${name}\`.`);


        let existingAnswer = await answerRepo.findOne({
            where: {
                poll: poll,
                text: option
            }
        });
        if (existingAnswer) return message.reply(`The poll already has the option \`${option}\`.`);

        let newAnswer = answerRepo.create({
            text: option,
            poll: poll
        });
        await answerRepo.save(newAnswer);
        return message.reply(`Option: \`${newAnswer.text}\` added to Poll: \`${poll.name}\``)
    }
}