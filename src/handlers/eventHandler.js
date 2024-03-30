import path from 'path';
import { fileURLToPath, pathToFileURL as urlPathToFileURL } from 'url';
import getAllFiles from '../utils/getAllFiles.js';

function pathToFileURL(filePath) {
    return urlPathToFileURL(filePath).href;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (client) => {
    const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true);

    for (const eventFolder of eventFolders) {
        const eventFiles = getAllFiles(eventFolder);
        eventFiles.sort((a,b) => a > b);
        const eventName = eventFolder.replace(/\\/g, '/').split('/').pop();
        client.on(eventName, async (arg) => {
            for (const eventFile of eventFiles) {
                const eventFunctionModule = await import(pathToFileURL(eventFile));
                const eventFunction = eventFunctionModule.default; 
                await eventFunction(client, arg);
            }
        }) 
    }   
};
