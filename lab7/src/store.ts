import { create } from 'zustand';
import { StoreState, DogImage, CatFact, User, Post } from './types';

const API = {
    dogs: async (): Promise<DogImage[]> => {
        const promises = Array(4).fill(null).map(() => fetch('https://dog.ceo/api/breeds/image/random'));
        const responses = await Promise.all(promises);
        const data = await Promise.all(responses.map(r => r.json()));
        return data.map(d => ({ url: d.message, breed: d.message.match(/breeds\/([^\/]+)\//)?.[1]?.replace(/-/g, ' ') || 'неизвестная' }));
    },
    catFacts: async (): Promise<CatFact[]> => {
        const res = await fetch('https://catfact.ninja/facts?limit=6');
        const data = await res.json();
        return data.data;
    },
    users: async (): Promise<User[]> => {
        const res = await fetch('https://randomuser.me/api/?results=5');
        const data = await res.json();
        return data.results.map((u: any) => ({ name: `${u.name.first} ${u.name.last}`, email: u.email, country: u.location.country, picture: u.picture.thumbnail }));
    },
    posts: async (): Promise<Post[]> => {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=6');
        return res.json();
    }
};

export const useStore = create<StoreState>((set, get) => ({
    dogs: [],
    catFacts: [],
    users: [],
    posts: [],
    loadingDogs: false,
    loadingFacts: false,
    loadingUsers: false,
    loadingPosts: false,

    loadDogs: async () => {
        set({ loadingDogs: true });
        try { set({ dogs: await API.dogs() }); } catch(e) { console.error(e); }
        finally { set({ loadingDogs: false }); }
    },
    loadCatFacts: async () => {
        set({ loadingFacts: true });
        try { set({ catFacts: await API.catFacts() }); }
        finally { set({ loadingFacts: false }); }
    },
    loadUsers: async () => {
        set({ loadingUsers: true });
        try { set({ users: await API.users() }); }
        finally { set({ loadingUsers: false }); }
    },
    loadPosts: async () => {
        set({ loadingPosts: true });
        try { set({ posts: await API.posts() }); }
        finally { set({ loadingPosts: false }); }
    },
    removeDog: (index) => set((s) => ({ dogs: s.dogs.filter((_, i) => i !== index) })),
    removeFact: (index) => set((s) => ({ catFacts: s.catFacts.filter((_, i) => i !== index) })),
    removeUser: (index) => set((s) => ({ users: s.users.filter((_, i) => i !== index) })),
    addPost: async (title, body) => {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, body, userId: 1 })
        });
        const newPost = await res.json();
        set((s) => ({ posts: [newPost, ...s.posts] }));
    },
    updatePost: async (id, title, body) => {
        await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, title, body, userId: 1 })
        });
        set((s) => ({ posts: s.posts.map(p => p.id === id ? { ...p, title, body } : p) }));
    },
    deletePost: async (id) => {
        await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, { method: 'DELETE' });
        set((s) => ({ posts: s.posts.filter(p => p.id !== id) }));
    }
}));