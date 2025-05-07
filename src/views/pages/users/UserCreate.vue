<template>
    <div>
        <h1>Crear Usuario</h1>
        <UserForm @submit="createUser" />
    </div>
</template>

<script setup lang="ts">
import UserForm from '@/components/users/UserForm.vue';
import { useUserStore } from '@/store/UserStore';

const store = useUserStore();

const createUser = async (user) => {
    await store.addUser(user);
};
</script>