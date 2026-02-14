<template>
  <div id="app">
    <nav v-if="!$route.meta.hideNav">
      <router-link to="/">Home</router-link> |
      <router-link to="/login">Login</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Arial, sans-serif;
  padding: 20px;
}
nav {
  margin-bottom: 20px;
}
</style>
