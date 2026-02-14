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
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">Add New Book</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="addBook">
              <div class="mb-3">
                <label class="form-label">Title</label>
                <input v-model="newBook.title" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Author</label>
                <input v-model="newBook.author" type="text" class="form-control" required>
              </div>
               <div class="mb-3">
                <label class="form-label">Status</label>
                <select v-model="newBook.status" class="form-select">
                  <option value="AVAILABLE">Available</option>
                  <option value="LOANED">Loaned</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary w-100">Add Book</button>
            </form>
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
const newBook = ref({
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

const addBook = async () => {
  try {
    await axios.post('http://localhost:3000/api/books', newBook.value, { withCredentials: true })
    alert("Book Added!")
    newBook.value = { title: '', author: '', status: 'AVAILABLE' }
  } catch (error) {
    alert(error.response?.data?.message || "Failed to add book")
  }
}

onMounted(() => {
  if (auth.user?.role !== 'ADMIN') {
    router.push('/')
    return
  }
  fetchUsers()
})
</script>
