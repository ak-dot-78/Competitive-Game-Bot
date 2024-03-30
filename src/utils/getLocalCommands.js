import path from 'path';
import { fileURLToPath, pathToFileURL as urlPathToFileURL } from 'url';
import getAllFiles from '../utils/getAllFiles.js';

function pathToFileURL(filePath) {
    return urlPathToFileURL(filePath).href;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default async (exceptions = []) => {
    let localCommands = [];
    const commandCategories = getAllFiles(
        path.join(__dirname, '..', 'commands'),
        true
    );

    for (const commandCategory of commandCategories ){
        const commandFiles = getAllFiles(commandCategory);
        
        for (const commandFile of commandFiles) { 
            try {
                const module = await import(pathToFileURL(commandFile));
                const commandObject = module.default; 

                if (exceptions.includes(commandObject.name)){
                    continue;
                }

                localCommands.push(commandObject);
            } catch (error) {
                console.error(`Failed to load command at ${commandFile}:`, error);
            }
        }
    }
    return localCommands;
}