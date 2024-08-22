<template>
    <div class="ad">
        <div class="title">
            <div class="titleText">
                <h1><strong>Steakosaurus</strong></h1>
                <p v-if="type == 'money'"><strong style="color: var(--ion-color-tertiary-shade);">$6.99/mo</strong> <span>(+700 pts)</span></p>
                <p v-if="type == 'money'"><span style="color: red; text-decoration: line-through;">$10.00/mo</span></p>
                <p v-else><strong style="color: var(--ion-color-tertiary-shade);">{{ Number(10000).toLocaleString() }} pts</strong> <span>(1 week)</span></p>
            </div>
            <img class="steakosaurus" src="/icons/steakosaurusLeft.svg">
        </div>

        <div class="cards">
            <div class="cardContainer" v-for="card in cards">
                <Transition name="cardAnimation">
                    <div class="cardBackground" v-if="card.show">
                        <div class="card">
                            <div class="header">
                                <img :src="card.img">
                                <h4>{{ card.title }}</h4>
                            </div>
                            <p>{{ card.description }}</p>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>

        <ion-button v-if="type == 'money'">Claim Offer</ion-button>
        <ion-button @click="subscribeWithPoints" v-else>Purchase</ion-button>
    </div>
</template>

<script setup lang="ts">

import { userStore } from '@/stores/userStore';
import { delay, fetchFromNuxt } from '@/utils/functions';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardTitle, 
  IonButton, IonButtons, IonIcon, IonList, IonCardSubtitle, onIonViewDidEnter, IonModal, IonBadge,
  onIonViewWillEnter} from '@ionic/vue';
import { cashOutline } from 'ionicons/icons';
import { onMounted, ref } from 'vue';

type Props = {
    type: "money" | "points";
}

const props = defineProps<Props> ();
const emit = defineEmits(["processing", "success", "failed"]);

const cards = ref([{
    img: "/icons/drink.svg",
    title: "Free Beverages",
    description: "Get a free drink of your choice on every reservation at participating stores!",
    show: false
}, {
    img: "/icons/increasePoints.svg",
    title: "50% More Points",
    description: "More points, more fun! Gain 50% more rewards points for every purchase.",
    show: false
}, {
    img: "/icons/pricetag.svg",
    title: "$0 Reservation Fee",
    description: "No caveats, no restrictions. Never pay for a reservation again!",
    show: false
}, {
    img: "/icons/noAdvertisements.svg",
    title: "No Advertisements",
    description: "Advertisements begone! Remove all ads from the Dinersaur app.",
    show: false
}, {
    img: "/icons/shoppingBag.svg",
    title: "Exclusive Deals",
    description: "Get Steakosaurus-exclusive deals and discounts from participating stores!",
    show: false
}]);

onMounted(async () => {
    for (let i in cards.value) {
        if (i == "0") await delay(250);
        else if (i == "1") await delay(200);
        else await delay(600 / Number(i));
        cards.value[i].show = true;
    }
});

async function subscribeWithPoints () {
    emit("processing");
    const { success, message } = await fetchFromNuxt("/api/points-subscription", JSON.stringify({ uid: userStore().userData?.uid }));
    if (success) {
        userStore().subscribed = true;
        userStore().points = userStore().points - 10000;
        await delay(3000);
        emit("success");
    } else {
        await delay(3000);
        emit("failed", `Error: ${message} Your points were not deducted.`);
    }
}

</script>

<style lang="scss" scoped>

.ad {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    min-height: 100%;
    height: 50em;
}

.title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5em;
    width: 95vw;
}

.titleText {
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    h1, p {
        margin: 0;
    }

    h1 {
        color: var(--ion-color-primary-shade);
    }
}

.steakosaurus {
    width: 50%;
}

.cards {
    width: 92.5vw;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 0.5em;
    margin-top: 1em;
}

.cardBackground {
    background: linear-gradient(to top right, var(--ion-color-primary), var(--ion-color-secondary) 85%);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 1.2em;
    width: 100%;
    padding-top: 0.25em;
    padding-bottom: 0.25em;
}

.cardAnimation-enter-active, .cardAnimation-leave-active {
    transition: all 0.75s ease-in-out;
}

.cardAnimation-enter-from, .cardAnimation-leave-to {
    opacity: 0;
    transform: translateY(15vh);
}

.card {
    background-color: var(--ion-color-light-tint);
    border-radius: 1em;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 0.25em;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    width: 97.5%;

    .header {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5em;

        h4 {
            margin: 0;
        }

        img {
            width: 2.25em;
        }
    }

    p {
        margin: 0;
        padding-left: 1.5em;
        padding-right: 1.5em;
        text-align: center;
    }
}

ion-button {
    position: fixed;
    bottom: 1vh;
    width: 92.5%;
}

</style>