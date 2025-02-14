<template>
    <div>
        <h1>Crear Usuario</h1>
        <UserForm @submit="createUser" />
    </div>
</template>

<script setup lang="ts">
import UserForm from '@/components/users/UserForm.vue';
import { useUserStore } from '@/store/UserStore';
import Swal from 'sweetalert2';

const store = useUserStore();

const createUser = async (user) => {
    let response=await store.addUser(user);
    if(response.status==200){
        Swal.fire({
        title: 'Éxito',
        text: 'Registro creado con éxito ✅',
        icon: 'success'
    });
    }
    
};
</script>