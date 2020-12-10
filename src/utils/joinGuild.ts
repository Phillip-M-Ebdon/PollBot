import {getRepository} from "typeorm";
import Server from "../entity/Server";

export const joinGuild = async (guild, defaultChannel) => {

    let newServer = getRepository(Server).create({
        servername: guild.name,
        id: guild.id,
        channel: defaultChannel.id
    });

    await getRepository(Server).save(newServer);
}