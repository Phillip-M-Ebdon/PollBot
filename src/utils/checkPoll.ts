import {getRepository} from "typeorm";
import Poll from "../entity/Poll";
import Answer from "../entity/Answer";
import Vote from "../entity/Vote";
const Discord = require('discord.js');

export const checkPoll = async (poll: Poll) => {

    const answers = await getRepository(Answer).find({
        where: {
            poll: poll,

        }
    });
    if (answers.length < 1) {
        return "This poll had no answers...?"
    }

    let counts = [];
    const votesRepo = getRepository(Vote);
    for(let answer of answers) {
        const answerCount = await votesRepo.count({
            where: {
                answer: answer
            }
        });
        counts.push([answer.text, answerCount]);
    }
    counts.sort((a, b) => b[1] - a[1])

    let reply = new Discord.MessageEmbed()
        .setColor("#1F1F44")
        .setTitle(`${poll.name} (${poll.finished ? "Closed" : "Open"}) results`)
    for(let count of counts) {
        reply.addField(count[0], count[1])
    }
    reply.setTimestamp();
    return reply;


}