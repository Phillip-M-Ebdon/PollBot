import {Column, Entity, ManyToOne} from "typeorm";
import User from "./User";
import Server from "./Server";


@Entity()
export default class ServerUser {

    @ManyToOne(() => Server, (server) => server.serveruser,
        {
            primary: true
        })
    server!: Server;

    @ManyToOne(() => User, (user) => user.serveruser,
        {
            primary: true
        })
    user!: User;

    @Column({nullable: true})
    nickname!: string

}
