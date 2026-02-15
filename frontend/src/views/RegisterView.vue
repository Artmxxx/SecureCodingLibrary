<template>
  <div class="auth-wrapper d-flex align-items-center justify-content-center min-vh-100" style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-5 col-lg-4">
                <div class="text-center mb-4">
                    <div class="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center shadow" style="width: 80px; height: 80px;">
                        <i class="bi bi-person-plus-fill fs-1"></i>
                    </div>
                </div>
                <div class="card shadow-lg border-0 rounded-4">
                    <div class="card-body p-4 p-md-5">
                        <h3 class="card-title text-center fw-bold mb-4 text-success">Create Account</h3>
                        <form @submit.prevent="handleRegister">
                            <div class="form-floating mb-3">
                                <input v-model="username" type="text" class="form-control" id="floatingOutput" placeholder="Username" required>
                                <label for="floatingOutput">Username</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input v-model="email" type="email" class="form-control" id="floatingInput" placeholder="name@example.com" required>
                                <label for="floatingInput">Email address</label>
                            </div>
                            <div class="form-floating mb-4">
                                <input v-model="password" type="password" class="form-control" id="floatingPassword" placeholder="Password" required>
                                <label for="floatingPassword">Password</label>
                            </div>
                            <div class="d-grid gap-3">
                                <button type="submit" class="btn btn-success btn-lg rounded-pill fw-bold shadow-sm">Sign Up</button>
                                <router-link to="/login" class="btn btn-light btn-sm rounded-pill text-muted">Already have an account? Login</router-link>
                            </div>
                        </form>
                        <div v-if="error" class="alert alert-danger mt-4 d-flex align-items-center rounded-3 shadow-sm border-0">
                            <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ error }}
                        </div>
                    </div>
                </div>
                <div class="text-center mt-3">
                     <router-link to="/" class="text-decoration-none text-muted small"><i class="bi bi-arrow-left me-1"></i> Back to Home</router-link>
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
