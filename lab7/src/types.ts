export interface DogImage { url: string; breed: string; }
export interface CatFact { fact: string; length: number; }
export interface User { name: string; email: string; country: string; picture: string; }
export interface Post { id: number; title: string; body: string; userId: number; }
export interface Notification { message: string; type: 'success' | 'error'; id: number; }

export interface StoreState {
    dogs: DogImage[];
    catFacts: CatFact[];
    users: User[];
    posts: Post[];
    loadingDogs: boolean;
    loadingFacts: boolean;
    loadingUsers: boolean;
    loadingPosts: boolean;
    loadDogs: () => Promise<void>;
    loadCatFacts: () => Promise<void>;
    loadUsers: () => Promise<void>;
    loadPosts: () => Promise<void>;
    removeDog: (index: number) => void;
    removeFact: (index: number) => void;
    removeUser: (index: number) => void;
    addPost: (title: string, body: string) => Promise<void>;
    updatePost: (id: number, title: string, body: string) => Promise<void>;
    deletePost: (id: number) => Promise<void>;
}