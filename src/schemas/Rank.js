import { Schema, model } from "mongoose";
import mongoose from 'mongoose';

const rankSchema = new Schema({
    userID: {
        type: String, 
        required: true,
    },
    guildID: {
        type: String,
        required: true, 
    },
    username: {
        type: String,
        required: true,
    },
    SR: {
        type: Number,
        default: 1000,
    },
    rank: {
        type: String,
        enum: ['NTF Agent', 'Cadet', 'Ensign', 'Lieutenant', 'Sergeant', 'Master'], 
        default: 'NTF Agent', 
    },
    hammer: {
        type: Boolean, 
        default: false,
    },
    gamesWon: {
        type: Number,
        default: 0,
    },
    gamesLost: {
        type: Number,
        default: 0,
    },
    lastGamePlayed: {
        type: Date,
        default: new Date('1967-09-25T10:30:00Z'),
    }

});

export default mongoose.model('Rank', rankSchema);

