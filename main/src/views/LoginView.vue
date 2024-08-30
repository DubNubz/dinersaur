<template>
    <ion-page>
        <ion-content :fullscreen="true">
            <div class="page">
                <div class="content">
                    <button class="backButton" @click="router.push('/chooseAccount')">
                        <ion-icon :icon="chevronBack"></ion-icon>
                    </button>
                    <ion-img class="dinersaur" src="/icons/dinersaurWithShadow.svg" alt="Dinersaur"></ion-img>
                    <div class="inputs">
                        <div class="buttons">
                            <ion-button class="providerButton" shape="round" @click="signinWIthGoogle">
                                <img src="/icons/google.svg" alt="Sign in with Google">
                            </ion-button>
                            <ion-button class="providerButton" shape="round">
                                <img src="/icons/apple.svg" alt="Sign in with Apple">
                            </ion-button>
                        </div>
                        <input label="Email" :placeholder="$t('email')" v-model="email" required>
                        <input label="Password" :placeholder="$t('password')" v-model="password" type="password" required>
                        <p class="errorMessage" v-if="showError">{{ errorMessage }}</p>
                        <div class="signUpDiv">
                            <ion-button class="signup" @click="signUp">{{ $t("signUp") }}</ion-button>
                            <ion-button class="signup" @click="login">{{ $t("login") }}</ion-button>
                        </div>
                    </div>
                </div>
            </div>
            <p class="tos">{{ $t("disclaimer") }}.</p>

        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">

import { ref, onMounted, watch } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonImg, IonInput, IonButton, IonIcon } from '@ionic/vue';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence  } from "firebase/auth";
import { userStore } from '@/stores/userStore';
import router from '@/router';
import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore"; 
import { db } from '@/utils/firebase';
import { useI18n } from 'vue-i18n';
import { chevronBack, notifications } from 'ionicons/icons';
import { fetchFromNuxt } from '@/utils/functions';

const { locale } = useI18n();

const email = ref("");
const password = ref("");

const access = ref(false);
watch(() => access.value, () => router.push("/pages/home"));

const showError = ref(false);
const errorMessage = ref<"The email or password you entered is incorrect." | "The email you entered is already in use." |
"Your password should be at least 6 characters." | "Something went wrong. Try again later." | "Provider signin cancelled." |
"Please enter a valid password." | "Please enter a valid email."> ();

function getErrorMessage (message: string) {
    switch (message) {
        case "Firebase: Error (auth/missing-password)":
            errorMessage.value = "Please enter a valid password.";
            break;
        case "Firebase: Error (auth/invalid-email).":
            errorMessage.value = "Please enter a valid email.";
            break;
        case "Firebase: Error (auth/invalid-credential).":
            errorMessage.value = "The email or password you entered is incorrect.";
            break;
        case "Firebase: Password should be at least 6 characters (auth/weak-password).":
            errorMessage.value = "Your password should be at least 6 characters.";
            break;
        case "Firebase: Error (auth/email-already-in-use).":
            errorMessage.value = "The email you entered is already in use.";
            break;
        case "Firebase: Error (auth/popup-closed-by-user).":
            errorMessage.value = "Provider signin cancelled.";
            break;
        default:
            errorMessage.value = "Something went wrong. Try again later.";
    }
}

async function signUp () {
    const auth = getAuth();

    try {
        await setPersistence(auth, browserLocalPersistence);
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;
        userStore().userData = user;
        localStorage.setItem("uid", user.uid);
        localStorage.setItem("lang", "en");
        localStorage.setItem("name", user.displayName ?? "");
        access.value = true;

        const { success, message, customer } = await fetchFromNuxt("/api/create-stripe-customer", JSON.stringify({ uid: user.uid }));
        if (!success) throw new Error(message);

        await setDoc(doc(db, "users", user.uid), {
            name: "",
            allergies: [],
            language: "en",
            rating: 5,
            currentReservations: [],
            pastReservations: [],
            billing: {
                cardNumber: 0,
                name: "",
                expiration: new Date().getTime(),
                address: "",
                stripeId: customer.id
            },
            smProfile: {
                bookmarkedVideos: [],
                likedVideos: [],
                followers: [],
                following: [],
                posts: []
            },
            notifications: [{
                title: "Welcome to Dinersaur!",
                text: "Welcome to Dinersaur. Thanks for signing up!",
                date: new Date().getTime(),
                read: false
            }],
            subscription: {
                currentlySubscribed: false
            },
            points: 0
        });

        userStore().notifications.push({
            title: "Welcome to Dinersaur!",
            text: "Welcome to Dinersaur. Thanks for signing up!",
            date: new Date().getTime(),
            read: false
        });

    } catch (error) {
        if (error instanceof Error) getErrorMessage(error.message);
        showError.value = true;
    }
}

async function login () {
    const auth = getAuth();

    try {
        await setPersistence(auth, browserLocalPersistence);
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;
        userStore().userData = user;
        localStorage.setItem("uid", user.uid);
        
        const store = userStore();
        const docData = await getDoc(doc(db, "users", user.uid));
        const userData = docData.data();
        access.value = true;
        if (!userData) return;

        store.currentAllergies = userData.allergies;
        store.billing = userData.billing;
        store.reservations = userData.currentReservations;
        store.name = userData.name;
        store.pastReservations = userData.pastReservations;
        store.rating = userData.rating;
        store.smProfile = userData.smProfile;
        store.notifications = userData.notifications;
        store.points = userData.points;
        store.subscription = userData.subscription;

        if (store.language != "en") await updateDoc(doc(db, "users", user.uid), { language: store.language })
        else {
            store.language = userData.language;
            locale.value = userData.language;
        }

        localStorage.setItem("lang", store.language);
        localStorage.setItem("name", store.name);
        
    } catch (error) {
        if (error instanceof Error) getErrorMessage(error.message);
        showError.value = true;
    }
}

async function signinWIthGoogle () {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
        await setPersistence(auth, browserLocalPersistence);
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        userStore().userData = user;
        localStorage.setItem("uid", user.uid);
        
        const store = userStore();
        const docData = await getDoc(doc(db, "users", user.uid));
        const userData = docData.data();
        access.value = true;
        
        if (!userData) {
            const { success, message, customer } = await fetchFromNuxt("/create-stripe-customer", JSON.stringify({ uid: user.uid }));
            if (!success) throw new Error(message);

            await setDoc(doc(db, "users", user.uid), {
                name: "",
                allergies: [],
                language: "en",
                rating: 5,
                currentReservations: [],
                pastReservations: [],
                billing: {
                    cardNumber: 0,
                    name: "",
                    expiration: new Date().getTime(),
                    address: "",
                    stripeId: customer.id
                },
                smProfile: {
                    bookmarkedVideos: [],
                    likedVideos: [],
                    followers: [],
                    following: [],
                    posts: []
                },
                notifications: [{
                    title: "Welcome to Dinersaur!",
                    text: "Welcome to Dinersaur. Thanks for signing up!",
                    date: new Date().getTime(),
                    read: false
                }],
                subscribed: false,
                points: 0
            });

            userStore().notifications.push({
                title: "Welcome to Dinersaur!",
                text: "Welcome to Dinersaur. Thanks for signing up!",
                date: new Date().getTime(),
                read: false
            });

            return;
        }

        if (userData.name == "" && user.displayName) {
            userData.name = user.displayName;
            await updateDoc(doc(db, "users", user.uid), { name: user.displayName });
        }

        store.currentAllergies = userData.allergies;
        store.billing = userData.billing;
        store.reservations = userData.currentReservations;
        store.name = userData.name;
        store.pastReservations = userData.pastReservations;
        store.rating = userData.rating;
        store.smProfile = userData.smProfile;
        store.notifications = userData.notifications;
        store.points = userData.points;
        store.subscription = userData.subscription;

        if (store.language != "en") await updateDoc(doc(db, "users", user.uid), { language: store.language })
        else {
            store.language = userData.language;
            locale.value = userData.language;
        }

        localStorage.setItem("lang", store.language);
        localStorage.setItem("name", store.name);

        
    } catch (error) {
        if (error instanceof Error) getErrorMessage(error.message);
        showError.value = true;
    }
}

</script>

<style lang="scss" scoped>

.page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
}

.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 6.5em;
}

.backButton {
    position: absolute;
    top: 0;
    left: 0;
    margin: 1em;
    background-color: transparent;

    ion-icon {
        width: 3em;
        height: 3em;
    }
}

.dinersaur {
    width: 80vw;
    height: 80vw;
}

.buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2em;
    width: 95vw;
}

ion-button.providerButton {
    --background: rgba(255, 215, 114, 0.5);
    width: 30%;
    height: 3.5em;
}

.providerButton {
    img {
        width: 2.5em;
        height: 2.5em;
    }
}

.inputs {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .errorMessage {
        color: var(--ion-color-danger);
        margin: 0;
        margin-top: 0.75em;
    }

    .signup {
        width: 150px;
        margin-top: 0.75em;
        margin-left: 1em;
        margin-right: 1em;
    }

    .signUpDiv{
        flex-direction: row;
        }
}

.tos {
    color: var(--ion-color-tertiary);
    width: 100%;
    padding-left: 10%;
    padding-right: 10%;
    text-align: center;
    margin-top: auto;
    position: fixed;
    bottom: 1em;
}

input {
    border-style: solid;
    border-width: 1px;
    border-radius: 5px;
    border-color: var(--ion-color-primary);
    width: 90vw;
    height: 2.5em;
    margin-top: 0.5em;
    padding: 5px;
}

</style>