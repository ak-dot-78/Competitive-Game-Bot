import { Schema} from "mongoose";
import mongoose from 'mongoose';

const gameSchema = new Schema({
    season: {
        type: String,
        required: true
    },
    gameDef: {
        type: Boolean,
        default: true, 
        required: true
    },
    guildID: {
        type: String,
        required: true, 
    },
    totalGames: {
        type: Number,
        default: 0,
        required: true
    },
    agentWins: {
        type: Number,
        default: 0,
        required: true
    },
    hackerWins: {
        type: Number,
        default: 0,
        required: true
    }
});

export default mongoose.model('Games', gameSchema);

