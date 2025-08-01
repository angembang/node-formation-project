const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

class MongoService {
    constructor() {
        this.url = process.env.MONGO_URI;
        this.dbName = 'users'; 
        this.client = new MongoClient(this.url, {
            useNewUrlParser: true,
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        this.db = null;
    }

    async connect() {
        if (!this.db) {
            try {
                await this.client.connect();
                // test the connexion
                await this.client.db('admin').command({ ping: 1 });
                console.log('Connected to MongoDB Atlas');
                this.db = this.client.db(this.dbName);
            } catch (err) {
                console.error('Failed to connect to MongoDB:', err);
                throw err;
            }
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
