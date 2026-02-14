<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4" v-if="!$route.meta.hideNav">
      <div class="container">
        <router-link class="navbar-brand" to="/">Secure Library</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Home</router-link>
            </li>
            <li class="nav-item" v-if="auth.user && auth.user.role === 'ADMIN'">
              <router-link class="nav-link" to="/admin">Admin Dashboard</router-link>
            </li>
            <li class="nav-item" v-if="!auth.user">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
            <li class="nav-item" v-if="!auth.user">
              <router-link class="nav-link" to="/register">Sign Up</router-link>
            </li>
            <li class="nav-item" v-else>
               <a class="nav-link" href="#" @click.prevent="auth.logout()">Logout ({{ auth.user.username }})</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth'
const auth = useAuthStore()
</script>

<style>
body {
  background-color: #f8f9fa;
}
</style>
