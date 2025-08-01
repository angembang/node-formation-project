const {MongoClient, ObjectId} = require ('mongodb');
const { v4: uuidv4 } = require ('uuid');

class MongoService {
    constructor() {
        // this.url = 'mongodb://localhost:27017';
        this.url = process.env.MONGO_URI;
        this.dbName = 'brainsPart2'; 
        this.client = new MongoClient(this.url, { useUnifiedTopology: true });
        this.db = null;
    }

    async connect() {
        if (!this.db) {
            await this.client.connect();
            this.db = this.client.db(this.dbName);
        }
        return this.db;
    }

    async getCollection(collectionName) {
        const db = await this.connect();
        return db.collection(collectionName);
    }

    async close() {
        if (this.client) {
            await this.client.close();
            this.db = null;
        }
    }
}

module.exports = MongoService;