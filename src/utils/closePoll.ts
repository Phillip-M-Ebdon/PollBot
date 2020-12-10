import {getRepository} from "typeorm";
import Poll from "../entity/Poll";

export const closePoll = async (channel, poll) => {
    channel.send(`Poll: \`${poll.name}\` has closed`);
    poll.closeTime = new Date();
    poll.finished = true;
    await getRepository(Poll).save(poll);
}