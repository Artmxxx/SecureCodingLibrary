<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <nav class="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm py-3" v-if="!$route.meta.hideNav">
      <div class="container">
        <router-link class="navbar-brand d-flex align-items-center fw-bold text-uppercase" to="/" style="letter-spacing: 1px;">
          <i class="bi bi-journal-bookmark-fill me-2 fs-4"></i> LibSecure
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/"><i class="bi bi-house-door"></i> Home</router-link>
            </li>
            <li class="nav-item" v-if="auth.user && auth.user.role === 'ADMIN'">
              <router-link class="nav-link" to="/admin"><i class="bi bi-speedometer2"></i> Dashboard</router-link>
            </li>
            <li class="nav-item" v-if="!auth.user">
              <router-link class="nav-link" to="/login"><i class="bi bi-box-arrow-in-right"></i> Login</router-link>
            </li>
            <li class="nav-item" v-if="!auth.user">
              <router-link class="btn btn-outline-light ms-2" to="/register">Sign Up</router-link>
            </li>
            <li class="nav-item dropdown" v-else>
               <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                 <i class="bi bi-person-circle"></i> {{ auth.user.username }}
               </a>
               <ul class="dropdown-menu dropdown-menu-end">
                 <li><router-link class="dropdown-item" to="/profile">My Profile</router-link></li>
                 <li><hr class="dropdown-divider"></li>
                 <li><a class="dropdown-item" href="#" @click.prevent="auth.logout()">Logout</a></li>
               </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="flex-grow-1">
      <router-view />
    </div>
    
    <footer class="bg-dark text-white text-center py-4 mt-auto">
      <div class="container">
        <div class="mb-3">
          <i class="bi bi-journal-bookmark-fill fs-3 text-secondary"></i>
        </div>
        <p class="mb-1 fw-bold">LibSecure System</p>
        <small class="text-white-50">&copy; 2026 Secure Coding Library. Designed for Security Training.</small>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth'
const auth = useAuthStore()
</script>

<style>
/* Global overrides handled in main.css */
</style>
