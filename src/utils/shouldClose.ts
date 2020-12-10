import Poll from "../entity/Poll";

export const shouldClose = async (poll: Poll) => {
    const currentDate = new Date();
    let openLimit = poll.openTime;
    openLimit.setDate(openLimit.getDate() + parseInt(process.env.POLL_LIMIT))
    return openLimit <= currentDate;


}

