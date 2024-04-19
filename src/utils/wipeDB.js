import mongoose from "mongoose";
import Player from '../schemas/Player.js';

export default async (guildId) => {
    try {

        await Player.deleteMany({ guildID: guildId });
        console.log(`Data wiped for guild with ID ${guildId}.`);

    } catch (error) {
        console.error('Error wiping guild data:', error);
    }
}