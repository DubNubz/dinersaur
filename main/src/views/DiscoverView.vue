<template>
  <ion-page ref="page" :class="{ hideBottomVideo: scrollOnCooldown }">
    <ion-content ref="content" @ion-scroll-start="handleScroll" :scrollEvents="true">
      <div aria-hidden="true" class="fullscreenCover">
        <ion-icon :icon="heart" aria-hidden="true" class="fullscreenIcon" :class="{ hideIcon: !showLikedImg }"></ion-icon>
      </div>
      <div aria-hidden="true" class="fullscreenCover">
        <ion-icon ref="pauseIconRef" :icon="pauseIcon == 'pause' ? pauseCircleOutline : playCircleOutline" aria-hidden="true" style="color: var(--ion-color-light)" :class="{ hideIcon: !showPausedImg }"></ion-icon>
      </div>
      <ion-toast :icon="toastIcon" position="top" :is-open="showBookmarkedImg" :message="toastMessage" :duration="1500" @didDismiss="showBookmarkedImg = false"></ion-toast>

      
      <video v-if="currentVideo" ref="videoRef" @ended="scrollVideo" width="1080" height="1920" class="video" autoplay disablepictureinpicture
      disableremoteplayback @click="pauseVideo">
        <source :src="currentVideo.url" type="video/mp4" />
      </video>

      <video v-if="videoQueue[0]" id="video2" width="1080" height="1920" class="video" disablepictureinpicture disableremoteplayback>
        <source :src="videoQueue[0].url" type="video/mp4" />
      </video>
      
      <!--<input ref="fileInput" type="file"></input>-->
      <!--<button @click="createVideo">uploa</button>-->
      
      <ion-fab vertical="bottom" horizontal="end" slot="fixed" style="margin-bottom: 2.5em;">
        <ion-fab-button @click="activateBookmark">
          <ion-icon :icon="bookmarked ? bookmarks : bookmarksOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed" style="margin-bottom: 7.5em;">
        <ion-fab-button @click="openComments = true">
          <ion-icon :icon="chatboxEllipses"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed" style="margin-bottom: 12.5em;">
        <ion-fab-button @click="activateLike">
          <ion-icon :icon="liked ? heart : heartOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <ion-modal ref="commentsModal" :is-open="openComments" :presenting-element="page">
        <ion-header>
          <ion-toolbar>
            <ion-title>Comments</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="openComments = false">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content>
          <ion-list>
            <ion-item v-for="comment in loadedComments">
              <ion-avatar aria-hidden="true" slot="start">
                <img :src="comment.avatar" alt="">
              </ion-avatar>
              <ion-label>
                <h2>{{ comment.author }}</h2>
                <p>{{ comment.text }}</p>
                <div class="commentVotingDiv">
                  <button @click="comment.likes++">
                    <ion-icon :icon="thumbsUpOutline"></ion-icon>
                  </button>
                  <p>{{ concatBigNumber(comment.likes - comment.dislikes) }}</p>
                  <button>
                    <ion-icon :icon="thumbsDownOutline"></ion-icon>
                  </button>
                  <button @click="openCommentReplies(comment)" v-if="comment.replies.length > 0">Replies</button>
                </div>
              </ion-label>
            </ion-item>
          </ion-list>
          <ion-infinite-scroll @ionInfinite="loadNewComments">
            <ion-infinite-scroll-content></ion-infinite-scroll-content>
          </ion-infinite-scroll>
        </ion-content>
      </ion-modal>

      <ion-modal :is-open="openReplies" :presenting-element="commentsModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>Replies</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="openReplies = false">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content>
          <ion-list>
            <ion-item v-if="currentComment">
              <ion-avatar aria-hidden="true" slot="start">
                <img :src="currentComment.avatar" alt="">
              </ion-avatar>
              <ion-label>
                <h2>{{ currentComment.author }}</h2>
                <p>{{ currentComment.text }}</p>
                <div class="commentVotingDiv">
                  <button>
                    <ion-icon :icon="thumbsUpOutline"></ion-icon>
                  </button>
                  <p>{{ concatBigNumber(currentComment.likes - currentComment.dislikes) }}</p>
                  <button>
                    <ion-icon :icon="thumbsDownOutline"></ion-icon>
                  </button>
                </div>
              </ion-label>
            </ion-item>

            <ion-item v-if="currentComment" v-for="reply in loadedReplies">
              <ion-avatar aria-hidden="true" slot="start">
                <img :src="reply.avatar" alt="">
              </ion-avatar>
              <ion-label>
                <h2>{{ reply.author }}</h2>
                <p>{{ reply.text }}</p>
                <div class="commentVotingDiv">
                  <button>
                    <ion-icon :icon="thumbsUpOutline"></ion-icon>
                  </button>
                  <p>{{ concatBigNumber(reply.likes - reply.dislikes) }}</p>
                  <button>
                    <ion-icon :icon="thumbsDownOutline"></ion-icon>
                  </button>
                </div>
              </ion-label>
            </ion-item>
          </ion-list>
          <ion-infinite-scroll @ionInfinite="loadNewReplies">
            <ion-infinite-scroll-content></ion-infinite-scroll-content>
          </ion-infinite-scroll>
        </ion-content>
      </ion-modal>

    </ion-content>

  </ion-page>
</template>

<script setup lang="ts">

import { ref, onMounted, watch, onUnmounted } from 'vue';
import { IonPage, IonHeader, IonFab, IonFabButton, IonIcon, IonToolbar, IonTitle, IonContent, onIonViewDidLeave, onIonViewDidEnter, IonButton,
  IonButtons, IonModal, IonToast, IonList, IonItem, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent, 
  InfiniteScrollCustomEvent, IonAvatar, IonInput, 
  onIonViewWillEnter,
  createAnimation} from '@ionic/vue';
import { heart, chatboxEllipses, bookmarks, heartOutline, bookmarksOutline, thumbsUpOutline, thumbsDownOutline, thumbsUp, thumbsDown, pauseCircleOutline, playCircleOutline } from 'ionicons/icons';
import { userStore, Video, VideoCommentReply, type VideoComment } from '@/stores/userStore';
import { compareObjectsSingle, concatBigNumber, delay, getRandomIntInclusive, getRandomItemFromArray, getVideo, loopUntil } from '@/utils/functions';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, setDoc, startAfter } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { getStorage, ref as firebaseRef, uploadBytes, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import router from '@/router';

const videoRef = ref<HTMLVideoElement> ();
const page = ref();
const content = ref();
const commentsModal = ref();
const fileInput = ref();
const pauseIconRef = ref();

const liked = ref(false);
const showLikedImg = ref(false);
const showBookmarkedImg = ref(false);
const videoIsPaused = ref(false);
const showPausedImg = ref(false);
const bookmarked = ref(false);
const openComments = ref(false);
const openReplies = ref(false);
const scrollOnCooldown = ref(false);
const hideBottomVideo = ref(false);

const currentVideo = ref<Video> ();
const videoQueue = ref<Video[]> ([]);
const loadedComments = ref<VideoComment[]> ([]);
const loadedReplies = ref<VideoCommentReply[]> ([]);
const currentComment = ref<VideoComment> ();
const toastIcon = ref<string> ();
const toastMessage = ref<'Added video to your bookmarks!' | 'Removed video from your bookmarks'> ();
const pauseIcon = ref<"pause" | "play"> ("pause");

const commentLoader = getComments();
const replyLoader = getReplies();

// when next video is played or if page/app is left:
//   if liked = true, send to firebase

onIonViewDidEnter(async () => {
  currentVideo.value = userStore().currentVideo ?? await getVideo();
  videoQueue.value = userStore().videoQueue;
  if (videoQueue.value.length < 5) {
    for (let i = videoQueue.value.length; i < 5; i++) pushVideoToQueue();
  }

  let tries = 10;
  let loaded = false;
  while (tries < 10 || !loaded) {
    if (videoRef.value) {
      loaded = true;
      videoRef.value?.play();
    } else {
      await delay(5);
      tries++;
    }
  }

  commentLoader.next();
  videoIsPaused.value = false;
});

onIonViewDidLeave(() => {
  videoRef.value?.pause();
});

function handleScroll () {
  if (scrollOnCooldown.value) {
    content.value.$el.scrollToTop(0);
    return;
  }
  scrollVideo();
}

async function pushVideoToQueue () {
  videoQueue.value.push(await getVideo());
}

async function scrollVideo () {
  if (!videoRef.value) return;
  scrollOnCooldown.value = true;

  await content.value.$el.scrollToBottom(300);
  hideBottomVideo.value = true;
  currentVideo.value = undefined;
  hideBottomVideo.value = false;
  currentVideo.value = await loopUntil(!currentComment.value, videoQueue.value[0]);
  await delay(15);
  content.value.$el.scrollToTop(0);
  try {
    videoRef.value.currentTime = 0;
  } catch (error) {
    videoRef.value.currentTime = 0;
  }
  videoIsPaused.value = false;
  
  const copyOfQueue = [...videoQueue.value];
  videoQueue.value.length = 0;
  videoQueue.value = await loopUntil(videoQueue.value.length == 0, copyOfQueue.slice(1));
  if (videoQueue.value.length < 4) {
    for (let i = videoQueue.value.length; i < 4; i++) pushVideoToQueue();
  }
  scrollOnCooldown.value = false;
  pushVideoToQueue();
}

async function createVideo () {
  const base64Characters = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b',
    'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3',
    '4', '5', '6', '7', '8', '9', '-', '_'];
    
    let videoID = "";
    for (let i = 0; i < 10; i++) {
      videoID += getRandomItemFromArray(base64Characters);
    }
    
    const storage = getStorage();
    const file = fileInput.value.files[0];
    const video = firebaseRef(storage, "videos/" + videoID);

  try {
    const user = userStore().userData;
    if (!user) throw Error;

    const uploadTask = uploadBytesResumable(video, file);
    uploadTask.on('state_changed', () => {}, () => {}, async () => {
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      console.log(downloadURL)
    
      await setDoc(doc(db, "videos", videoID), {
        id: videoID,
        author: user.uid,
        views: 0,
        likes: 0,
        comments: [],
        url: downloadURL,
        created: new Date()
      });
    })
  } catch (error) {
    console.error(error)
  }
}

function* getComments () {
  let i = 0;
  while (true) {
    if (i % 10) yield;
    if (!currentVideo.value?.comments[i]) {
      yield;
      continue;
    }

    loadedComments.value.push(currentVideo.value.comments[i]);
    i++;
  }
}

let replyIndex = 0;
function* getReplies () {
  while (true) {
    if (replyIndex % 10) yield;
    if (!currentComment.value?.replies[replyIndex]) {
      yield;
      continue;
    }

    loadedReplies.value.push(currentComment.value?.replies[replyIndex]);
    replyIndex++;
  }
}

function openCommentReplies (comment: VideoComment) {
  openReplies.value = true;
  if (!compareObjectsSingle(currentComment.value, comment)) {
    currentComment.value = comment;
    replyIndex = 0;
  }
  replyLoader.next();
}

function loadNewReplies (event: InfiniteScrollCustomEvent) {
  replyLoader.next();
  setTimeout(() => event.target.complete(), 500);
}

function loadNewComments (event: InfiniteScrollCustomEvent) {
  commentLoader.next();
  setTimeout(() => event.target.complete(), 500);
}

async function pauseVideo () {
  videoIsPaused.value = !videoIsPaused.value;

  if (showPausedImg.value) return;

  if (videoIsPaused.value) {
    pauseIcon.value = "pause";
    videoRef.value?.pause();
  } else {
    pauseIcon.value = "play";
    videoRef.value?.play();
  }

  showPausedImg.value = true;
  const animation = createAnimation().addElement(pauseIconRef.value.$el).duration(500).iterations(1).keyframes([
  { offset: 0, width: "0", height: "0", opacity: "100%" }, { offset: 0.6, width: "20vw", height: "20vw" }, { offset: 1, width: "45vw", height: "45vw", opacity: '0%' }]);
  await animation.play();
  animation.stop();
  showPausedImg.value = false;
}

async function activateBookmark () {
  bookmarked.value = !bookmarked.value;

  if (showBookmarkedImg.value) return;

  toastMessage.value = bookmarked.value ? 'Added video to your bookmarks!' : 'Removed video from your bookmarks';
  toastIcon.value = bookmarked.value ? bookmarks : bookmarksOutline;
  showBookmarkedImg.value = true;
}

async function activateLike () {
  liked.value = !liked.value;

  if (!liked.value || showLikedImg.value) return;

  showLikedImg.value = true;
  await delay(1500);
  showLikedImg.value = false;
}

</script>

<style lang="scss" scoped>

.video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fullscreenCover {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullscreenIcon {
  width: 50vw;
  height: 50vw;
  transition: all 0.4s;
}

ion-icon.fullscreenIcon {
  color: var(--ion-color-light);
}

.hideIcon {
  width: 0;
  height: 0;
}

.commentVotingDiv {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 2vw;
}

</style>
