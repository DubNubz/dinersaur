<template>
    <ion-page>
        <ion-content :fullscreen="true">
            <div class="page">
                <div class="content">
                    <ion-img class="dinersaur" src="/icons/dinersaurWithShadow.svg" alt="Dinersaur"></ion-img>
                    <div class="inputs">
                        <div class="buttons">
                            <ion-button class="providerButton" shape="round">
                                <img src="/icons/google.svg" alt="Sign in with Google">
                            </ion-button>
                            <ion-button class="providerButton" shape="round">
                                <img src="/icons/apple.svg" alt="Sign in with Apple">
                            </ion-button>
                        </div>
                        <input label="Email" placeholder="Email" v-model="email" required>
                        <input label="Password" placeholder="Password" v-model="password" type="password" required>
                        <p class="errorMessage" v-if="wrongCredentials">Incorrect Email or Password.</p>
                        <ion-button class="signup" @click="signUp">Sign Up</ion-button>
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
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { userStore } from '@/stores/userStore';

const email = ref("");
const password = ref("");

const access = ref(false);
const wrongCredentials = ref(false);

async function signUp () {
    const auth = getAuth();
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;
        userStore().userData = user;

    } catch (error) {
        wrongCredentials.value = true;
        throw new Error();
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
    --background: var(--ion-color-secondary);
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