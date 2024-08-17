
import { ref, onMounted, watch } from 'vue';
import { defineStore } from 'pinia';
import type { User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

export type Reservation = {
    restaurantName: string;
    address: string;
    /** Milliseconds since epoch. */
    time: number;
    people: number;
    price: number;
    paid: boolean;
    id: string;
}

export type Video = {
    id: string;
    title: string;
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
    /** Array of video IDs as strings. */
    bookmarkedVideos: string[];
    /** Array of video IDs as strings. */
    likedVideos: string[];
    /** Array of UIDs as strings. */
    followers: string[];
    /** Array of UIDs as strings. */
    following: string[];
    /** Array of video IDs as strings. */
    posts: string[];
}

export type ReportReason = "Animal abuse" | "Child abuse" | "Copyright infringement" | "Harrassment" | "Hateful content" | "Misinformation" | "Promotes terrorism" | "Sexual content" | "Spam" | "Other";
export type VideoReport = {
    reportId: string;
    videoId: string;
    reason: ReportReason;
    customReason: string;
    reporterId: string;
    date: Date;
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

export type Notification = {
    title: string;
    text: string;
    /** Milliseconds since epoch. */
    date: number;
    read: boolean;
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
    const language = ref("en");
    const name = ref("");
    const pastReservations = ref<Reservation[]> ([]);
    const rating = ref(5);
    const smProfile = ref<smProfile> ({
        bookmarkedVideos: [],
        likedVideos: [],
        followers: [],
        following: [],
        posts: []
    });
    const profileImage = ref("https://ionicframework.com/docs/img/demos/avatar.svg");
    const notifications = ref<Notification[]> ([]);
    const points = ref(0);
    const subscribed = ref(false);

    const currentVideo = ref<Video> ();
    const videoQueue = ref<Video[]> ([]);

    // Restaurant Layout Side

    const floorLayouts = ref<{ [key: number]: { type: string }[][] }>({});

    function saveLayout(floorIndex: number, layout: { type: string }[][]) {
        floorLayouts.value[floorIndex] = layout;
    }

    function loadLayout(floorIndex: number) {
        return floorLayouts.value[floorIndex] || [];
    }

    const menu = ref<MenuItem[]>([]);
    const categories = ref<string[]>(['Appetizer', 'Main Course', 'Dessert', 'Special Deals']);

    return { userData, reservations, pastReservations, currentAllergies, notifications, currentVideo, billing, language, name, rating, smProfile, videoQueue, points, subscribed, floorLayouts, saveLayout, loadLayout, menu, categories };
});
