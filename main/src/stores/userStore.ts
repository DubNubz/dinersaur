
import { ref, onMounted, watch, computed } from 'vue';
import { defineStore } from 'pinia';
import type { User } from 'firebase/auth';
import { GeoPoint, Timestamp } from 'firebase/firestore';
import { profile } from 'console';

export type Reservation = {
    /** ID of the restaurant. */
    restaurant: string;
    /** Time of the reservation.
     * @type Milliseconds since epoch. */
    time: number;
    /** Number of people in the reservation. */
    people: number;
    /** Price of the reservation in USD. */
    price: number;
    /** Represents if the reservation has been prepaid or not. */
    paid: boolean;
    /** ID of the Stripe payment, if applicable. */
    paymentId?: string;
    /** Array of menu item IDs in the reservation. */
    menuItems: string[];
    /** Array of allergies. */
    allergies: string[];
    /** ID of the customer. */
    customer: string;
    /** ID of the reservation. */
    id: string;
    /** If the reservation has been accepted by the restaurant or not. */
    accepted: boolean;
}

export type Video = {
    /** ID of the video. */
    id: string;
    /** Title of the video. */
    title: string;
    /** ID of the author of the video. */
    author: string;
    /** Firebase Storage URL to the video. */
    url: string;
    /** Numbr of likes on the video. */
    likes: number;
    /** Numbr of views on the video. */
    views: number;
    /** Time of the video's creation.
     * @type Milliseconds since epoch. */
    created: number;
    /** Array of comments. */
    comments: VideoComment[];
}

export interface VideoCommentReply {
    /** Author of the comment or reply. */
    author: string;
    /** Text of the comment or reply. */
    text: string;
    /** Number of likes on the comment or reply. */
    likes: number;
    /** Number of dislikes on the comment or reply. */
    dislikes: number;
}

export interface VideoComment extends VideoCommentReply {
    /** Array of replies on the comment. */
    replies: VideoCommentReply[];
}

export type BillingInfo = {
    /** Billing address. */
    address: string;
    /** Card number. */
    cardNumber: number;
    /** Expiration date of the card.
     * @type Milliseconds since epoch. */
    expiration: number;
    /** Name of the card holder. */
    name: string;
    /** ID of the Stripe customer. */
    stripeId: string;
    /** Phone number of the user. */
    phoneNumber: number;
}

export type smProfile = {
    /** Array of video IDs. */
    bookmarkedVideos: string[];
    /** Array of video IDs. */
    likedVideos: string[];
    /** Array of UIDs. */
    followers: string[];
    /** Array of UIDs. */
    following: string[];
    /** Array of video IDs. */
    posts: string[];
}

export type ReportReason = "Animal abuse" | "Child abuse" | "Copyright infringement" | "Harrassment" | "Hateful content" | "Misinformation" | "Promotes terrorism" | "Sexual content" | "Spam" | "Other";
export type VideoReport = {
    /** ID of the report. */
    reportId: string;
    /** ID of the video in question. */
    videoId: string;
    /** Reason of the report. */
    reason: ReportReason;
    /** Custom reason of the report.
     * @requires Reason must be "Other".
     */
    customReason: string;
    /** UID of the reporter. */
    reporterId: string;
    /** Time of the report.
     * @type Milliseconds since epoch. */
    date: number;
}

export type MenuItem = {
    /** ID of the menu item. */
    id: number;
    /** Name of the menu item. */
    name: string;
    /** Category of the menu item. */
    category: string;
    /** Description of the menu item. */
    description: string;
    /** Price of the menu item, in USD. */
    price: number;
    /** Calories of the menu item. */
    calories: number;
    /** Amount of saturated fat, in grams. */
    saturatedFat: number;
    /** Amount of trans fat, in grams. */
    transFat: number;
    /** Amount of cholesterol, in milligrams. */
    cholesterol: number;
    /** Amount of sodium, in milligrams. */
    sodium: number;
    /** Amount of carbohydrates, in grams. */
    carbohydrates: number;
    /** Amount of fiber, in grams. */
    fiber: number;
    /** Amount of sugars, in grams. */
    sugars: number;
    /** Amount of protein, in grams. */
    protein: number;
    /** Amount of vitamin D, in %. */
    vitaminD: number;
    /** Amount of calcium, in %. */
    calcium: number;
    /** Amount of iron, in %. */
    iron: number;
    /** Amount of potassium, in %. */
    potassium: number;
  }

export type Notification = {
    /** Title of the notification. */
    title: string;
    /** Text of the notification. */
    text: string;
    /** Time of the report.
     * @type Milliseconds since epoch. */
    date: number;
    /** Whether the notification has been read or not. */
    read: boolean;
}

export type RestaurantInfo = {
    /** Name of the restaurant. */
    name: string;
    /** Address of the restaurant. */
    address: string;
    /** Phone number of the restaurant. */
    phone: string;
    /** Email of the restaurant. */
    email: string;
    /** Array of menu items. */
    menu: MenuItem[];
    /** ID of the restaurant. */
    id: string;
    /** Array of point offers. */
    offers: PointOffer[];
    /** Milliseconds of refund time.
     * @example 0 = no refund
     * @example -1 = no limit
     * @example 3600000 = 1 hour
     */
    refundLimit: number;
    /** Latitude and Longitude of the restaurant. */
    location: GeoPoint;
    /** Modal of the restaurant's display. */
    modal: Modal;
}

export type PointOffer = {
    /** Expiration date of the offer.
     * @type Milliseconds since epoch. */
    expires: number | null;
    /** Cost of the offer, in points. */
    cost: number;
    /** Description of the offer. */
    description: string;
    /** Title of the offer. */
    title: string;
    /** Redeemable code of the offer, if applicable. */
    code: string | null;
}

export type SubscriptionInfo = {
    /** If the user is currently subscribed. */
    currentlySubscribed: boolean;
    /** ID of the subscription in Stripe. */
    stripeSubscriptionId?: string;
    /** Time of the end of the subscription.
     * @type Milliseconds since epoch. */
    currentPeriodEnd?: number;
}

export type Marker = {
    /** Latitude and longitude of restaurant. */
    coordinate: any;
    /** Name of restaurant. */
    title: string;
    /** Address of restaurant. */
    snippet: string;
    /** Modal of the restaurant's display. */
    modal: Modal;
}

export type Modal = {
    /** Description of the restaurant. */
    description: string;
    /** Array of Firebase Storage image URLs. */
    images: string[];
    /** Array of day, open, and close times of the restaurant. Ex: {Monday, 8:00AM, 8:00PM} */
    openCloseTimes: {close: string, day: string, open: string}[];
    /** Array of reservation times of the restaurant. */
    reservationTimes: string[];
}

export type Rating = {
    /** Average rating of the user. */
    averageRating: number;
    /** Array of ratings. */
    ratings: PersonalizedRatings[];
}

export type PersonalizedRatings = {
    /** Time of the rating.
     * @type Milliseconds since epoch. */
    date: number;
    /** Description of the rating. */
    description: string;
    /** 0-5 star rating. */
    rating: number;
    /** ID of the restaurant. */
    restaurantId: string;
}

export const userStore = defineStore('userStore', () => {
    const userData = ref<User> ()

    const currentAllergies = ref<string[]> ([]);
    const billing = ref<BillingInfo> ({
        address: "",
        cardNumber: 0,
        expiration: new Date().getTime(),
        name: "",
        stripeId: "",
        phoneNumber: 0
    });
    const reservations = ref<Reservation[]> ([]);
    const language = ref("en");
    const name = ref("");
    const pastReservations = ref<Reservation[]> ([]);
    const rating = ref<Rating> ({
        averageRating: 5,
        ratings: []
    });
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

    const restaurant = ref<RestaurantInfo> ();
    const restaurantReservations = ref<Reservation[]> ();

    const restaurantMarkerData = ref<Marker[]>([]);
    const menu = ref<MenuItem[]>([]);

    return { userData, reservations, pastReservations, currentAllergies, notifications, nearbyRestaurants, currentVideo, billing, language, name, rating, smProfile, videoQueue, points, subscription, menu, profileImage, restaurantMarkerData, restaurant };
});
