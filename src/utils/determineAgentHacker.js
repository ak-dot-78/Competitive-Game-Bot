export default async (guildId, players) => { // players is an array of user options
    const winners = [];
    const losers = [];
    for (let i = 0; i < players.length; i++) {
        if (players[i].didWin) {
            winners.push(players[i]);
                    
        }
        else {
            losers.push(players[i]);
        }
    }
    const ret = {winners: winners, losers: losers};
    return ret;
};