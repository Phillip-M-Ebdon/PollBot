import {getRepository} from "typeorm";
import Poll from "../entity/Poll";
import {shouldClose} from "./shouldClose";
import {closePoll} from "./closePoll";

/**
 * Fecth all polls on start and setup intervals for closing polls.
 */
export const updateAllPolls = async (client) => {

    const allOpenPolls = await getRepository(Poll).find({
        where: {
            finished: false
        },
        relations: ["server"]
    });

    for (let poll of allOpenPolls) {
        let toClose = await shouldClose(poll);
        let pollServer = poll.server;
        client.guilds.fetch(pollServer.id)
            .then(async guild => {
                const guildChannel = guild.channels.resolve(pollServer.channel);
                if (toClose) {
                    return await closePoll(guildChannel, poll);
                } else {
                    let closeTime = poll.openTime;
                    closeTime.setDate(closeTime.getDate() + parseInt(process.env.POLL_LIMIT))
                    setTimeout( () => {
                            closePoll(guildChannel, poll)
                        }, closeTime.valueOf() - Date.now());
                }
            })
            .catch(e => console.error(e));



    }

}