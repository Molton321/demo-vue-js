Estructura recomendada para un **CRUD de usuarios en Vue 3 con TypeScript**, asegurando una correcta separación de responsabilidades y validaciones en el formulario.  

---

## **📌 Estructura del Proyecto Vue 3**
```
📂 src/
│── 📂 components/         # Componentes reutilizables
│   ├── UserForm.vue
│   ├── UserList.vue
│
│── 📂 models/             # Definición de interfaces o tipos
│   ├── User.ts
│
│── 📂 services/           # Servicios de llamadas a la API
│   ├── UserService.ts
│
│── 📂 store/              # Estado global con Pinia
│   ├── userStore.ts
│
│── 📂 views/              # Vistas principales del sistema
│   ├── UserCreate.vue
│   ├── UserEdit.vue
│   ├── UserListView.vue
│
│── 📂 router/             # Configuración de rutas
│   ├── index.ts
│
│── 📂 utils/              # Funciones de validación y utilidades
│   ├── validators.ts
│
│── main.ts                # Punto de entrada de la app
│── App.vue                # Componente raíz
│── tsconfig.json          # Configuración de TypeScript
│── vite.config.ts         # Configuración de Vite
```

---

## **1️⃣ Modelo de Usuario (`models/User.ts`)**
```ts
export interface User {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  age?: number;
  city?: string;
  phone?: string;
  is_active?: boolean;
}
```

---

## **2️⃣ Servicio para la API (`services/UserService.ts`)**
```ts
import axios from 'axios';
import type { User } from '../models/User';

const API_URL = 'https://xxxxxxxxxx.mock.pstmn.io/users';

class UserService {
    async getUsers() {
        const response = await axios.get<User[]>(API_URL);
        return response;
    }

    async getUser(id: number) {
        const response = await axios.get<User>(`${API_URL}/${id}`);
        return response;
    }

    async createUser(user: User) {
        const response = await axios.post<User>(API_URL, user);
        return response;
    }

    async updateUser(id: number, user: User) {
        const response = await axios.put<User>(`${API_URL}/${id}`, user);
        return response;
    }

    async deleteUser(id: number) {
        await axios.delete(`${API_URL}/${id}`);
    }
}

export default new UserService();

```

---

## **3️⃣ Validaciones  (`utils/UserValidators.ts`)**
```ts

import { User } from "@/models/User";
import { z } from "zod";

export class UserValidator {
    private static schema = z.object({
        name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
        email: z.string().email("Correo inválido."),
        password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
        age: z.number().optional().refine(age => age === undefined || age > 0, {
            message: "La edad debe ser un número positivo.",
        }),
        city: z.string().optional(),
        phone: z.string().regex(/^\d{10}$/, "El teléfono debe tener 10 dígitos.").optional(),
        is_active: z.boolean().optional(),
    });

    static validateField<K extends keyof User>(field: K, value: any) {
        const fieldSchema = this.schema.pick({ [field]: true } as any);
        return fieldSchema.safeParse({ [field]: value });
    }
}


```

---

## **4️⃣ Estado Global con Pinia (`store/UserStore.ts`)**
```ts

import type { User } from '@/models/User';
import UserService from '@/service/UserService';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', {
    state: () => ({
        users: [] as User[],
    }),
    actions: {
        async fetchUsers() {
            let response = await UserService.getUsers();
            this.users = response.data
            return this.users
        },
        async getUser(id: number) {
            return await UserService.getUser(id);
        },
        async addUser(user: User) {
            return await UserService.createUser(user);
        },
        async editUser(id: number, user: User) {
            return await UserService.updateUser(id, user);

        },
        async removeUser(id: number) {
            return await UserService.deleteUser(id);
        },
    }
});

```
Luego es necesario inicializar Pinia en la main.js

```ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import Aura from '@primevue/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import '@/assets/styles.scss';
import '@/assets/tailwind.css';
import { createPinia } from 'pinia'; // 👈  Importar

const app = createApp(App);

const pinia = createPinia();// 👈  Instanciar

app.use(pinia); // 👈 Registrar Pinia antes de usarlo
app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(ToastService);
app.use(ConfirmationService);

app.mount('#app');

```
---

## **5️⃣ Formulario con Validaciones (`components/Users/UserForm.vue`)**
```vue
<script setup lang="ts">
import { useUserStore } from '@/store/UserStore';
import { UserValidator } from "@/utils/UserValidators";
import Swal from "sweetalert2";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from 'vue-router';

const props = defineProps<{ userId?: number }>();

const user = reactive({
  name: "",
  email: "",
  password: "",
  age: null,
  city: "",
  phone: "",
  is_active: false,
});

const errors = reactive<Record<string, string>>({});
const isSubmitting = ref(false);
const successMessage = ref("");
const store = useUserStore();
const router = useRouter();

const validateField = (field: keyof typeof user) => {
  const result = UserValidator.validateField(field, user[field]);

  if (!result.success) {
    errors[field] = result.error.errors[0].message;
  } else {
    delete errors[field]; // Borra el error si es válido
  }
};

const validateAllFields = () => {
  Object.keys(user).forEach((field) => {
    validateField(field as keyof typeof user);
  });
};

// Cargar usuario si se pasa un userId
onMounted(async () => {
  if (props.userId) {
    try {
      const response = await store.getUser(props.userId);
      if (response.status == 200) {
        let fetchedUser = response.data
        Object.assign(user, fetchedUser);
      }


    } catch (error) {
      console.error("Error al cargar usuario:", error);
    }
  }
});

// Enviar formulario (crear o actualizar usuario)
const submitForm = async () => {
  validateAllFields();

  if (Object.keys(errors).length > 0) return;

  isSubmitting.value = true;
  successMessage.value = "";

  try {
    let response;
    if (props.userId) {
      response = await store.editUser(props.userId, user);
    } else {
      response = await store.addUser(user);
    }

    if (response.status === 200 || response.status === 201) {
      Swal.fire({
        title: 'Éxito',
        text: props.userId ? 'Usuario actualizado con éxito ✅' : 'Usuario creado con éxito ✅',
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 3000
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: `❌ Código ${response.status}: ${response.data?.message || 'Ocurrió un error'}`,
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo',
        timer: 3000
      });
    }
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: '❌ Error inesperado en la operación.',
      icon: 'error',
      confirmButtonText: 'OK',
      timer: 3000
    });
  } finally {
    isSubmitting.value = false;
  }
  router.push('/users');
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="w-full bg-white shadow-lg rounded-lg p-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        {{ props.userId ? "Editar Usuario" : "Crear Usuario" }}
      </h2>

      <form @submit.prevent="submitForm" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">Nombre:</label>
          <input v-model="user.name" type="text" @input="validateField('name')" @blur="validateField('name')"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          <span class="text-red-500 text-sm" v-if="errors.name">{{ errors.name }}</span>
        </div>

        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">Email:</label>
          <input v-model="user.email" type="email" @input="validateField('email')" @blur="validateField('email')"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          <span class="text-red-500 text-sm" v-if="errors.email">{{ errors.email }}</span>
        </div>

        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">Contraseña:</label>
          <input v-model="user.password" type="password" @input="validateField('password')"
            @blur="validateField('password')"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          <span class="text-red-500 text-sm" v-if="errors.password">{{ errors.password }}</span>
        </div>

        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">Edad:</label>
          <input v-model.number="user.age" type="number" @input="validateField('age')" @blur="validateField('age')"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          <span class="text-red-500 text-sm" v-if="errors.age">{{ errors.age }}</span>
        </div>

        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">Ciudad:</label>
          <input v-model="user.city" type="text" @input="validateField('city')" @blur="validateField('city')"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">Teléfono:</label>
          <input v-model="user.phone" type="text" @input="validateField('phone')" @blur="validateField('phone')"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          <span class="text-red-500 text-sm" v-if="errors.phone">{{ errors.phone }}</span>
        </div>

        <div class="col-span-1 md:col-span-2 flex items-center space-x-2">
          <input v-model="user.is_active" type="checkbox"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <label class="text-sm font-medium text-gray-700">Activo</label>
        </div>

        <div class="col-span-1 md:col-span-2">
          <button type="submit" :disabled="Object.keys(errors).length > 0 || isSubmitting"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400">
            {{ isSubmitting ? "Enviando..." : props.userId ? "Actualizar" : "Crear" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>


```

---
** ️6️⃣ Configuración de Views **

---

## **📂 views/Users/UserListView.vue**  
Lista todos los usuarios y permite editarlos o eliminarlos.  
```vue
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
```

---

## **📂 views/Users/UserCreate.vue**  
Formulario para crear un nuevo usuario.  
```vue
<template>
    <div>
        <h1>Crear Usuario</h1>
        <UserForm @submit="createUser" />
    </div>
</template>

<script setup lang="ts">
import UserForm from '@/components/users/UserForm.vue';
</script>
```

---

## **📂 views/Users/UserEdit.vue**  
Formulario para editar un usuario existente.  
```vue

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


```

---

Estos archivos proporcionan la interfaz para la gestión de usuarios en tu sistema. 🚀
## **7️⃣ Configuración de Rutas (`router/index.ts`)**
```ts
import { createRouter, createWebHistory } from 'vue-router';
import UserListView from '@/views/UserListView.vue';
import UserCreate from '@/views/UserCreate.vue';
import UserEdit from '@/views/UserEdit.vue';

const routes = [
  { path: '/users', component: UserListView },
  { path: '/users/create', component: UserCreate },
  { path: '/users/edit/:id', component: UserEdit, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
```

---