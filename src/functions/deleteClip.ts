import { PatchOperation } from "@azure/cosmos";
import { app, Timer, InvocationContext } from "@azure/functions";
import CosmosDBClient from "../helpers/cosmosDBClient";
import { deleteBlob } from "../helpers/azureStorage";
import { AZURE_STORAGE_ACCOUNT_KEY, AZURE_STORAGE_ACCOUNT_NAME } from "../config";

export async function deleteClip(myTimer: Timer, context: InvocationContext): Promise<void> {
    const nowInSeconds = Math.floor(Date.now() / 1000);

    const cosmosDBClient = new CosmosDBClient();
    const result = await cosmosDBClient.clips_container.items.query(`SELECT * FROM c WHERE c.ttl + c._ts < ${nowInSeconds}`).fetchAll();

    if (result.resources.length === 0) {
        context.log(`No clips to delete`);
        return;
    }

    context.log(`Deleting ${result.resources.length} clips...`);

    for (const clip of result.resources) {
        await cosmosDBClient.clips_container.item(clip.id, clip.ttl).delete();

        const operations: PatchOperation[] = [
            { op: 'replace', path: '/state', value: 'free' }
        ];
        await cosmosDBClient.paths_container.item(clip.path, clip.path).patch(operations);

        if (clip.file !== undefined && clip.file !== null && clip.file !== '' && clip.file_extension) await deleteBlob(AZURE_STORAGE_ACCOUNT_NAME, AZURE_STORAGE_ACCOUNT_KEY, 'clippy-images', `${clip.path}.${clip.file_extension}`);
    }

    context.log(`Clips deleted`);

    return;
};

app.timer('deleteExpiredClipDaily', {
    schedule: '0 3 * * *',
    handler: deleteClip,
});