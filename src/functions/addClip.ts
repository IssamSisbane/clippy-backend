import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import CosmosDBClient from "../helpers/cosmosDBClient";
import { Clip, verifyClip } from "../models/clip";
import { PatchOperation } from "@azure/cosmos";

export async function addClip(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Starting the clip creation...`);

    const body: any = await request.json();

    if (!verifyClip(body)) {
        return {
            status: 400,
            body: "Please pass a path, title, content, type and ttl in the request body"
        };
    }

    const clip = body as Clip;
    const cosmosDBClient = new CosmosDBClient();

    // change the state of the path to used
    const operations: PatchOperation[] = [
        { op: 'replace', path: '/state', value: 'used' }
    ];
    await cosmosDBClient.paths_container.item(clip.path, clip.path).patch(operations);

    // add the clip to the database
    await cosmosDBClient.clips_container.items.upsert(clip);

    context.log(`New clip created...`);
    return { jsonBody: clip };
};

app.http('addClip', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'clip/add',
    handler: addClip
});
