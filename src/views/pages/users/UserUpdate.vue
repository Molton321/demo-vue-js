<template>
    <div>
        <h1>Editar Usuario</h1>
        <UserForm v-if="route.params.id" :userId="parseInt(route.params.id)" @submit="updateUser" />
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import UserForm from '@/components/users/UserForm.vue';
import { useUserStore } from '@/store/UserStore';


const store = useUserStore();
const route = useRoute();
//console.log("User ID from route:", route.params.id);

const updateUser = async (updatedUser) => {
    await store.editUser(updatedUser.id, updatedUser);
};
</script>
