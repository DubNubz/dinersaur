
import { ref, onMounted, watch } from 'vue';
import { defineStore } from 'pinia';
import type { User } from 'firebase/auth';

export type Reservation = {
    title: string;
    content: string;
    id: string;
}

export type Video = {
    id: string;
    author: string;
    url: string;
    likes: number;
    views: number;
    created: Date;
    comments: VideoComment[];
}

export interface VideoCommentReply {
    author: string;
    avatar: string;
    text: string;
    likes: number;
    dislikes: number;
}

export interface VideoComment extends VideoCommentReply {
    replies: VideoCommentReply[];
}

export type BillingInfo = {
    address: string;
    cardNumber: number;
    expiration: Date;
    name: string; 
}

export type smProfile = {
    bookmarkedVideos: Video[];
    followers: string[];
    following: string[];
    posts: Video[];
}

export type MenuItem = {
    id: number,
    name: string,
    category: string,
    description: string,
    price: number,
    calories: number,
    saturatedFat: number,
    transFat: number,
    cholesterol: number,
    sodium: number,
    carbohydrates: number,
    fiber: number,
    sugars: number,
    protein: number,
    vitaminD: number,
    calcium: number,
    iron: number,
    potassium: number
}

export const userStore = defineStore('userStore', () => {
    const userData = ref<User> ();

    const currentAllergies = ref<string[]> ([]);
    const billing = ref<BillingInfo> ({
        address: "",
        cardNumber: 0,
        expiration: new Date(),
        name: ""
    });
    const reservations = ref<Reservation[]> ([]);
    const language = ref("English");
    const name = ref("");
    const pastReservations = ref<Reservation[]> ([]);
    const rating = ref(5);
    const smProfile = ref<smProfile> ({
        bookmarkedVideos: [],
        followers: [],
        following: [],
        posts: []
    });
    const profileImage = ref("https://ionicframework.com/docs/img/demos/avatar.svg");

    const currentVideo = ref<Video> ();
    const videoQueue = ref<Video[]> ([]);

    // Restaurant Layout Side

    const floorLayouts = ref<{ [key: number]: Array<Array<{ type: string }>> }>({});

    function saveLayout(floorIndex: number, layout: Array<Array<{ type: string }>>) {
        floorLayouts.value[floorIndex] = layout;
    }

    function loadLayout(floorIndex: number) {
        return floorLayouts.value[floorIndex] || [];
    }

    const menu = ref<MenuItem[]>([]);
    const categories = ref<string[]>(['Appetizer', 'Main Course', 'Dessert', 'Special Deals']);

    return { userData, reservations, pastReservations, currentAllergies, currentVideo, billing, language, name, rating, smProfile, videoQueue, floorLayouts, saveLayout, loadLayout, menu, categories, profileImage };
});
