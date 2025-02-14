import type { User } from '@/models/User';
import UserService from '@/service/UserService';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', {
    state: () => ({
        users: [] as User[],
    }),
    actions: {
        async fetchUsers() {
            this.users = await UserService.getUsers();
            return this.users
        },
        async addUser(user: User) {
            await UserService.createUser(user);
            return await this.fetchUsers();
        },
        async editUser(id: number, user: User) {
            await UserService.updateUser(id, user);
            return await this.fetchUsers();
        },
        async removeUser(id: number) {
            await UserService.deleteUser(id);
            return await this.fetchUsers();
        },
    }
});