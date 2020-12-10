import {Entity, PrimaryColumn, Column, OneToMany} from "typeorm";
import ServerUser from "./ServerUser";
import Poll from "./Poll";
import Vote from "./Vote";


@Entity()
export default class User {

    @PrimaryColumn({type: "varchar"})
    id!: string;

    @Column({type: "varchar"})
    username!: string;

    @OneToMany(() => ServerUser, (serveruser) => serveruser.user)
    serveruser!: ServerUser[]

    @OneToMany(() => Poll, (poll) => poll.user)
    poll!: Poll[]

    @OneToMany(() => Vote, (vote) => vote.user)
    vote!: Vote[]
}
