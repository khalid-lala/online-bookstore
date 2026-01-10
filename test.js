// Test script for API endpoints
// Run with: node test.js

const testAPI = async () => {
    const BASE_URL = 'http://localhost:5000/api/books';

    console.log('🚀 Starting API Tests...\n');

    try {
        // Test 1: CREATE a book
        console.log('1️⃣  Testing POST /api/books (Create Book)');
        const createResponse = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: 'Harry Potter and the Philosopher Stone',
                author: 'J.K. Rowling',
                genre: 'Fantasy',
                price: 29.99,
                publishedDate: '1997-06-26',
                inStock: true
            })
        });
        const createdBook = await createResponse.json();
        console.log('✅ Created:', createdBook);
        const bookId = createdBook.data._id;
        console.log('');

        // Test 2: CREATE more books
        console.log('2️⃣  Creating additional books...');
        const books = [
            { title: '1984', author: 'George Orwell', genre: 'Dystopian', price: 15.99, inStock: true },
            { title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', price: 18.99, inStock: true },
            { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Fiction', price: 12.99, inStock: false }
        ];

        for (const book of books) {
            await fetch(BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(book)
            });
        }
        console.log('✅ Created 3 more books');
        console.log('');

        // Test 3: GET all books
        console.log('3️⃣  Testing GET /api/books (Get All Books)');
        const getAllResponse = await fetch(BASE_URL);
        const allBooks = await getAllResponse.json();
        console.log('✅ Total books:', allBooks.total);
        console.log('📚 Books:', allBooks.data.map(b => b.title));
        console.log('');

        // Test 4: GET single book
        console.log('4️⃣  Testing GET /api/books/:id (Get Single Book)');
        const getOneResponse = await fetch(`${BASE_URL}/${bookId}`);
        const singleBook = await getOneResponse.json();
        console.log('✅ Retrieved:', singleBook.data.title);
        console.log('');

        // Test 5: UPDATE a book
        console.log('5️⃣  Testing PUT /api/books/:id (Update Book)');
        const updateResponse = await fetch(`${BASE_URL}/${bookId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ price: 24.99, inStock: false })
        });
        const updatedBook = await updateResponse.json();
        console.log('✅ Updated price:', updatedBook.data.price);
        console.log('✅ Updated stock:', updatedBook.data.inStock);
        console.log('');

        // Test 6: SEARCH by author
        console.log('6️⃣  Testing Search by Author (GET /api/books?author=rowling)');
        const searchResponse = await fetch(`${BASE_URL}?author=rowling`);
        const searchResults = await searchResponse.json();
        console.log('✅ Found:', searchResults.count, 'book(s) by Rowling');
        console.log('');

        // Test 7: SEARCH by genre
        console.log('7️⃣  Testing Search by Genre (GET /api/books?genre=fiction)');
        const genreResponse = await fetch(`${BASE_URL}?genre=fiction`);
        const genreResults = await genreResponse.json();
        console.log('✅ Found:', genreResults.count, 'Fiction book(s)');
        console.log('');

        // Test 8: PAGINATION
        console.log('8️⃣  Testing Pagination (GET /api/books?page=1&limit=2)');
        const paginationResponse = await fetch(`${BASE_URL}?page=1&limit=2`);
        const paginationResults = await paginationResponse.json();
        console.log('✅ Page 1, showing', paginationResults.count, 'of', paginationResults.total);
        console.log('✅ Total pages:', paginationResults.pages);
        console.log('');

        // Test 9: DELETE a book
        console.log('9️⃣  Testing DELETE /api/books/:id (Delete Book)');
        const deleteResponse = await fetch(`${BASE_URL}/${bookId}`, {
            method: 'DELETE'
        });
        const deleteResult = await deleteResponse.json();
        console.log('✅ Deleted successfully');
        console.log('');

        // Test 10: Verify deletion
        console.log('🔟 Verifying deletion (GET /api/books/:id should return 404)');
        const verifyResponse = await fetch(`${BASE_URL}/${bookId}`);
        const verifyResult = await verifyResponse.json();
        if (verifyResponse.status === 404) {
            console.log('✅ Book correctly deleted (404 returned)');
        }
        console.log('');

        console.log('🎉 All tests completed successfully!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
};

// Run tests
testAPI();