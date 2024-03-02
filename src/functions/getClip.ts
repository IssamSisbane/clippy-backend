import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import CosmosDBClient from "../helpers/cosmosDBClient";

export async function getClip(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Starting the clip finding...`);

    const path = request.params.path;


    if (!path) {
        return {
            status: 400,
            body: "Please pass a path in the request query"
        };
    }

    const cosmosDBClient = new CosmosDBClient();
    const result = await cosmosDBClient.clips_container.items.query('SELECT * FROM c WHERE c.path = "' + path + '"').fetchAll();

    if (result.resources.length === 0) {
        return {
            status: 404,
            body: "Clip not found"
        };
    }

    context.log(`Clip found...`);

    return {
        jsonBody: result.resources[0]
    };
};

app.http('getClip', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'clip/get/{path}',
    handler: getClip
});