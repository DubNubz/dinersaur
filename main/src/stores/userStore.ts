
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

    const currentVideo = ref<Video> ();
    const videoQueue = ref<Video[]> ([]);

    return { userData, reservations, pastReservations, currentAllergies, currentVideo, billing, language, name, rating, smProfile, videoQueue };
});
