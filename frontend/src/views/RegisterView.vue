<template>
  <div class="row justify-content-center">
    <div class="col-md-4">
      <div class="card shadow-sm">
        <div class="card-header bg-success text-white">
          <h3 class="card-title mb-0">Sign Up</h3>
        </div>
        <div class="card-body">
          <form @submit.prevent="handleRegister">
            <div class="mb-3">
              <label class="form-label">Username</label>
              <input v-model="username" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Email address</label>
              <input v-model="email" type="email" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input v-model="password" type="password" class="form-control" required />
            </div>
            <div class="d-grid">
              <button type="submit" class="btn btn-success">Register</button>
            </div>
          </form>
          <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
          <div class="mt-3 text-center">
             <router-link to="/login">Already have an account? Login</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')

const handleRegister = async () => {
  try {
    await auth.register(username.value, email.value, password.value)
  } catch (err) {
    error.value = err
  }
}
</script>
