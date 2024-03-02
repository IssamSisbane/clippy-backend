import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { uploadBlob } from "../helpers/azureStorage";
import { AZURE_STORAGE_ACCOUNT_KEY, AZURE_STORAGE_ACCOUNT_NAME } from "../config";

export async function uploadFileClip(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Starting the clip creation...`);

    const formData: any = await request.formData();
    const fileToUpload = formData.get('file') as File;

    console.log(fileToUpload.name)

    // File
    const fileContents = await fileToUpload.arrayBuffer();
    const fileContentsBuffer: Buffer = Buffer.from(fileContents);

    const containerName = `clippy-images`;

    const result = await uploadBlob(
        AZURE_STORAGE_ACCOUNT_NAME,
        AZURE_STORAGE_ACCOUNT_KEY,
        fileToUpload.name,
        containerName,
        fileContentsBuffer
    );

    context.log(result);
    return { jsonBody: { file: result } };
};

app.http('uploadFileClip', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'clip/upload/file',
    handler: uploadFileClip
});