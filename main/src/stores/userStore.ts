
import { ref, onMounted, watch, computed } from 'vue';
import { defineStore } from 'pinia';
import type { User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import { profile } from 'console';

export type Reservation = {
    /** ID of the restaurant. */
    restaurant: string;
    /** Milliseconds since epoch. */
    time: number;
    people: number;
    price: number;
    paid: boolean;
    paymentId?: string;
    id: string;
    /** Array of menu item IDs in the reservation. */
    menuItems: string[];
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
    /** Milliseconds since epoch. */
    expiration: number;
    name: string;
    stripeId: string;
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

export type Floor = {
    name: string;
    width: number;
    length: number;
}

export type RestaurantInfo = {
    name: string;
    address: string;
    phone: string | null;
    email: string | null;
    menu: MenuItem[];
    id: string;
    offers: PointOffer[];
    /** Milliseconds of refund time.
     * 
     * 0 means no refund.
     * 
     * -1 means no limit.
     */
    refundLimit: number;
}

export type PointOffer = {
    /** Milliseconds since epoch. */
    expires: number | null;
    cost: number;
    description: string;
    title: string;
    code: string;
}

export type SubscriptionInfo = {
    currentlySubscribed: boolean;
    stripeSubscriptionId?: string;
    currentPeriodEnd?: number;
}

export type Marker = {
    coordinate: any,
    title: string,
    snippet: string,
}

export const userStore = defineStore('userStore', () => {
    const userData = ref<User> ();

    const currentAllergies = ref<string[]> ([]);
    const billing = ref<BillingInfo> ({
        address: "",
        cardNumber: 0,
        expiration: new Date().getTime(),
        name: "",
        stripeId: ""
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
    const subscription = ref<SubscriptionInfo> ({
        currentlySubscribed: false
    });

    const currentVideo = ref<Video> ();
    const videoQueue = ref<Video[]> ([]);

    const nearbyRestaurants = ref<RestaurantInfo[]> ([]);
    // Restaurant

    const restaurantName = ref("")

    // Restaurant Map Design

    const restaurantMarkerData = ref<Marker[]>([]);

    // Restaurant Layout Side

    const numFloors = ref<number>(1);

    const floors = computed<Floor[]>(() => {
        return Array.from({ length: numFloors.value }, (_, index) => ({
            name: `Floor ${index + 1}`,
            width: 7,
            length: 7
        }));
    });

    const selectedFloorIndex = ref(0);

    const floorLayouts = ref<{ [key: number]: { type: string }[][] }>({});

    function saveLayout(floorIndex: number, layout: { type: string }[][]) {
        floorLayouts.value[floorIndex] = layout;
    }

    function loadLayout(floorIndex: number) {
        return floorLayouts.value[floorIndex] || [];
    }

    // Restaurant Discover

    const menu = ref<MenuItem[]>([]);
    const categories = ref<string[]>(['Appetizer', 'Main Course', 'Dessert', 'Special Deals']);
    const selectedCategory = ref<string | null>(null);

    return { userData, reservations, pastReservations, currentAllergies, notifications, nearbyRestaurants, currentVideo, billing, language, name, rating, smProfile, videoQueue, points, subscription, floorLayouts, saveLayout, loadLayout, menu, categories, profileImage, numFloors, floors, selectedFloorIndex, selectedCategory, restaurantName, restaurantMarkerData };
});
