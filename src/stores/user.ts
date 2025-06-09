import { defineStore } from 'pinia';
import Api from '../services/api';
import Cookies from 'js-cookie';

type Credentials = {
    email: string;
    password: string;
};
type User = {
    id: number;
    name: string;
    email: string;
};


export const useUser = defineStore('user', {
    state:()=>{
        return{

            user: null as User | null,
            token: ""
        }
    },
    actions: {
        async login(credentials: Credentials) {

            try {
                const response = await Api.post('/api/login', credentials);
                this.user = response.data.data.user;
                this.token = response.data.data.token;

                return response.data.data;
            } catch (error) {
                throw error;
            }


        },
        async logout(){
            this.user=null;
            this.token = '';
            Cookies.remove('token');
            Cookies.remove('user');

        },
    },
    getters: {
        getUser : (state)=>state.user,
        getToken : (state) => state.token
    }
});