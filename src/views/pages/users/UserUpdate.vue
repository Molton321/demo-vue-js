<template>
    <div>
        <h1>Editar Usuario</h1>
        <UserForm v-if="route.params.id" :userId="parseInt(route.params.id)" @submit="updateUser" />
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import UserForm from '@/components/users/UserForm.vue';
const route = useRoute();
</script>
