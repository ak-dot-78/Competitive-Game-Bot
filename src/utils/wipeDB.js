import mongoose from "mongoose";
import Rank from '../schemas/Rank.js';

export default async (guildId) => {
    try {

        await Rank.deleteMany({ guildID: guildId });
        console.log(`Data wiped for guild with ID ${guildId}.`);

    } catch (error) {
        console.error('Error wiping guild data:', error);
    }
}