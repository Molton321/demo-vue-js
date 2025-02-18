import axios from 'axios';
import type { User } from '../models/User';

const API_URL = import.meta.env.VITE_API_URL;

class AuthService {
    async login(user: User): Promise<User> {
        try {
            console.log("servicio1")
            console.log(API_URL)
            const response = await axios.post<{ user: User; token: string }>(`${API_URL}/login`, user);
            console.log("luego")
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            console.log("servicio2")
            return response.data as User;
        } catch (error) {
            throw new Error('Login failed. Please check your credentials. ' + error);
        }
    }

    logout(): void {
        localStorage.removeItem('user');
    }

    getCurrentUser(): User | null {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) as User : null;
    }

    getToken(): any | null {
        let userJSON = localStorage.getItem('user');
        if (!userJSON) {
            return null;
        }

        let user = JSON.parse(userJSON) as Partial<User>; // Evita errores si faltan propiedades
        return user["token"] ?? null;
    }
}

export default new AuthService();
