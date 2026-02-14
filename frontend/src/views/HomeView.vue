<template>
  <div>
    <!-- Hero Section -->
    <div class="p-5 mb-4 bg-white rounded-3 shadow-sm border">
      <div class="container-fluid py-3">
        <h1 class="display-5 fw-bold text-primary"><i class="bi bi-book-half"></i> Welcome to the Library</h1>
        <p class="col-md-8 fs-4 text-muted">Browse our collection of classic literature and modern hits.</p>
        
        <!-- Search Bar -->
        <div class="input-group mt-4 shadow-sm" style="max-width: 600px;">
          <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
          <input v-model="searchQuery" type="text" class="form-control border-start-0" placeholder="Search by title or author..." @keyup.enter="performSearch" />
          <button class="btn btn-primary px-4" @click="performSearch">Search</button>
        </div>
      </div>
    </div>

    <!-- VULNERABILITY #2: Reflected XSS -->
    <div v-if="searchMessage" class="alert alert-info d-flex align-items-center mb-4 border-0 shadow-sm" role="alert">
      <i class="bi bi-info-circle-fill me-2"></i>
      <div v-html="searchMessage"></div>
    </div>

    <div v-if="books.length" class="row row-cols-1 row-cols-md-3 g-4">
      <div v-for="book in books" :key="book.id" class="col">
        <div class="card h-100 shadow-sm border-0 transition-hover">
          <div class="card-header bg-transparent border-bottom-0 pt-3 px-3">
             <div class="d-flex justify-content-between align-items-start">
               <span class="badge rounded-pill" :class="book.status === 'AVAILABLE' ? 'bg-success' : 'bg-warning text-dark'">
                  {{ book.status }}
               </span>
               <small class="text-muted"><i class="bi bi-hash"></i> {{ book.id }}</small>
             </div>
          </div>
          
          <!-- Book Cover Section -->
          <div class="text-center p-3 bg-light mx-3 mt-2 rounded">
             <!-- VULNERABILITY #5: Display Insecure Uploaded Image -->
            <div v-if="book.coverImage">
              <img :src="'http://localhost:3000' + book.coverImage" class="img-fluid rounded shadow-sm" style="max-height: 200px; object-fit: cover;" alt="Cover">
            </div>
            <div v-else class="text-muted py-4">
              <i class="bi bi-book" style="font-size: 4rem;"></i>
              <p class="mb-0 small">No Cover Image</p>
            </div>
          </div>

          <div class="card-body">
            <h5 class="card-title fw-bold text-truncate" :title="book.title">{{ book.title }}</h5>
            <h6 class="card-subtitle mb-2 text-primary">{{ book.author }}</h6>
            <p class="card-text small text-muted line-clamp-3">{{ book.description || 'No description available for this book.' }}</p>
          </div>

          <div class="card-footer bg-transparent border-top-0 pb-3 px-3">
            <button class="btn btn-outline-primary w-100" @click="toggleReviews(book.id)">
              <i class="bi" :class="activeBookId === book.id ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
              {{ activeBookId === book.id ? 'Hide Reviews' : 'Show Reviews' }}
            </button>
          </div>

          <!-- Review Section (Vulnerability #4 Stored XSS) -->
            <div v-if="activeBookId === book.id" class="bg-light border-top p-3 animated-fade-in">
              <h6 class="mb-3"><i class="bi bi-chat-left-text"></i> Reviews</h6>
              <div class="list-group list-group-flush mb-3 rounded shadow-sm">
                <div v-for="review in bookReviews" :key="review.id" class="list-group-item bg-white">
                  <div class="d-flex w-100 justify-content-between">
                    <strong class="text-primary small">@{{ review.User.username }}</strong>
                    <span class="badge bg-light text-warning border border-warning">
                       <i class="bi bi-star-fill"></i> {{ review.rating }}
                    </span>
                  </div>
                  <!-- FLAW: v-html executes stored scripts -->
                  <p class="mb-1 mt-1 small" v-html="review.content"></p>
                </div>
                <div v-if="bookReviews.length === 0" class="text-center text-muted small py-2">No reviews yet. Be the first!</div>
              </div>
              
              <form @submit.prevent="submitReview(book.id)">
                <div class="input-group">
                  <select v-model="newRating" class="form-select form-select-sm" style="max-width: 80px;">
                    <option value="5">5 ★</option>
                    <option value="4">4 ★</option>
                    <option value="3">3 ★</option>
                    <option value="2">2 ★</option>
                    <option value="1">1 ★</option>
                  </select>
                  <textarea v-model="newReview" class="form-control form-control-sm" placeholder="Write a review..." rows="1" required></textarea>
                  <button class="btn btn-primary btn-sm" type="submit"><i class="bi bi-send"></i></button>
                </div>
              </form>

              <!-- VULNERABILITY #5: Upload Form -->
               <div class="mt-3 pt-2 border-top">
                 <label class="form-label small text-muted d-block mb-1"><i class="bi bi-image"></i> Update Cover</label>
                 <input type="file" class="form-control form-control-sm" @change="handleFileUpload($event, book.id)">
               </div>
            </div>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-5">
       <i class="bi bi-emoji-frown display-1 text-muted"></i>
       <h3 class="mt-3 text-muted">No books found</h3>
       <p>Try adjusting your search terms.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
const newRating = ref(5)

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
  newRating.value = 5
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
      { content: newReview.value, rating: newRating.value },
      { withCredentials: true }
    )
    newReview.value = ''
    newRating.value = 5
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
.transition-hover {
  transition: transform 0.2s;
}
.transition-hover:hover {
  transform: translateY(-5px);
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.animated-fade-in {
  animation: fadeIn 0.3s ease-in;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
