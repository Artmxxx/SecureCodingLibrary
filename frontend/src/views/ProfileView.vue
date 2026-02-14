<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h4 class="mb-0"><i class="bi bi-person-lines-fill me-2"></i>My Profile</h4>
          </div>
          <div class="card-body">
            <div v-if="message" :class="['alert', isError ? 'alert-danger' : 'alert-success']">
              {{ message }}
            </div>

            <form @submit.prevent="updateProfile">
              <div class="mb-3">
                <label class="form-label">Username</label>
                <input v-model="profile.username" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input v-model="profile.email" type="email" class="form-control" required />
              </div>
              <div class="mb-3">
                 <label class="form-label">Role</label>
                 <input type="text" class="form-control" :value="authStore.user?.role" disabled readonly />
                 <div class="form-text">Role cannot be changed.</div>
              </div>
              
              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-success">
                  <i class="bi bi-save me-2"></i>Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import axios from 'axios';

const authStore = useAuthStore();
const profile = ref({
  username: '',
  email: ''
});
const message = ref('');
const isError = ref(false);

onMounted(() => {
  if (authStore.user) {
    profile.value.username = authStore.user.username;
    profile.value.email = authStore.user.email;
  }
});

const updateProfile = async () => {
  try {
    const res = await axios.put('http://localhost:3000/api/users/profile', profile.value, {
      withCredentials: true
    });
    message.value = 'Profile updated successfully!';
    isError.value = false;
    // Update store
    if (res.data.user) {
        authStore.user.username = res.data.user.username;
        authStore.user.email = res.data.user.email;
    }
  } catch (err) {
    message.value = err.response?.data?.message || 'Failed to update profile';
    isError.value = true;
  }
};
</script>
