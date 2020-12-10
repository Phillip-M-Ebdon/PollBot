export const getNickname = (message) => {
    return message.guild.member(message.author).nickname || null;
}