const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const uri = 'mongodb://localhost:27017';
const dbName = 'auction_db';
const collectionName = 'auction_items';

app.use(cors());
app.use(express.json());

// Connect to MongoDB
async function connectToMongo() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        return client;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

// Search endpoints
app.get('/api/items/search', async (req, res) => {
    const { query, minPrice, maxPrice } = req.query;
    const client = await connectToMongo();

    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Build search criteria
        let searchCriteria = {};

        // Add text search if query is provided
        if (query) {
            searchCriteria.$or = [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ];
        }

        // Add price range if provided
        if (minPrice || maxPrice) {
            searchCriteria.start_price = {};
            if (minPrice) searchCriteria.start_price.$gte = Number(minPrice);
            if (maxPrice) searchCriteria.start_price.$lte = Number(maxPrice);
        }

        const items = await collection.find(searchCriteria).toArray();
        res.json(items);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
});

// Get all items
app.get('/api/items', async (req, res) => {
    const client = await connectToMongo();

    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const items = await collection.find({}).toArray();
        res.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
});

// Get item by ID
app.get('/api/items/:id', async (req, res) => {
    const client = await connectToMongo();

    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const item = await collection.findOne({ _id: req.params.id });
        
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        
        res.json(item);
    } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
