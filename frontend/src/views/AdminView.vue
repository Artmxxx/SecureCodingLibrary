<template>
  <div>
    <h2 class="mb-4">Admin Dashboard</h2>
    
    <div class="row">
      <!-- User Management Section -->
      <div class="col-md-6">
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
             <h5 class="mb-0">Manage Users</h5>
             <button class="btn btn-sm btn-light" @click="fetchUsers">Refresh</button>
          </div>
          <div class="card-body">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.username }}</td>
                  <td><span class="badge" :class="user.role === 'ADMIN' ? 'bg-danger' : 'bg-secondary'">{{ user.role }}</span></td>
                  <td>
                    <button v-if="user.username !== 'admin'" class="btn btn-sm btn-danger" @click="deleteUser(user.id)">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Book Management Section -->
      <div class="col-md-6">
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0">{{ isEditing ? 'Edit Book' : 'Add New Book' }}</h5>
            <button v-if="isEditing" class="btn btn-sm btn-light" @click="resetForm">Cancel</button>
          </div>
          <div class="card-body">
            <form @submit.prevent="saveBook">
              <div class="mb-3">
                <label class="form-label">Title</label>
                <input v-model="bookForm.title" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Author</label>
                <input v-model="bookForm.author" type="text" class="form-control" required>
              </div>
               <div class="mb-3">
                <label class="form-label">Status</label>
                <select v-model="bookForm.status" class="form-select">
                  <option value="AVAILABLE">Available</option>
                  <option value="LOANED">Loaned</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary w-100">{{ isEditing ? 'Update Book' : 'Add Book' }}</button>
            </form>
          </div>
        </div>
      </div>
    
      <!-- Book List Table -->
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Existing Books</h5>
            <button class="btn btn-sm btn-light" @click="fetchBooks">Refresh</button>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped table-hover align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="book in books" :key="book.id">
                    <td>{{ book.id }}</td>
                    <td>{{ book.title }}</td>
                    <td>{{ book.author }}</td>
                    <td>
                      <span class="badge" :class="book.status === 'AVAILABLE' ? 'bg-success' : 'bg-warning text-dark'">
                        {{ book.status }}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-primary me-2" @click="editBook(book)">Edit</button>
                      <button class="btn btn-sm btn-danger" @click="deleteBook(book.id)">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const users = ref([])
const books = ref([])
const isEditing = ref(false)
const bookForm = ref({
  id: null,
  title: '',
  author: '',
  status: 'AVAILABLE'
})

const fetchUsers = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/users', { withCredentials: true })
    users.value = res.data
  } catch (error) {
    if (error.response && error.response.status === 403) {
      alert("Access Denied")
      router.push('/')
    }
  }
}

const fetchBooks = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/books', { withCredentials: true })
    books.value = res.data.books || res.data
  } catch (error) {
    console.error(error)
  }
}

const deleteUser = async (id) => {
  if(!confirm("Are you sure?")) return;
  try {
    await axios.delete(`http://localhost:3000/api/users/${id}`, { withCredentials: true })
    fetchUsers()
  } catch (error) {
    console.error(error)
    alert("Failed to delete")
  }
}

const saveBook = async () => {
  try {
    if (isEditing.value) {
      await axios.put(`http://localhost:3000/api/books/${bookForm.value.id}`, bookForm.value, { withCredentials: true })
      alert("Book Updated!")
    } else {
      await axios.post('http://localhost:3000/api/books', bookForm.value, { withCredentials: true })
      alert("Book Added!")
    }
    resetForm()
    fetchBooks()
  } catch (error) {
    alert(error.response?.data?.message || "Operation failed")
  }
}

const deleteBook = async (id) => {
  if(!confirm("Delete this book?")) return;
  try {
    await axios.delete(`http://localhost:3000/api/books/${id}`, { withCredentials: true })
    fetchBooks()
  } catch (error) {
    alert("Failed to delete book")
  }
}

const editBook = (book) => {
  isEditing.value = true
  bookForm.value = { ...book }
}

const resetForm = () => {
  isEditing.value = false
  bookForm.value = { id: null, title: '', author: '', status: 'AVAILABLE' }
}

onMounted(() => {
  if (auth.user?.role !== 'ADMIN') {
    router.push('/')
    return
  }
  fetchUsers()
  fetchBooks()
})
</script>
