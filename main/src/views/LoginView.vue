<template>
    <ion-page>
        <ion-content :fullscreen="true">
            <div class="page">
                <div class="content">
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
                        <input label="Email" placeholder="Email" v-model="email" required>
                        <input label="Password" placeholder="Password" v-model="password" type="password" required>
                        <p class="errorMessage" v-if="showError">{{ errorMessage }}</p>
                        <ion-button class="signup" @click="signUp">Sign Up</ion-button>
                        <ion-button class="signup" @click="login">Login</ion-button>
                    </div>
                </div>
            </div>
            <p class="tos">By signing up with Dinersaur, you accept out Terms of Service and Privacy Policy.</p>

        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">

import { ref, onMounted, watch } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonImg, IonInput, IonButton } from '@ionic/vue';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider  } from "firebase/auth";
import { userStore } from '@/stores/userStore';

const email = ref("");
const password = ref("");

const access = ref(false);
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
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;
        userStore().userData = user;

    } catch (error: any) {
        getErrorMessage(error.message);
        showError.value = true;
    }
}

async function login () {
    const auth = getAuth();

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;
        userStore().userData = user;

    } catch (error: any) {
        console.log(error.message)
        getErrorMessage(error.message);
        showError.value = true;
    }
}

async function signinWIthGoogle () {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        userStore().userData = user;

    } catch (error: any) {
        console.log(error.message)
        getErrorMessage(error.message);
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
        margin-top: 0.75em;
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