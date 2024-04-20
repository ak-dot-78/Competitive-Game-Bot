export default (seasonId) => { 
    if (seasonId === 'lifetime') {
        return "Lifetime";
    }
    if (seasonId === '0000') {
        return "Pre-Season";
    }
    if (seasonId === '0001') {
        return "Season 1";
    }
};