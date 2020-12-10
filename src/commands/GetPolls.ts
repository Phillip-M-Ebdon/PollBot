import {getRepository} from "typeorm";
import Server from "../entity/Server";
import {findAllPolls} from "../utils/findAllPolls";

module.exports = {
    name: "get polls",
    alt: ["get", "polls"],
    usage: "[open/closed] defaults to open if not specified",
    description: "Fetch all polls in the server, defaults to open only",
    cooldown: process.env.DEFAULT_COOLDOWN,
    async execute(message, args) {
        let state = false
        let closed: Date = null

        if (args.length > 0) {
            if (args[0].toLowerCase() == "open") {
                state = false;
            } else if (args[0].toLowerCase() == "closed") {
                state = true;
                closed = new Date();
                closed.setDate(closed.getDate() - parseInt(process.env.POLL_LIMIT));
            } else {
                return message.reply(`Didn't recognise option ${args[0]}, options are \`open\` or \`closed\``)
            }
        }

        // Setup Repos for fetch
        const sRepo = getRepository(Server);

        try{
            const serverId = message.guild.id;
            const currentServer = await sRepo.findOne({
                where: {
                    id: serverId
                }
            })

            const { openPolls, closedPolls } = await findAllPolls(currentServer);
            const stateTxt = !state ? "open" : "closed";
            const polls = !state ? openPolls : closedPolls;

            const reply = `Polls ${stateTxt} \n` + (polls.length > 0 ? polls.map(poll => poll.name).join("\n") : `Oh no, there are no ${stateTxt} polls yet.`)
            return message.reply(reply);

        } catch(e) {
            console.error(`Error executing ${this.name} with: ${message.args}`)
            console.error(e);
        }

    }
};