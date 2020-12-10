
import {getRepository} from "typeorm";
import User from "../entity/User";
import Server from "../entity/Server";
import Poll from "../entity/Poll"
import Answer from "../entity/Answer";
import {findPoll} from "../utils/findPoll";
import {closePoll} from "../utils/closePoll";

module.exports = {
    name: "start poll",
    alt: ["start", "new"],
    usage: `[pollname]${process.env.DELIMITER} [optionA]${process.env.DELIMITER} [optionB]${process.env.DELIMITER} . . .`,
    description: "Start a new poll by name, and add initial options",
    cooldown: process.env.DEFAULT_COOLDOWN,
    async execute(message, args) {

        if (args.length < 1) {
            return message.reply(`Required to name the poll at a minimum`)
        }
        const name = args.shift();
        try {
            const pollRepo = getRepository(Poll);
            const user = await getRepository(User).findOne(message.author.id);
            const server = await getRepository(Server).findOne(message.guild.id);

            const { openPolls, closedPolls } = await findPoll(name, server);
            (closedPolls)
            if (openPolls.length > 0) {
                return message.reply(`A poll with the name \`${name}\` is currently open, please use a different name`)
            }
            if (closedPolls.length > 0) {
                return message.reply(`A poll with the name \`${name}\` has been used recently, please use a different name or wait till the previous poll is archived.`)
            }

            let newPoll = pollRepo.create()
            newPoll.name = name;
            newPoll.user = user;
            newPoll.server = server;
            newPoll = await pollRepo.save(newPoll);

            if (args.length > 0) {
                (args)
                const answers = args;
                const answerRepo = getRepository(Answer);
                for (let answer of answers) {
                    (answer)
                    try {
                        const newAnswer = answerRepo.create();
                        newAnswer.text = answer;
                        newAnswer.poll = newPoll;
                        await answerRepo.save(newAnswer);
                    } catch (e) {
                        console.error("Error creating answer");
                        console.error(e)
                        return message.reply(`Whoops, I made an error adding \`${answer}\`, it may of been a dupe or had a tricky name.`);
                    }
                }
            }

            let closeTime = new Date();
            closeTime.setDate(closeTime.getDate() + parseInt(process.env.POLL_LIMIT));
            setTimeout( () => {
                closePoll(message.channel, newPoll)
            }, closeTime.valueOf() - Date.now());
            return message.reply(`Poll \`${name}\` has been opened! \n The poll will auto-close on the \`${closeTime.toDateString()}\` at \`${closeTime.toTimeString()}\``)

        } catch (e) {
            console.error("Error creating poll");
            console.error(e)
            return message.reply("Whoops, I've made an error creating this poll instance");
        }
    }
}