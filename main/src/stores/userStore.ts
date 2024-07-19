
import { ref, onMounted, watch } from 'vue';
import { defineStore } from 'pinia';
import type { User } from 'firebase/auth';

export type Reservation = {
    title: string;
    content: string;
    id: string;
}

export type Video = {
    author: string;
    avatar: string;
    url: string;
    likes: number;
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


export const userStore = defineStore('userStore', () => {
    const userData = ref<User> ();
    const reservations = ref<Reservation[]> ([]);
    const pastReservations = ref<Reservation[]> ([]);
    const currentAllergies = ref<string[]> ([]);
    const currentVideo = ref<Video> ();

    return { userData, reservations, pastReservations, currentAllergies, currentVideo };
});
