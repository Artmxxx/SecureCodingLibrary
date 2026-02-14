<template>
  <div>
    <h1 class="mb-4">Library Books</h1>
    
    <!-- Search Bar -->
    <div class="input-group mb-4">
      <input v-model="searchQuery" type="text" class="form-control" placeholder="Search books by title or author..." @keyup.enter="performSearch" />
      <button class="btn btn-primary" @click="performSearch">Search</button>
    </div>

    <!-- VULNERABILITY #2: Reflected XSS -->
    <div v-if="searchMessage" v-html="searchMessage" class="alert alert-info"></div>

    <div v-if="books.length" class="row">
      <div v-for="book in books" :key="book.id" class="col-md-6 mb-4">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <h5 class="card-title">{{ book.title }}</h5>
              <span class="badge" :class="book.status === 'AVAILABLE' ? 'bg-success' : 'bg-warning text-dark'">
                {{ book.status }}
              </span>
            </div>
            <h6 class="card-subtitle mb-2 text-muted">{{ book.author }}</h6>
            
            <!-- VULNERABILITY #5: Display Insecure Uploaded Image -->
            <div v-if="book.coverImage" class="mt-3 mb-3 text-center">
              <img :src="'http://localhost:3000' + book.coverImage" class="img-fluid rounded" style="max-height: 200px;" alt="Cover">
            </div>

            <!-- Review Section (Vulnerability #4 Stored XSS) -->
            <hr>
            <button class="btn btn-sm btn-outline-secondary mb-3" @click="toggleReviews(book.id)">
              {{ activeBookId === book.id ? 'Hide Reviews' : 'Show Reviews' }}
            </button>
            
            <div v-if="activeBookId === book.id">
              <div class="list-group mb-3">
                <div v-for="review in bookReviews" :key="review.id" class="list-group-item">
                  <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">{{ review.User.username }}</h6>
                    <small>Rating: {{ review.rating }}/5</small>
                  </div>
                  <!-- FLAW: v-html executes stored scripts -->
                  <p class="mb-1" v-html="review.content"></p>
                </div>
                <div v-if="bookReviews.length === 0" class="text-muted p-2">No reviews yet.</div>
              </div>
              
              <form @submit.prevent="submitReview(book.id)">
                <div class="input-group mb-3">
                  <textarea v-model="newReview" class="form-control" placeholder="Write a review..." rows="2"></textarea>
                  <button class="btn btn-outline-primary" type="submit">Post</button>
                </div>
              </form>

              <!-- VULNERABILITY #5: Upload Form -->
               <div class="mt-3 border-top pt-2">
                 <label class="form-label small text-muted">Update Cover Image</label>
                 <input type="file" class="form-control form-control-sm" @change="handleFileUpload($event, book.id)">
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="alert alert-warning">No books found.</div>
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
/* Additional custom styles if needed */
</style>
