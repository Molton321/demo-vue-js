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