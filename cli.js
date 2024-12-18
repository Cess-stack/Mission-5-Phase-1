#!/usr/bin/env node

const { MongoClient } = require('mongodb');
const { program } = require('commander');
const fs = require('fs');
const path = require('path');

const uri = 'mongodb://localhost:27017';
const dbName = 'auction_db';
const collectionName = 'auction_items';

async function connectToMongo() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        return client;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

async function seedData() {
    const client = await connectToMongo();
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        
        // Read seed data
        const seedData = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed-data.json'), 'utf8'));
        
        // Insert the data
        const result = await collection.insertMany(seedData.auctionItems);
        console.log(`Successfully seeded ${result.insertedCount} auction items`);
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await client.close();
    }
}

async function deleteData() {
    const client = await connectToMongo();
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        
        const result = await collection.deleteMany({});
        console.log(`Deleted ${result.deletedCount} auction items`);
    } catch (error) {
        console.error('Error deleting data:', error);
    } finally {
        await client.close();
    }
}

program
    .version('1.0.0')
    .description('CLI tool for managing auction data in MongoDB');

program
    .command('seed')
    .description('Seed sample auction data into MongoDB')
    .action(seedData);

program
    .command('delete')
    .description('Delete all auction data from MongoDB')
    .action(deleteData);

program.parse(process.argv);
