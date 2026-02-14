<template>
  <div>
    <h1>Library Books</h1>
    
    <!-- Search Bar -->
    <div class="search-bar">
      <input v-model="searchQuery" placeholder="Search books..." @keyup.enter="performSearch" />
      <button @click="performSearch">Search</button>
    </div>

    <!-- VULNERABILITY #2: Reflected XSS -->
    <div v-if="searchMessage" v-html="searchMessage" class="search-message"></div>

    <div v-if="books.length">
      <div v-for="book in books" :key="book.id" class="book-card">
        <h3>{{ book.title }}</h3>
        
        <!-- VULNERABILITY #5: Display Insecure Uploaded Image -->
        <div v-if="book.coverImage">
          <img :src="'http://localhost:3000' + book.coverImage" alt="Cover" style="max-width: 100px;">
        </div>

        <p>Author: {{ book.author }}</p>
        <span :class="{'available': book.status === 'AVAILABLE', 'loaned': book.status === 'LOANED'}">
          {{ book.status }}
        </span>

        <!-- Review Section (Vulnerability #4 Stored XSS) -->
        <button @click="toggleReviews(book.id)">Reviews</button>
        <div v-if="activeBookId === book.id" class="reviews-section">
          <h4>Reviews</h4>
          <div v-for="review in bookReviews" :key="review.id" class="review">
            <strong>{{ review.User.username }}:</strong>
            <!-- FLAW: v-html executes stored scripts -->
            <p v-html="review.content"></p> 
          </div>
          
          <form @submit.prevent="submitReview(book.id)">
            <textarea v-model="newReview" placeholder="Write a review..."></textarea>
            <button type="submit">Submit</button>
          </form>

          <!-- VULNERABILITY #5: Upload Form -->
           <h4>Update Cover</h4>
           <input type="file" @change="handleFileUpload($event, book.id)">
        </div>
      </div>
    </div>
    <div v-else>No books found.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const books = ref([])
const searchMessage = ref('')
const searchQuery = ref('')
const activeBookId = ref(null)
const bookReviews = ref([])
const newReview = ref('')

const fetchBooks = async (query = '') => {
  try {
    const url = query 
      ? `http://localhost:3000/api/books?q=${query}`
      : 'http://localhost:3000/api/books'
      
    const response = await axios.get(url, { withCredentials: true })
    
    if (response.data.books) {
      books.value = response.data.books
      searchMessage.value = response.data.message
    } else {
      books.value = response.data.books || response.data
      searchMessage.value = response.data.message || ''
    }
  } catch (error) {
    console.error('Failed to fetch books', error)
  }
}

const performSearch = () => {
  fetchBooks(searchQuery.value)
}

const toggleReviews = async (bookId) => {
  if (activeBookId.value === bookId) {
    activeBookId.value = null
    return
  }
  activeBookId.value = bookId
  newReview.value = ''
  try {
    const res = await axios.get(`http://localhost:3000/api/books/${bookId}/reviews`)
    bookReviews.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const submitReview = async (bookId) => {
  try {
    await axios.post(`http://localhost:3000/api/books/${bookId}/reviews`, 
      { content: newReview.value, rating: 5 },
      { withCredentials: true }
    )
    newReview.value = ''
    toggleReviews(bookId) // Refresh
  } catch (err) {
    alert('Login required to post reviews')
  }
}

const handleFileUpload = async (event, bookId) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('coverImage', file)

  try {
    await axios.post(`http://localhost:3000/api/books/${bookId}/cover`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true
    })
    alert('Cover uploaded!')
    fetchBooks(searchQuery.value)
  } catch (error) {
    alert('Upload failed: ' + error.response?.data?.message)
  }
}

onMounted(() => {
  fetchBooks()
})
</script>

<style scoped>
.book-card {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 4px;
}
.search-bar {
  margin-bottom: 20px;
}
.available { color: green; }
.loaned { color: red; }
.reviews-section {
  margin-top: 10px;
  padding: 10px;
  background-color: #f9f9f9;
}
</style>
