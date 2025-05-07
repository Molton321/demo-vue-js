import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import Aura from '@primevue/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import '@/assets/styles.scss';
import '@/assets/tailwind.css';
import axios from 'axios';
import { createPinia } from 'pinia';

const app = createApp(App);

const pinia = createPinia();

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

// Añadir un interceptor global para todas las solicitudes
axios.interceptors.request.use(
    (config) => {
        // Definir rutas que deben estar excluidas del token
        const excepciones = ['login', 'public']; // Palabras clave a excluir

        // Verificar si la URL de la solicitud contiene alguna de las palabras clave en la lista de excepciones
        const isExcepcion = excepciones.some(keyword => config.url.includes(keyword));

        if (!isExcepcion) {
            // Obtener el token del almacenamiento local (o de donde lo guardes)

            const user = JSON.parse(localStorage.getItem('user'));
            console.log("agregando token " + user["token"]);
            if (user) {
                // Si el token existe, agregarlo al encabezado Authorization
                config.headers['Authorization'] = `Bearer ${user["token"]}`;
            }
        }
        return config;
    },
    (error) => {
        // Manejar cualquier error en la solicitud
        return Promise.reject(error);
    }
);