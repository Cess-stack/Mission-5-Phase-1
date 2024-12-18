# MongoDB Auction Data Seeding Tool

A command-line interface tool for seeding and managing auction data in MongoDB.

## Prerequisites

- Node.js installed
- MongoDB running locally on default port (27017)
- npm (Node Package Manager)

## Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
```bash
npm install
```

## Usage

### Seed Data
To seed the sample auction data into MongoDB:
```bash
npm run seed
```

### Delete Data
To delete all auction data from MongoDB:
```bash
npm run delete
```

## Data Structure

The seed data includes auction items with the following fields:
- title: Name of the auction item
- description: Detailed description of the item
- start_price: Initial bidding price
- reserve_price: Minimum price for the item to be sold

## Sample Data

Sample auction items are stored in `seed-data.json`. You can modify this file to add or change items before seeding.
