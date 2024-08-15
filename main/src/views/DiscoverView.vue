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

      <ion-fab vertical="top" horizontal="end" slot="fixed">
        <ion-fab-button class="fabButton" @click="activateReport">
          <ion-icon class="fabButton" :icon="flag"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      
      <ion-fab vertical="bottom" horizontal="end" slot="fixed" style="margin-bottom: 2em;">
        <ion-fab-button class="fabButton" @click="activateBookmark" :class="{ activeFabButton: bookmarked }">
          <ion-icon class="fabButton" :icon="bookmarks"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed" style="margin-bottom: 7em;">
        <div class="fabButton ion-activatable ion-focusable ripple-parent rectange" @click="openComments = true">
          <ion-ripple-effect></ion-ripple-effect>
          <div class="content">
            <ion-icon class="fabButton" :icon="chatboxEllipses"></ion-icon>
            <p v-if="currentVideo">{{ currentVideo.comments.length.concat() }}</p>
          </div>
        </div>
      </ion-fab>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed" style="margin-bottom: 12em;">
        <div class="fabButton ion-activatable ion-focusable ripple-parent rectangle" @click="activateLike" :class="{ activeFabButton: liked }">
          <ion-ripple-effect></ion-ripple-effect>
          <div class="content">
            <ion-icon :icon="heart"></ion-icon>
            <p v-if="currentVideo">{{ currentVideo.likes.concat() }}</p>
          </div>
        </div>
      </ion-fab>

      <ion-modal :is-open="openReport" :initial-breakpoint="0.8" :breakpoints="[0, 0.5, 0.8, 1]" @didDismiss="openReport = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ $t("report") }}</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-content>
          <h1>{{ $t("submit") }}</h1>
          <p>{{ $t("review") }}</p>
          <p>{{ $t("abuse") }}</p>
          <h3>{{ $t("selectReport") }}</h3>
          <ion-list>
            <ion-item  @click="currentReportReason == reason ? currentReportReason = undefined : currentReportReason = reason" v-for="reason in reportReasons">
              <ion-checkbox :checked="currentReportReason == reason">{{ reason }}</ion-checkbox>
            </ion-item>
            <ion-input v-if="currentReportReason == 'Other'" label="Description" label-placement="floating" counter :maxlength="200" v-model="currentReportDescription"></ion-input>
          </ion-list>
          <ion-button :disabled="!currentReportReason" @click="submitReport">{{ $t("submitReport") }}</ion-button>
        </ion-content>
      </ion-modal>

      <ion-modal :is-open="showThanks" :initial-breakpoint="0.65" :breakpoints="[0, 0.65]" @didDismiss="() => { showThanks = false; handleScroll(); }">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ $t("report") }}</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-content>
          <h1>{{ $t("thanksMessage") }}</h1>
          <p>{{ $t("thanksDescription") }}</p>
        </ion-content>
      </ion-modal>

      <ion-modal ref="commentsModal" :is-open="openComments" :initial-breakpoint="1" :breakpoints="[0, 0.5, 0.8, 1]" @didDismiss="openComments = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ $t("comments") }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="openComments = false">{{ $t("done") }}</ion-button>
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
                  <p>{{ (comment.likes - comment.dislikes).concat() }}</p>
                  <button>
                    <ion-icon :icon="thumbsDownOutline"></ion-icon>
                  </button>
                  <button @click="openCommentReplies(comment)" v-if="comment.replies.length > 0">{{ $t("replies") }}</button>
                </div>
              </ion-label>
            </ion-item>
          </ion-list>
          <ion-infinite-scroll @ionInfinite="loadNewComments">
            <ion-infinite-scroll-content></ion-infinite-scroll-content>
          </ion-infinite-scroll>
        </ion-content>
      </ion-modal>

      <ion-modal :is-open="openReplies" :initial-breakpoint="0.8" :breakpoints="[0, 0.5, 0.8, 1]" @didDismiss="openComments = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ $t("replies") }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="openReplies = false">{{ $t("done") }}</ion-button>
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
                  <p>{{ (currentComment.likes - currentComment.dislikes).concat() }}</p>
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
                  <p>{{ (reply.likes - reply.dislikes).concat() }}</p>
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
  InfiniteScrollCustomEvent, IonAvatar, IonInput, onIonViewWillEnter, createAnimation, IonRippleEffect, IonCheckbox } from '@ionic/vue';
import { heart, chatboxEllipses, bookmarks, heartOutline, bookmarksOutline, thumbsUpOutline, thumbsDownOutline, thumbsUp, thumbsDown, pauseCircleOutline, playCircleOutline, flag } from 'ionicons/icons';
import { ReportReason, userStore, Video, VideoCommentReply, type VideoComment } from '@/stores/userStore';
import { compareObjectsSingle, addCustomMethods, delay, getRandomIntInclusive, getRandomItemFromArray, getVideo, loopUntil } from '@/utils/functions';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, setDoc, startAfter, updateDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { getStorage, ref as firebaseRef, uploadBytes, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import router from '@/router';
import { useI18n } from 'vue-i18n';

addCustomMethods();

const videoRef = ref<HTMLVideoElement> ();
const page = ref();
const content = ref();
const commentsModal = ref();
const pauseIconRef = ref();

const liked = ref(false);
const showLikedImg = ref(false);
const showBookmarkedImg = ref(false);
const videoIsPaused = ref(false);
const showPausedImg = ref(false);
const bookmarked = ref(false);
const openComments = ref(false);
const openReplies = ref(false);
const openReport = ref(false);
const showThanks = ref(false);
const scrollOnCooldown = ref(false);
const hideBottomVideo = ref(false);

const currentVideo = ref<Video> ();
const videoQueue = ref<Video[]> ([]);
const loadedComments = ref<VideoComment[]> ([]);
const loadedReplies = ref<VideoCommentReply[]> ([]);
const currentComment = ref<VideoComment> ();
const toastIcon = ref<string> ();
const toastMessage = ref<string> ();
const pauseIcon = ref<"pause" | "play"> ("pause");

const commentLoader = getComments();
const replyLoader = getReplies();
const reportReasons: ReportReason[] = ["Animal abuse", "Child abuse", "Copyright infringement", "Harrassment", "Hateful content", "Misinformation", "Promotes terrorism", "Sexual content", "Spam", "Other"];
const currentReportReason = ref<ReportReason> ();
watch(() => currentReportReason.value, (value) => console.log(value));
const currentReportDescription = ref("");

const { t } = useI18n();

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

onIonViewDidLeave(async () => {
  videoRef.value?.pause();
  await pushToFirebase();
});

async function pushToFirebase () {
  if (!currentVideo.value) return;

  const likedVideos = userStore().smProfile.likedVideos;
  const bookmarkedVideos = userStore().smProfile.bookmarkedVideos;
  
  await updateDoc(doc(db, "videos", currentVideo.value.id), {
    views: currentVideo.value.views + 1,
    likes: currentVideo.value.likes
  });
  
  if (liked.value && !likedVideos.includes(currentVideo.value.id)) likedVideos.push(currentVideo.value.id);
  if (bookmarked.value && !bookmarkedVideos.includes(currentVideo.value.id)) bookmarkedVideos.push(currentVideo.value.id);
  
  if (!liked.value && likedVideos.includes(currentVideo.value.id)) userStore().smProfile.likedVideos = likedVideos.filter((video) => video != currentVideo.value?.id);
  if (!bookmarked.value && bookmarkedVideos.includes(currentVideo.value.id)) userStore().smProfile.bookmarkedVideos = bookmarkedVideos.filter((video) => video != currentVideo.value?.id);
  
  await updateDoc(doc(db, "users", userStore().userData?.uid ?? ""), {
    smProfile: userStore().smProfile
  });
}

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

  await pushToFirebase();

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

  if (userStore().smProfile.likedVideos.includes(currentVideo.value.id)) liked.value = true;
  else liked.value = false;
  if (userStore().smProfile.bookmarkedVideos.includes(currentVideo.value.id)) bookmarked.value = true;
  else bookmarked.value = false;
  
  const copyOfQueue = [...videoQueue.value];
  videoQueue.value.length = 0;
  videoQueue.value = await loopUntil(videoQueue.value.length == 0, copyOfQueue.slice(1));
  if (videoQueue.value.length < 4) {
    for (let i = videoQueue.value.length; i < 4; i++) pushVideoToQueue();
  }
  scrollOnCooldown.value = false;
  pushVideoToQueue();
}

function* getComments () {
  let i = 0;
  while (true) {
    if (i % 10 == 0 && i != 0) yield;
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
    if (replyIndex % 10 == 0 && replyIndex != 0) yield;
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
  if (videoIsPaused.value) videoRef.value?.pause();
  else videoRef.value?.play();

  if (showPausedImg.value) return;

  if (videoIsPaused.value) pauseIcon.value = "pause";
  else pauseIcon.value = "play";

  showPausedImg.value = true;
  const animation = createAnimation().addElement(pauseIconRef.value.$el).duration(500).iterations(1).keyframes([
  { offset: 0, width: "0", height: "0", opacity: "100%" }, { offset: 0.6, width: "20vw", height: "20vw" }, { offset: 1, width: "45vw", height: "45vw", opacity: '0%' }]);
  await animation.play();
  animation.stop();
  showPausedImg.value = false;
}

async function submitReport () {
  openReport.value = false;
  showThanks.value = true;

  const base64Characters = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b',
    'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3',
    '4', '5', '6', '7', '8', '9', '-', '_'];
    
  let reportId = "";
  for (let i = 0; i < 12; i++) {
    reportId += getRandomItemFromArray(base64Characters);
  }

  await setDoc(doc(db, "videoReports", reportId), {
    reportId,
    videoId: currentVideo.value?.id,
    reason: currentReportReason.value,
    customReason: currentReportDescription.value,
    reporterId: userStore().userData?.uid,
    created: new Date()
  });

  currentReportReason.value = undefined;
  currentReportDescription.value = "";
}

async function activateReport () {
  openReport.value = true;
}

async function activateBookmark () {
  bookmarked.value = !bookmarked.value;

  if (showBookmarkedImg.value) return;

  toastMessage.value = bookmarked.value ? t("addBookmark") : t("removeBookmark");
  toastIcon.value = bookmarked.value ? bookmarks : bookmarksOutline;
  showBookmarkedImg.value = true;
}

async function activateLike () {
  if (!currentVideo.value) return;
  liked.value = !liked.value;

  if (liked.value) currentVideo.value.likes++;
  else currentVideo.value.likes--;

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
  color: var(--ion-color-secondary);
}

ion-fab-button.fabButton {
  --background: transparent;
  --box-shadow: 0;

  ion-icon {
    width: 70%;
    height: 70%;
  }

  p {
    margin: 0;
  }
}

.fabButton {
  width: 56px;
  height: 56px;
  background-color: transparent;

  ion-ripple-effect {
    border-radius: 50%;
  }
  
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    ion-icon {
      width: 70%;
      height: 70%;
      color: white;
    }

    p {
      margin: 0;
      color: white;
    }
  }
}

ion-fab-button.activeFabButton {
  --color: var(--ion-color-secondary);
}

.activeFabButton {
  .content {
    ion-icon {
      color: var(--ion-color-secondary);
    }
  }
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
