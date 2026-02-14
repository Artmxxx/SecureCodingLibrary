<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label>Email:</label>
        <input v-model="email" type="email" required />
      </div>
      <div>
        <label>Password:</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const email = ref('')
const password = ref('')
const error = ref('')

const handleLogin = async () => {
  try {
    await auth.login(email.value, password.value)
  } catch (err) {
    error.value = err
  }
}
</script>

<style scoped>
.login-container {
  max-width: 300px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.error {
  color: red;
}
</style>
