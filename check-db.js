require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bookstore';

console.log('🔍 Checking MongoDB Connection...');
console.log('Connection String:', MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')); // Hide password if exists

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('✅ MongoDB Connected Successfully!');
        console.log('📊 Database Name:', mongoose.connection.db.databaseName);

        // Check if Book model exists
        const Book = require('./src/models/book');

        // Count documents
        const count = await Book.countDocuments();
        console.log(`📚 Total Books in Database: ${count}`);

        // Show all books
        if (count > 0) {
            const books = await Book.find();
            console.log('\n📖 Books in Database:');
            books.forEach((book, index) => {
                console.log(`\n${index + 1}. ${book.title}`);
                console.log(`   Author: ${book.author}`);
                console.log(`   Price: $${book.price}`);
                console.log(`   ID: ${book._id}`);
            });
        } else {
            console.log('\n⚠️  No books found in database!');
            console.log('Try creating a book using POST /api/books');
        }

        await mongoose.connection.close();
        console.log('\n🔌 Connection closed');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    });
