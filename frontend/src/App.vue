<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm mb-4" v-if="!$route.meta.hideNav">
      <div class="container">
        <router-link class="navbar-brand d-flex align-items-center" to="/">
          <i class="bi bi-book-half me-2"></i> Secure Library
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
    <div class="container flex-grow-1">
      <router-view />
    </div>
    
    <footer class="bg-light text-center text-lg-start mt-auto py-3 border-top">
      <div class="container text-center text-muted">
        <small>&copy; 2026 Secure Coding Library. All rights reserved.</small>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth'
const auth = useAuthStore()
</script>

<style>
body {
  background-color: #f0f2f5;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.navbar-brand {
  font-weight: 600;
}
</style>
