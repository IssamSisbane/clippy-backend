import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import CosmosDBClient from "../helpers/cosmosDBClient";
import { Path, verifyPath } from "../models/path";

export async function addPath(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    const body: any = await request.json();

    context.log(body);
    if (!verifyPath(body)) {
        return {
            status: 400,
            body: "Please pass an id, and a emoji in the request body"
        };
    }

    const path: Path = {
        id: body.id,
        emoji: body.emoji,
        state: "free"
    };

    try {
        const cosmosDBClient = new CosmosDBClient();
        cosmosDBClient.paths_container.items.upsert(path);
        context.log(`New path created...`);
        return { jsonBody: { message: "new path created" } };
    } catch (error) {
        throw error;
    }
};

app.http('addPath', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'path/add',
    handler: addPath
});