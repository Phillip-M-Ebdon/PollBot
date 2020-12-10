import {getRepository} from "typeorm";
import User from "../entity/User";
import Server from "../entity/Server";
import ServerUser from "../entity/ServerUser";
import {getNickname} from "./getNickname";

export const checkServerUser = async (message) => {

    const userId = message.author.id;
    const serverId = message.guild.id;

    const userRepo = getRepository(User);
    const serverRepo = getRepository(Server);
    const suRepo = getRepository(ServerUser);

    // Check if user or server exist yet,
    // Then check if server-user exists yet

    let user = await userRepo.findOne(userId);
    if (!user) {
        user = userRepo.create({
            id: userId,
            username: message.author.username
        });
        (user);
        user = await userRepo.save(user);
        console.log("Added user to DB")
    }

    let server = await serverRepo.findOne(serverId);
    if (!server) {
        server = serverRepo.create({
            id: serverId,
            servername: message.guild.name
        });
        server = await serverRepo.save(server);
        console.log("Added server to DB")
    }

    let serverusers = await suRepo.find({
        where: {
            user: user,
            server: server
        },
        relations: ['user', 'server']
    });

    let serveruser = serverusers[0];

    if (!serveruser) {
        serveruser = suRepo.create({
            server: server,
            user: user
        });
        if (message.author.nickname) {
            serveruser.nickname = message.author.nickname
        }
        await suRepo.save(serveruser)
        console.log("Added serveruser to DB")
    } else {
        const old = serveruser.nickname
        const current = getNickname(message)
        // Attempt to update serveruser nickname if needed
        if (old != current) {
            serveruser.nickname = current
            await suRepo.save(serveruser)
            console.log("Updated server-user nickname")
        }
    }
}