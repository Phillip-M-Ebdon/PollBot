import {getRepository, MoreThanOrEqual} from "typeorm";
import Poll from "../entity/Poll";
import Server from "../entity/Server";

export const findAllPolls = async (server: Server) => {

    const pollRepo = getRepository(Poll);
    const openPolls = await pollRepo.find({
        where: {
            server: server,
            finished: false
        }
    });

    let dateToCheck = new Date();
    dateToCheck.setDate(dateToCheck.getDate() - parseInt(process.env.POLL_LIMIT))
    const closedPolls = await pollRepo.find({
        where: {
            finished: true,
            server: server,
            closeTime: MoreThanOrEqual(dateToCheck)
        }
    })

    console.log(openPolls, closedPolls)
    return { openPolls, closedPolls }
}
