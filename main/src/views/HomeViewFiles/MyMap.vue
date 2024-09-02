<template>
  <div>
    <capacitor-google-map ref="mapRef" class="googleMap"></capacitor-google-map>
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick, ref, watch } from "vue";
import { GoogleMap, Marker as GoogleMapMarker } from "@capacitor/google-maps";
import { Geolocation } from "@capacitor/geolocation";

// PROPS

const props = defineProps<{
    markerData: { coordinate: any; title: string; snippet: string }[];
}>();

// EVENTS
const emits = defineEmits<{
    (event: "onMarkerClicked", marker: any): void;
}>();

const mapRef = ref<HTMLElement>();
let newMap: GoogleMap;
let userMarker: GoogleMapMarker | null = null;

onMounted(async () => {
  await nextTick();
  await createMap();
  await createMarker();
  await clickMarker();
  const { latitude, longitude } = await toggleUserLocation();
  
  // Move the camera to the new position
  await newMap.setCamera({
    coordinate: {
      lat: latitude,
      lng: longitude,
    },
    zoom: 15,
  });
});

watch(
  () => props.markerData,
  () => {
    createMarker();
    clickMarker();
  }
);

async function createMap() {
  if (!mapRef.value) return;

  newMap = await GoogleMap.create({
    id: "my-cool-map",
    element: mapRef.value,
    apiKey: import.meta.env.VITE_MAPS_API_KEY as string,
    config: {
      center: {
        lat: 40.610199,
        lng: -74.005980,
      },
      zoom: 15,
      minZoom: 13,
      maxZoom: 17,
      disableDefaultUI: true,
      styles: [
        {
          featureType: "poi",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "administrative",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "landscape",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "water",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
            elementType: "geometry",
            stylers: [{ color: "#eaeaf2" }], // light purple
        },
        {
            elementType: "labels.text.fill",
            stylers: [{ color: "#523735" }], // dark brown
        },
        {
            elementType: "labels.text.stroke",
            stylers: [{ color: "#f5f1e6" }], // off-white
        },
        {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#f5f1e6" }], // light off-white
        },
        {
            featureType: "road.arterial",
            elementType: "geometry",
            stylers: [{ color: "#e0d4d3" }], // light purple
        },
        {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#f8c967" }], // yellow
        },
        {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#e9bc62" }], // darker yellow
        },
        {
            featureType: "road.highway.controlled_access",
            elementType: "geometry",
            stylers: [{ color: "#e98d58" }], // orange-yellow
        },
        {
            featureType: "road.highway.controlled_access",
            elementType: "geometry.stroke",
            stylers: [{ color: "#db8555" }], // darker orange-yellow
        },
        {
            featureType: "road.local",
            elementType: "labels.text.fill",
            stylers: [{ color: "#806b63" }], // brown
        },
        {
            featureType: "water",
            elementType: "geometry.fill",
            stylers: [{ color: "#a1c4fd" }], // light blue
        },    
      ],
    },
  });
}

async function createMarker() {
  await newMap.addMarkers(
    props.markerData.map(({ coordinate, title, snippet }) => ({
      coordinate,
      title,
      snippet,
    }))
  );
}

async function clickMarker() {
    newMap.setOnMarkerClickListener((event) => {
        emits("onMarkerClicked", event);
    });
}

async function toggleUserLocation() {
  let userMarkerId: string | null = null;

  const watchId = await Geolocation.watchPosition(
    { enableHighAccuracy: true },
    async (position, err) => {
      if (err) {
        console.error("Error getting location: ", err);
        return;
      }

      if (position) {
        const { latitude, longitude } = position.coords;

        // Remove the previous marker if it exists
        if (userMarkerId) {
          await newMap.removeMarker(userMarkerId);
        }

        // Add the new marker with the updated position
        userMarkerId = await newMap.addMarker({
          coordinate: {
            lat: latitude,
            lng: longitude,
          },
          title: "Your Location",
          snippet: "You are here",
        });

        return { latitude, longitude };
      }
    }
  );
  const position = await Geolocation.getCurrentPosition();
  return { latitude: position.coords.latitude, longitude: position.coords.longitude };
}

</script>

<style lang="scss">

.googleMap{
    display: inline-block; 
    width: 100vw; 
    height: 100vh;
    overflow: hidden;
}

</style>