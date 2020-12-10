import {Entity, ManyToOne} from "typeorm";
import Answer from "./Answer";
import User from "./User";


@Entity()
export default class Vote {

    @ManyToOne(() => Answer, (answer) => answer.vote,
        {
            primary: true
        })
    answer!: Answer;

    @ManyToOne(() => User, (user) => user.vote,
        {
            primary: true
        })
    user!: User;
}