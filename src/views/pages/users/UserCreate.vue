<template>
    <div>
        <h1>Crear Usuario</h1>
        <UserForm @submit="createUser" />
    </div>
</template>

<script setup lang="ts">
import UserForm from '@/components/users/UserForm.vue';
</script>