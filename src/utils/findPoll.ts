import {getRepository, MoreThanOrEqual} from "typeorm";
import Poll from "../entity/Poll";
import Server from "../entity/Server";

export const findPoll = async (name: string, server: Server) => {

    const pollRepo = getRepository(Poll);
    const openPolls = await pollRepo.find({
        where: {
            name: name,
            server: server,
            finished: false
        }
    });

    let dateToCheck = new Date();
    dateToCheck.setDate(dateToCheck.getDate() - parseInt(process.env.POLL_LIMIT))
    const closedPolls = await pollRepo.find({
        where: {
            name: name,
            finished: true,
            server: server,
            closeTime: MoreThanOrEqual(dateToCheck)
        }
    })


    return { openPolls, closedPolls }
}
