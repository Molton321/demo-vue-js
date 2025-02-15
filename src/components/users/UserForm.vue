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
