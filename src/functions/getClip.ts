import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import CosmosDBClient from "../cosmosDBClient";
import { Clip } from "../models/clip";

export async function getClip(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    //const name = request.query.get('name') || await request.text() || 'world';

    const path = request.query.get('path');


    if (!path) {
        return {
            status: 400,
            body: "Please pass a path in the request query"
        };
    }

    const cosmosDBClient = new CosmosDBClient();
    const result = await cosmosDBClient.container.items.query('SELECT * FROM c WHERE c.path = "' + path + '"').fetchAll();

    // const result = await cosmosDBClient.container.items.readAll().fetchAll();

    if (result.resources.length === 0) {
        return {
            status: 404,
            body: "Clip not found"
        };
    }

    return {
        body: JSON.stringify(result.resources[0])
    };
};

app.http('getClip', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getClip
});