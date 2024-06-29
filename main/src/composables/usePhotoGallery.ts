
import { ref, onMounted, watch } from 'vue';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

export type UserPhoto = {
    filepath: string;
    webviewPath?: string;
}

export function usePhotoGallery () {
    const photos = ref<UserPhoto[]> ([]);

    async function takePhoto () {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100,
      });
      const fileName = Date.now() + ".jpeg";
      const savedFileImage: UserPhoto = {
        filepath: fileName,
        webviewPath: photo.webPath
      };

      photos.value.push(savedFileImage);
    };
  
    return { photos, takePhoto };
};
