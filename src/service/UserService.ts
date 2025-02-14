import axios from 'axios';
import type { User } from '../models/User';

const API_URL = 'https://1076fb57-4d96-4c31-97ae-62ab2e89d65f.mock.pstmn.io/users';

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