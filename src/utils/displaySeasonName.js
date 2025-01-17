export default (seasonId, isDefault) => { 
    if (isDefault) {
        if (seasonId === 'lifetime') {
            return "Lifetime Default";
        }
        if (seasonId === '0000') {
            return "Pre-Season Default";
        }
        if (seasonId === '0001') {
            return "Season 1 Default";
        }
        if (seasonId === '0002') {
            return "Season 2 Default";
        }
        if (seasonId === '0003') {
            return "Season 3 Default";
        }
    }
    else {
        if (seasonId === 'lifetime') {
            return "Lifetime Variety";
        }
        if (seasonId === '0000') {
            return "Pre-Season Variety";
        }
        if (seasonId === '0001') {
            return "Season 1 Variety";
        }
        if (seasonId === '0002') {
            return "Season 2 Variety";
        }
        if (seasonId === '0003') {
            return "Season 3 Variety";
        }
    }
};