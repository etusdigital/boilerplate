<script setup lang="ts"></script>

<template>
  <div class="not-found-container">
    <h1 class="status-code">404</h1>
    <h2 class="message-title">Oops! Page Not Found</h2>
    <p class="message-body">
      Sorry, we couldn't find the page you were looking for. It might have been moved, deleted, or maybe it never
      existed.
    </p>
    <router-link to="/" class="home-link-button"> Go Back to Home </router-link>
  </div>
</template>

<style scoped>
.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 1rem;
  min-height: calc(100vh - 150px); /* Adjust based on header/footer height */
  font-family: 'Arial', sans-serif; /* Use your project's font */
  color: #333;
}

.status-code {
  font-size: 6rem; /* Make the 404 stand out */
  font-weight: bold;
  color: #e0e0e0; /* Light grey for the number */
  margin-bottom: 0.5rem;
}

.message-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #555;
}

.message-body {
  font-size: 1rem;
  color: #777;
  max-width: 500px; /* Limit text width for readability */
  line-height: 1.6;
  margin-bottom: 2rem;
}

.home-link-button {
  display: inline-block;
  padding: 10px 25px;
  background-color: #42b983; /* Example: Vue Green or your primary color */
  color: white;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition:
    background-color 0.2s ease-in-out,
    transform 0.1s ease;
}

.home-link-button:hover {
  background-color: #36a46e; /* Darker shade on hover */
  transform: translateY(-1px); /* Slight lift effect */
}

.home-link-button:active {
  transform: translateY(0); /* Push back down on click */
}
</style>
