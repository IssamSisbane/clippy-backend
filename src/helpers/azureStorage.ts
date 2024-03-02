import {
    BlobServiceClient,
    ContainerClient,
    StorageSharedKeyCredential,
    generateBlobSASQueryParameters,
    BlobSASPermissions
} from '@azure/storage-blob';

function getBlobServiceClient(serviceName, serviceKey) {
    const sharedKeyCredential = new StorageSharedKeyCredential(
        serviceName,
        serviceKey
    );
    const blobServiceClient = new BlobServiceClient(
        `https://${serviceName}.blob.core.windows.net`,
        sharedKeyCredential
    );

    return blobServiceClient;
}

async function createContainer(
    containerName: string,
    blobServiceClient: BlobServiceClient
): Promise<ContainerClient> {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists();

    return containerClient;
}

export async function uploadBlob(
    serviceName: string,
    serviceKey: string,
    fileName: string,
    containerName: string,
    blob: Buffer
): Promise<String> {
    if (!serviceName || !serviceKey || !fileName || !containerName || !blob) {
        throw new Error('Upload function missing parameters');
    }

    try {
        const blobServiceClient = getBlobServiceClient(serviceName, serviceKey);

        const containerClient = await createContainer(
            containerName,
            blobServiceClient
        );
        const blockBlobClient = await containerClient.getBlockBlobClient(fileName);
        const sas_url = await blockBlobClient.uploadData(blob);

        const sasToken = await getBlobSasUri(containerClient, fileName, serviceName, serviceKey);
        console.log(`SAS token for blob is: ${sasToken}`);

        return sasToken;
    } catch (error) {
        throw error;
    }
}

// Create a service SAS for a blob
export async function getBlobSasUri(containerClient, blobName, serviceName, serviceKey) {
    const sharedKeyCredential = new StorageSharedKeyCredential(
        serviceName,
        serviceKey
    );

    const sasOptions = {
        containerName: containerClient.containerName,
        blobName: blobName,
        startsOn: new Date(),
        expiresOn: new Date(new Date().valueOf() + 3600 * 1000),
        permissions: BlobSASPermissions.parse("r")
    };

    const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();
    console.log(`SAS token for blob is: ${sasToken}`);

    return `${containerClient.getBlockBlobClient(blobName).url}?${sasToken}`;
}