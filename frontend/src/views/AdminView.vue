<template>
  <div class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2 class="fw-bold mb-1">Admin Dashboard</h2>
            <p class="text-muted mb-0">Manage users, books, and view system logs.</p>
        </div>
        <div>
            <button class="btn btn-outline-dark btn-sm rounded-pill px-3 me-2" @click="fetchUsers">
                <i class="bi bi-arrow-clockwise me-1"></i> Refresh Data
            </button>
        </div>
    </div>
    
    <div class="row g-4">
      <!-- User Management Section -->
      <div class="col-lg-5">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-header bg-white border-bottom-0 pt-4 px-4 pb-0">
             <h5 class="fw-bold mb-0 text-primary"><i class="bi bi-people-fill me-2"></i>Users</h5>
          </div>
          <div class="card-body px-4">
            <div class="table-responsive">
                <table class="table table-hover align-middle">
                <thead>
                    <tr>
                    <th class="text-uppercase small text-muted">User</th>
                    <th class="text-uppercase small text-muted">Role</th>
                    <th class="text-end text-uppercase small text-muted">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id">
                    <td class="fw-medium">{{ user.username }}</td>
                    <td>
                        <span class="badge rounded-pill" :class="user.role === 'ADMIN' ? 'bg-danger-subtle text-danger' : 'bg-light text-dark border'">
                            {{ user.role }}
                        </span>
                    </td>
                    <td class="text-end">
                        <button v-if="user.username !== 'admin'" class="btn btn-link text-danger p-0 text-decoration-none" @click="deleteUser(user.id)">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                    </tr>
                </tbody>
                </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Book Management Section -->
      <div class="col-lg-7">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-header bg-white border-bottom-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
             <h5 class="fw-bold mb-0 text-success"><i class="bi bi-book-half me-2"></i>Inventory</h5>
             <button v-if="isEditing" class="btn btn-sm btn-outline-secondary rounded-pill" @click="resetForm">Cancel Edit</button>
          </div>
          <div class="card-body px-4">
            <form @submit.prevent="saveBook" class="row g-3 mb-4 p-3 bg-light rounded-3">
              <div class="col-md-5">
                <input v-model="bookForm.title" type="text" class="form-control form-control-sm border-0 shadow-sm" placeholder="Title" required>
              </div>
              <div class="col-md-4">
                <input v-model="bookForm.author" type="text" class="form-control form-control-sm border-0 shadow-sm" placeholder="Author" required>
              </div>
               <div class="col-md-3">
                <select v-model="bookForm.status" class="form-select form-select-sm border-0 shadow-sm">
                  <option value="AVAILABLE">Available</option>
                  <option value="LOANED">Loaned</option>
                </select>
              </div>
              <div class="col-12 text-end mt-2">
                  <button type="submit" class="btn btn-success btn-sm px-4 rounded-pill shadow-sm">
                      <i class="bi" :class="isEditing ? 'bi-check-lg' : 'bi-plus-lg'"></i>
                      {{ isEditing ? 'Update Book' : 'Add New Book' }}
                  </button>
              </div>
            </form>

            <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
              <table class="table table-hover align-middle">
                <thead class="sticky-top bg-white">
                  <tr>
                    <th class="text-uppercase small text-muted">Title</th>
                    <th class="text-uppercase small text-muted">Author</th>
                    <th class="text-uppercase small text-muted">Status</th>
                    <th class="text-end text-uppercase small text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="book in books" :key="book.id">
                    <td class="text-truncate" style="max-width: 150px;" :title="book.title">{{ book.title }}</td>
                    <td class="text-muted small">{{ book.author }}</td>
                    <td>
                      <span class="badge rounded-pill" :class="book.status === 'AVAILABLE' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning-emphasis'">
                          {{ book.status }}
                      </span>
                    </td>
                    <td class="text-end">
                      <button class="btn btn-sm btn-link text-primary p-0 me-2" @click="editBook(book)"><i class="bi bi-pencil-square"></i></button>
                      <button class="btn btn-sm btn-link text-danger p-0" @click="deleteBook(book.id)"><i class="bi bi-trash"></i></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </div>
    
    <!-- System Logs Section for Path Traversal Vulnerability -->
    <div class="row mt-4 mb-5">
      <div class="col-12">
        <div class="card shadow-sm border-0 border-start border-4 border-danger">
           <div class="card-body">
             <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="mb-0 text-danger"><i class="bi bi-terminal-fill me-2"></i>System Internals</h5>
                <span class="badge bg-danger">ADMIN ONLY</span>
             </div>
             
             <div class="row align-items-end">
                 <div class="col-md-8">
                    <label class="form-label small text-muted">Log Filename Parameter</label>
                    <div class="input-group">
                        <span class="input-group-text bg-white border-end-0"><i class="bi bi-file-earmark-code text-muted"></i></span>
                        <input v-model="logFile" type="text" class="form-control border-start-0" placeholder="e.g. app.log">
                    </div>
                 </div>
                 <div class="col-md-4">
                     <button class="btn btn-secondary w-100" type="button" @click="fetchLogs">
                         <i class="bi bi-eye me-2"></i>View Content
                     </button>
                 </div>
             </div>

             <div v-if="logContent" class="mt-3 bg-dark text-white p-3 rounded font-monospace small shadow-inner" style="max-height: 300px; overflow: auto;">
                 <div class="d-flex justify-content-between border-bottom border-secondary pb-2 mb-2">
                     <span>{{ logFile }}</span>
                     <span class="text-muted">READ-ONLY</span>
                 </div>
                 <pre class="mb-0 text-success">{{ logContent }}</pre>
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

const logFile = ref('app.log')
const logContent = ref('')

const fetchLogs = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/admin/logs', {
            params: { file: logFile.value },
            withCredentials: true
        });
        logContent.value = res.data.content;
    } catch (err) {
        logContent.value = 'Error fetching log: ' + (err.response?.data?.message || err.message);
    }
}

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

<style scoped>
.shadow-inner {
    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.25);
}
</style>
