<template>
    <ion-page>
        <Header @updateSearchResults="updateSearchResults" />
        <ion-content>
            <GoogleMap api-key="AIzaSyCMXfre823EDS2YC_BfExnrJWnQmTObOFI" :options='mapOptions' :center="test" :zoom="15" class="googleMap" >
                <Marker :options="{ position: test }" />
            </GoogleMap>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
    import { IonPage, IonHeader, IonFab, IonFabButton, IonIcon, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonImg } from '@ionic/vue';
    import { defineComponent, ref, onMounted } from 'vue';
    import Header from '@/components/Header.vue';
    import { GoogleMap, Marker } from 'vue3-google-map';

    const mapOptions = ref({
        disableDefaultUI: true, 
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
    });

    const test = { lat: 40.689247, lng: -74.044502 };

    const center = ref<{ lat: number, lng: number } | null>(null);

    function getCurrentLocation() {
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition((position) => {
                center.value = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
            });
        }
    }

    onMounted(() => {
        getCurrentLocation();
    });

    function updateSearchResults(results: any[]) {
        if (results.length > 0) {
            getPlaceDetails(results[0].place_id);
        }
    }

    function getPlaceDetails(placeID: string) {
    // if (!placesService) {
    //     placesService = new google.maps.places.PlacesService(document.createElement('div'));
    // }
    // placesService.getDetails({ placeId }, (place, status) => {
    //     if (status === google.maps.places.PlacesServiceStatus.OK) {
    //         center.value = {
    //             lat: place.geometry.location.lat(),
    //             lng: place.geometry.location.lng()
    //         };
    //     }
    // });
    }
</script>

<style scoped>
    .googleMap{
        width: 100vw; 
        height: 100vh;
    }
</style>