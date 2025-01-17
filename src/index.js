import dotenv from 'dotenv';
dotenv.config();
import { Client, GatewayIntentBits } from "discord.js";
import mongoose from "mongoose";
import eventHandler from './handlers/eventHandler.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});

(async () => {
    try {
      // eslint-disable-next-line no-undef
      await mongoose.connect(process.env.MONGO_URL);
      console.log("Connected to DB");

      // Logging DB collection names
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray(); 
      console.log(collections.map(c => c.name)); 
      
      eventHandler(client);
      // eslint-disable-next-line no-undef
      client.login(process.env.TOKEN);

    } catch (error) {
      console.error("Failed DB connection:", error);
    }
})();
  



