import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import CosmosDBClient from "../cosmosDBClient";
import { Clip, verifyClip } from "../models/clip";
import * as fs from 'fs';

export async function addClip(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Starting the clip creation...`);

    const body: any = await request.json();

    if (!verifyClip(body)) {
        return {
            status: 400,
            body: "Please pass a path, title, content, type and timeToLive in the request body"
        };
    }

    const clip = body as Clip;
    const cosmosDBClient = new CosmosDBClient();

    // get a random unused animal
    context.log(`Finding an unused animal..."`);
    const items = await cosmosDBClient.container.items.readAll().fetchAll();
    const usableAnimals = getUsableAnimals(items.resources as Clip[]);
    const randomIndex = Math.floor(Math.random() * usableAnimals.length);
    const randomAnimal = usableAnimals[randomIndex];
    clip.path = randomAnimal;

    // add the clip to the database
    await cosmosDBClient.container.items.upsert(clip);

    context.log(`New clip created...`);
    return { body: `Clip added to path ${clip.path}` };
};

function readAnimalsJsonFileSync() {
    const animals = fs.readFileSync("src/helpers/animals.json", 'utf8');
    return JSON.parse(animals);
}

function getUsableAnimals(clips: Clip[]) {
    const animals = readAnimalsJsonFileSync();

    return animals.filter(animal => {
        return clips.every(item => item.path !== animal);
    });
}

app.http('addClip', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'clip/add',
    handler: addClip
});
