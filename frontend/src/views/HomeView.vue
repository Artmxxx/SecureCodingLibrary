<template>
  <div>
    <!-- Hero Section -->
    <div class="hero-section text-white text-center py-5 mb-5">
      <div class="container py-4">
        <h1 class="display-3 fw-bold mb-3">Discover Knowledge</h1>
        <p class="lead mb-4 opacity-75">Explore our vast collection of secure coding resources and classic literature.</p>
        
        <!-- Search Bar -->
        <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6">
                <div class="input-group input-group-lg shadow-lg rounded-pill overflow-hidden">
                    <span class="input-group-text bg-white border-0 ps-4"><i class="bi bi-search text-muted"></i></span>
                    <input v-model="searchQuery" type="text" class="form-control border-0" placeholder="Search titles, authors..." @keyup.enter="performSearch" />
                    <button class="btn btn-warning fw-bold px-4" @click="performSearch">SEARCH</button>
                </div>
            </div>
        </div>
      </div>
    </div>

    <div class="container pb-5">
        <!-- FIX #2: Reflected XSS Remediated -->
        <!-- We use standard text interpolation {{ }} which Vue automatically escapes -->
        <!-- The user input will be rendered as plain text, preventing script execution -->
        <div v-if="searchMessage" class="alert alert-light border-start border-4 border-info shadow-sm d-flex align-items-center mb-5" role="alert">
            <i class="bi bi-info-circle-fill text-info me-3 fs-4"></i>
            <div class="text-dark">Search results for: <b>{{ searchMessage.replace('Search results for: ', '') }}</b></div>
        </div>

        <div v-if="books.length" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div v-for="book in books" :key="book.id" class="col">
            <div class="card h-100 hover-card border-0 bg-white">
                <div class="position-relative">
                    <div class="ratio ratio-1x1 bg-light rounded-top d-flex align-items-center justify-content-center overflow-hidden">
                        <!-- VULNERABILITY #5: Display Insecure Uploaded Image -->
                        <img v-if="book.coverImage" :src="'http://localhost:3000' + book.coverImage" class="w-100 h-100 object-fit-cover" alt="Cover">
                        <div v-else class="text-center text-muted p-5">
                            <i class="bi bi-book display-1 opacity-25"></i>
                        </div>
                    </div>
                    <span class="position-absolute top-0 end-0 m-3 badge rounded-pill shadow-sm" 
                          :class="book.status === 'AVAILABLE' ? 'bg-success' : 'bg-warning text-dark'">
                        {{ book.status }}
                    </span>
                </div>

                <div class="card-body">
                    <h5 class="card-title fw-bold text-dark text-truncate">{{ book.title }}</h5>
                    <p class="card-subtitle text-muted mb-3">{{ book.author }}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                         <small class="text-muted text-uppercase fw-bold" style="font-size: 0.75rem; letter-spacing: 0.5px;">
                            ID: #{{ book.id }}
                         </small>
                         <button class="btn btn-outline-primary btn-sm rounded-pill px-3" @click="toggleReviews(book.id)">
                            {{ activeBookId === book.id ? 'Hide Details' : 'View Details' }}
                         </button>
                    </div>

                    <!-- Review Section (Vulnerability #4 Stored XSS) -->
                    <div v-if="activeBookId === book.id" class="mt-4 pt-3 border-top animated-fade-in">
                        <h6 class="fw-bold mb-3"><i class="bi bi-star-half text-warning me-2"></i>Reviews</h6>
                        
                        <div class="reviews-scroll mb-3 pe-2" style="max-height: 200px; overflow-y: auto;">
                            <div v-if="bookReviews.length === 0" class="text-center text-muted small py-3 bg-light rounded">
                                No reviews yet. Be the first!
                            </div>
                            <div v-for="review in bookReviews" :key="review.id" class="card mb-2 border-0 bg-light">
                                <div class="card-body p-2">
                                    <div class="d-flex justify-content-between align-items-center mb-1">
                                        <small class="fw-bold text-dark">{{ review.User?.username || 'Anonymous' }}</small>
                                        <div class="text-warning" style="font-size: 0.7em;">
                                            <i v-for="n in 5" :key="n" class="bi" :class="n <= review.rating ? 'bi-star-fill' : 'bi-star'"></i>
                                        </div>
                                    </div>
                                    <!-- FLAW: v-html executes stored scripts -->
                                    <p class="mb-0 small text-secondary" v-html="review.content"></p>
                                </div>
                            </div>
                        </div>
                        
                        <form @submit.prevent="submitReview(book.id)" class="mb-3">
                            <div class="input-group input-group-sm">
                                <select v-model="newRating" class="form-select" style="max-width: 70px;">
                                    <option value="5">5 ★</option>
                                    <option value="4">4 ★</option>
                                    <option value="3">3 ★</option>
                                    <option value="2">2 ★</option>
                                    <option value="1">1 ★</option>
                                </select>
                                <input v-model="newReview" type="text" class="form-control" placeholder="Add a review..." required>
                                <button class="btn btn-primary" type="submit"><i class="bi bi-send-fill"></i></button>
                            </div>
                        </form>

                        <!-- VULNERABILITY #5: Upload Form -->
                        <div class="bg-light p-2 rounded">
                            <label class="form-label small text-muted d-block mb-1 fw-bold" style="font-size: 0.7rem;">UPDATE COVER IMAGE</label>
                            <input type="file" class="form-control form-control-sm" @change="handleFileUpload($event, book.id)">
                        </div>
                    </div>
                    
                    <button v-if="book.status === 'AVAILABLE'" class="btn btn-primary w-100 mt-3" @click="borrowBook(book.id)">
                        Borrow Book
                    </button>
                    <button v-else-if="book.status === 'LOANED'" class="btn btn-secondary w-100 mt-3" disabled>
                        Checked Out
                    </button>
                </div>
            </div>
        </div>
        </div>
        
        <div v-else class="text-center py-5">
            <div class="py-5">
                <i class="bi bi-emoji-frown display-1 text-muted opacity-25"></i>
                <h3 class="mt-4 text-muted fw-light">No books found</h3>
                <p class="text-muted">Try adjusting your search terms to find what you're looking for.</p>
            </div>
        </div>
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

const borrowBook = async (bookId) => {
  try {
    await axios.post('http://localhost:3000/api/loans', 
      { bookId },
      { withCredentials: true }
    )
    alert('Book borrowed successfully!')
    fetchBooks(searchQuery.value)
  } catch (error) {
    alert(error.response?.data?.message || 'Failed to borrow book')
  }
}

onMounted(() => {
  fetchBooks()
})
</script>

<style scoped>
.hero-section {
    background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
    border-bottom-left-radius: 50% 5%;
    border-bottom-right-radius: 50% 5%;
}
.hover-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.hover-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 1rem 3rem rgba(0,0,0,.1) !important;
}
.object-fit-cover {
    object-fit: cover;
}
.reviews-scroll::-webkit-scrollbar {
    width: 4px;
}
.reviews-scroll::-webkit-scrollbar-thumb {
    background-color: #dee2e6;
    border-radius: 4px;
}
.animated-fade-in {
  animation: fadeIn 0.3s ease-in;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
