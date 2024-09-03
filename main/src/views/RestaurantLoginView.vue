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
                        <input label="Email" placeholder="Business Email" type="email" required>
                        <input label="Phone Number" placeholder="Business Phone Number" type="tel" required>
                        <input label="Address" placeholder="Business Address" type="text" required>
                        <label for="file-upload" class="file">
                            <span>Proof of Address <ion-icon :icon="cloudUploadOutline"></ion-icon></span>
                            <ion-icon v-if="fileInput?.files?.length != 0" :icon="checkmark"></ion-icon>
                        </label>
                        <input ref="fileInput" id="file-upload" type="file" accept=".png,.jpg,.jpeg,.pdf" required>
                    </div>
                    <div class="signUpDiv">
                        <p class="errorMessage" v-if="showError">{{ errorMessage }}</p>
                        <ion-button @click="signUp">{{ $t("signUp") }}</ion-button>
                    </div>
                    <ion-button @click="login">Login</ion-button>
                </div>
            </div>
            <p class="tos">Please allow 1-2 business days for Dinersaur to reach out to you.</p>

        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">

import { ref, onMounted, watch } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonImg, IonInput, IonButton, IonIcon } from '@ionic/vue';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence  } from "firebase/auth";
import { RestaurantInfo, userStore } from '@/stores/userStore';
import router from '@/router';
import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore"; 
import { db } from '@/utils/firebase';
import { useI18n } from 'vue-i18n';
import { checkmark, chevronBack, cloudUploadOutline, notifications } from 'ionicons/icons';
import { fetchFromNuxt } from '@/utils/functions';

const { locale } = useI18n();

const fileInput = ref<HTMLInputElement> ();
watch(() => fileInput.value?.files, () => console.log(fileInput.value?.files))

const email = ref("");
const password = ref("");
const phone = ref("");
const address = ref("");

const access = ref(false);
watch(() => access.value, () => router.push("/restaurant/home"));

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
    console.log(fileInput.value?.files)
    /*try {
        await setDoc(doc(db, "restaurantVerification"), {
            email: email.value,
            phone: phone.value,
            address: address.value,

        });

    } catch (error) {
        if (error instanceof Error) getErrorMessage(error.message);
        showError.value = true;
    }*/
}

async function login () {
    const auth = getAuth();

    try {
        await setPersistence(auth, browserLocalPersistence);
        const userCredential = await signInWithEmailAndPassword(auth, "rest@gmail.com", "password");
        const user = userCredential.user;
        userStore().userData = user;
        localStorage.setItem("uid", user.uid);
        
        const store = userStore();
        const docData = await getDoc(doc(db, "restaurants", user.uid));
        const userData = docData.data();
        access.value = true;
        if (!userData) return;

        store.restaurant = {
            name: userData.name,
            address: userData.address,
            email: userData.email,
            id: userData.id,
            location: userData.location,
            menu: userData.menu,
            offers: userData.offers,
            phone: userData.phone,
            refundLimit: userData.refundLimit,
            modal: userData.modal,
            rating: userData.rating,
            layout: userData.layout
        };
        store.restaurantReservations.incoming = userData.reservations.incoming;
        store.restaurantReservations.past = userData.reservations.past;
        
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

.inputs {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.signUpDiv{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    flex-direction: row;
    margin-top: 3.5em;
    position: relative;

    .errorMessage {
        color: var(--ion-color-danger);
        margin: 0;
        position: absolute;
        top: -2.5em;
        text-align: center;
    }

    ion-button {
        width: 95%;
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

input[type="file"] {
    display: none;
}

.file {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-style: solid;
    border-width: 1px;
    border-radius: 5px;
    border-color: var(--ion-color-primary);
    margin-top: 0.5em;
    padding: 5px;
    background-color: white;
    width: 90vw;
    height: 2.5em;

    span {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5em;
    }

    ion-icon {
        width: 2em;
        height: 2em;
    }
}

</style>