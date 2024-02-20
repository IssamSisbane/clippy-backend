import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import CosmosDBClient from "../cosmosDBClient";
import { Clip } from "../models/clip";

export async function addClip(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    //const name = request.query.get('name') || await request.text() || 'world';

    const body: any = await request.json();

    if (!body.path || !body.title || !body.content || !body.type || !body.ttll) {
        return {
            status: 400,
            body: "Please pass a path, title, content, type and ttl in the request body"
        };
    }

    const clip = body as Clip;

    const cosmosDBClient = new CosmosDBClient();
    await cosmosDBClient.container.items.upsert(clip);

    return { body: `Hellon, ${body}!` };
};

app.http('addClip', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: addClip
});
