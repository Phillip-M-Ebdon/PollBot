import {Entity, PrimaryColumn, Column, OneToMany} from "typeorm";
import ServerUser from "./ServerUser";
import Poll from "./Poll";


@Entity()
export default class Server {

    @PrimaryColumn({type: "varchar"})
    id!: string;

    @Column({type: "varchar"})
    servername!: string;

    @Column({type: "varchar", default: "general"})
    channel!: string;

    @OneToMany(() => ServerUser, (serveruser) => serveruser.server)
    serveruser!: ServerUser[]

    @OneToMany(() => Poll, (poll) => poll.server)
    poll!: Poll[]

}
