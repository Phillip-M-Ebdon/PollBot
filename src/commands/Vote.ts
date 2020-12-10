import {getRepository} from "typeorm";
import Answer from "../entity/Answer";
import Poll from "../entity/Poll";
import Vote from "../entity/Vote";
import User from "../entity/User";

module.exports = {
    name: "vote",
    alt: false,
    usage: `[poll name]${process.env.DELIMITER} [option name]`,
    description: "Vote for a given option in a given poll",
    cooldown: process.env.DEFAULT_COOLDOWN,
    async execute(message, args) {

        if (args.length < 2) {
            return message.reply(`The vote command expects two arguments, the poll name, and the option name`)
        }

        const name = args[0];
        const option = args[1];

        try {

            const pollRepo = getRepository(Poll);
            const answerRepo = getRepository(Answer);
            const voteRepo = getRepository(Vote);

            const poll = await pollRepo.findOne({
                where: {
                    name: name,
                    finished: false
                }
            });
            if (!poll) {
                return message.reply(`I couldn't find the active poll \`${name}\`.`);
            }

            const answer = await answerRepo.findOne({
                where: {
                    poll: poll,
                    text: option
                },
                relations: ["poll"]
            });
            if (!answer) {
                return message.reply(`I couldn't find the option \`${option}\` in the poll \`${name}\`.`);
            }

            // Attempt to find a previous vote by this user
            const user = await getRepository(User).findOne(message.author.id);
            const answers = await answerRepo.find({where: {poll: poll}});
            let previousVote;
            for (let pollOption of answers) {
                previousVote = await voteRepo.findOne({
                    where: {
                        answer: pollOption,
                        user: user
                    },
                    relations: ["user", "answer"]

                });
                if (previousVote) break;
            }

            if (previousVote) {
                if (previousVote.answer.text == answer.text) return message.reply(`You already voted for \`${answer.text}\` in \`${poll.name}\``)

                message.reply(`Vote changed from \`${previousVote.answer.text}\` to \`${answer.text}\` in \`${poll.name}\`.`);
                previousVote.answer = answer;
                await voteRepo.save(previousVote);
                return
            }
             else {
                // No previous votes on this poll
                const newVote = voteRepo.create({
                    user: user,
                    answer: answer
                });
                await voteRepo.save(newVote);
                return message.reply(`Vote for \`${answer.text}\` in \`${poll.name}\` counted successfully.`);
            }

        } catch(e) {
            console.error("Error voting in poll")
            console.error(e)
            return message.reply("Whoops, I made an error trying to count your vote.")
        }

    }
}