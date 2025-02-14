<template>
    <div class="min-h-screen bg-gray-100 p-6">
        <div class=" mx-auto bg-white shadow-lg rounded-lg p-6">
            <h1 class="text-2xl font-bold text-gray-800 mb-4">Lista de Usuarios</h1>

            <router-link to="/users/create"
                class="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mb-4">
                <PlusCircleIcon class="w-5 h-5 mr-2" />
                Crear Usuario
            </router-link>

            <div class="overflow-x-auto">
                <table class="min-w-full bg-white border border-gray-300 rounded-lg">
                    <thead class="bg-gray-200 text-gray-700">
                        <tr>
                            <th class="px-4 py-2 border">Nombre</th>
                            <th class="px-4 py-2 border">Email</th>
                            <th class="px-4 py-2 border">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in users" :key="user.id" class="hover:bg-gray-100 transition">
                            <td class="px-4 py-2 border">{{ user.name }}</td>
                            <td class="px-4 py-2 border">{{ user.email }}</td>
                            <td class="px-4 py-2 border flex space-x-4">
                                <router-link :to="`/users/update/${user.id}`"
                                    class="text-blue-600 hover:text-blue-800 flex items-center">
                                    <PencilIcon class="w-5 h-5 mr-1" />
                                    Editar
                                </router-link>
                                <button @click="deleteUser(user.id)"
                                    class="text-red-600 hover:text-red-800 flex items-center">
                                    <TrashIcon class="w-5 h-5 mr-1" />
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import { useUserStore } from '@/store/UserStore';
import { PencilIcon, PlusCircleIcon, TrashIcon } from 'lucide-vue-next';
import { computed, onMounted } from 'vue';

const store = useUserStore();

onMounted(() => {
    store.fetchUsers();
});

// Siempre está pendiente si hay un cambio en el store
const users = computed(() => store.users);
const deleteUser = async (id: number) => {
    await store.removeUser(id);
    await store.fetchUsers();
};
</script>