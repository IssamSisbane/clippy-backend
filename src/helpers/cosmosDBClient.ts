import { CosmosClient, Database, Container } from '@azure/cosmos';
import { COSMOS_DB_ENDPOINT, COSMOS_DB_KEY } from '../config';

const endpoint = COSMOS_DB_ENDPOINT;
const key = COSMOS_DB_KEY;

class CosmosDBClient {
    client: CosmosClient;
    database: Database;
    clips_container: Container;
    paths_container: Container;

    constructor(
        database: string = "clippy",
    ) {
        this.client = new CosmosClient({ endpoint, key });
        this.database = this.client.database(database);
        this.clips_container = this.database.container("clips");
        this.paths_container = this.database.container("paths");
    }
}

export default CosmosDBClient;