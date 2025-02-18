<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/store/Auth';
import type { User } from '@/models/User';

const authStore = useAuthStore();
const user = ref<User>({ email: '', password: '' });

const handleLogin = async () => {
    try {
        await authStore.login(user.value);
    } catch (error) {
        alert(error.message);
    }
};
</script>

<template>
  <div class="login-container">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="user.email" type="email" placeholder="Email" required />
      <input v-model="user.password" type="password" placeholder="Contraseña" required />
      <button type="submit">Ingresar</button>
    </form>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 300px;
  margin: auto;
}
</style>
