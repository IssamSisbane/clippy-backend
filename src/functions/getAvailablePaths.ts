import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import CosmosDBClient from "../helpers/cosmosDBClient";
import { Path } from "../models/path";

export async function getAvailablePaths(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const cosmosDBClient = new CosmosDBClient();

    // get a random unused animal
    context.log(`Get all unused animal..."`);
    const usable_clips = await cosmosDBClient.paths_container.items.query("SELECT c.id, c.emoji, c.state FROM c WHERE c.state = 'free'").fetchAll();

    if (usable_clips.resources.length === 0) {
        return {
            status: 404,
            body: "No free paths available"
        };
    }

    return { jsonBody: usable_clips.resources as Path[] };
};

app.http('getAvailablePaths', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'paths/get/available',
    handler: getAvailablePaths
});