
import { Schema } from "mongoose";
import mongoose from 'mongoose';

const playerSchema = new Schema({
    season: {
        type: String,
        required: true
    },
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
    },
    SR: {
        type: Number,
        default: 1000,
        required: true
    },
    rank: {
        type: String,
        enum: ['NTF Agent', 'Cadet', 'Ensign', 'Lieutenant', 'Sergeant', 'Master'], 
        default: 'NTF Agent', 
        required: true
    },
    hammer: {
        type: Boolean, 
        default: false,
        required: true
    },
    gamesWon: {
        type: Number,
        default: 0,
        required: true
    },
    gamesLost: {
        type: Number,
        default: 0,
        required: true
    },
    agentWins: {
        type: Number,
        default: 0,
        required: true
    },
    agentLosses: {
        type: Number,
        default: 0, 
        required: true
    },
    hackerWins: {
        type: Number,
        default: 0, 
        required: true
    },
    hackerLosses: {
        type: Number,
        default: 0, 
        required: true
    },
    lastGamePlayed: {
        type: Date,
        default: new Date('1967-09-25T10:30:00Z'),
        required: true
    },
    agentMVP: {
        type: Number,
        default: 0, 
        required: true
    },
    hackerMVP: {
        type: Number,
        default: 0, 
        required: true
    }, 
    gameDef: {
        type: Boolean,
        default: true, 
        required: true
    }
});

export default mongoose.model('Player', playerSchema);

