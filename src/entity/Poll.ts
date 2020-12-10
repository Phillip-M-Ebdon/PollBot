import {Entity, Column, OneToMany, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import Answer from "./Answer";
import User from "./User";
import Server from "./Server";


@Entity()
export default class Poll {

    @PrimaryGeneratedColumn("increment")
    id!: string;

    @Column({default: false})
    finished!: boolean;

    @Column({type: "varchar"})
    name!: string

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    openTime!: Date;

    // Only not null once closed
    @Column({type: "timestamp", nullable: true})
    closeTime!: Date;

    @ManyToOne(() => Server, (server) => server.poll)
    server!: Server;

    @ManyToOne(() => User, (user) => user.poll)
    user!: User;

    @OneToMany(() => Answer, (answer) => answer.poll)
    answer!: Answer[];

}
