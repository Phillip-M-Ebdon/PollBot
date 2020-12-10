import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import Poll from "./Poll";
import Vote from "./Vote";


@Entity()
@Unique(["poll", "text"])
export default class Answer {

    @PrimaryGeneratedColumn("increment")
    id!: string

    @ManyToOne(() => Poll, (poll) => poll.answer,)
    poll!: Poll;

    @Column({type: "varchar", nullable: false})
    text!: string

    @OneToMany( () => Vote, (vote) => vote.answer)
    vote!: Vote[];
}