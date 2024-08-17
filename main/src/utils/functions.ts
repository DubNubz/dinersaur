import { collection, doc, DocumentData, DocumentSnapshot, getDoc, getDocs, limit, orderBy, query, startAfter } from "firebase/firestore";
import { db } from "./firebase";
import { Video } from "@/stores/userStore";

// general functions

export function delay (ms: number) {
    return new Promise((executor: any) => setTimeout(executor, ms));
}
  
export function getRandomIntInclusive (min: number, max: number) {
    const minCeiled: number = Math.ceil(min);
    const maxFloored: number = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

export function getRandomItemFromArray (arr: any[]) {
    return arr[getRandomIntInclusive(0, arr.length - 1)];
}

export function compareObjectsInArray(obj1: Record<any, any>, obj2: Record<any, any>) {
  return Object.keys(obj1).every(key => obj2.hasOwnProperty(key) && obj1[key] === obj2[key]);
}

export function compareObjectsSingle(obj1: Record<any, any> | undefined, obj2: Record<any, any> | undefined) {
    if (!obj1 || !obj2) return;

    if (obj1 === obj2) {
      return true;
    }
  
    if (obj1 == null || obj2 == null || typeof obj1 !== 'object' || typeof obj2 !== 'object') {
      return false;
    }
  
    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);
  
    if (keys1.length !== keys2.length) {
      return false;
    }
  
    for (let key of keys1) {
      if (!keys2.includes(key) || !compareObjectsSingle(obj1[key], obj2[key])) {
        return false;
      }
    }
  
    return true;
}

export async function loopUntil <T> (stopCondition: boolean, returnValue: T) {
  let done = false;
  let failsafe = 0;
  while (!done || failsafe < 20) {
    if (stopCondition) {
      done = true;
      console.log(returnValue)
      return returnValue;
    } else {
      await delay(5);
      failsafe++;
    }
  }
  return returnValue;
}

// general methods

export function addCustomMethods () {
  String.prototype.capitalize = function () {
    const string = this.valueOf();
    return string[0].toUpperCase() + string.slice(1);
  }

  Number.prototype.concat = function () {
    const num = this.valueOf();
    const numString = String(Math.abs(num));
  
    if (numString.length < 4) return num.toLocaleString();
    else if (numString.length < 7) return (num/1000).toFixed(1) + "K";
    else if (numString.length < 10) return (num/1000000).toFixed(1) + "M";
    else if (numString.length < 13) return (num/1000000000).toFixed(1) + "B";
    else return (num/1000000000000).toFixed(1) + "T";
  }

  Number.prototype.isEven = function () {
    const num = this.valueOf();
    return num % 2 == 0;
  }

  Array.prototype.toUnique = function () {
    return [...new Set(this)];
  }
}

declare global {
  interface String {
    capitalize(): string;
  }

  interface Number {
    concat(): string;
    isEven(): boolean;
  }

  interface Array<T> {
    toUnique(): Array<T>;
  }
}

// project specific functions

export async function getVideo () {
  let videoRendered = false;
  let selectedVideo;

  while (!videoRendered) {
    const allVideos = await getDocs(collection(db, "videos"));
    const numberOfVideos = allVideos.size;
  
    const randomIndex = getRandomIntInclusive(0, numberOfVideos - 1);
  
    const randomDocQuery = query(collection(db, "videos"), orderBy("__name__"), limit(1), startAfter(allVideos.docs[randomIndex].id));
    const randomDocSnapshot = await getDocs(randomDocQuery);
    if (randomDocSnapshot.empty) continue;
  
    const selectedDoc = randomDocSnapshot.docs[0];
    
    selectedVideo = await getDoc(doc(db, "videos", selectedDoc.id));
    videoRendered = true;
  }

  return (selectedVideo as DocumentSnapshot<DocumentData, DocumentData>).data() as Video;
}

export function timeSince (time: number) {
  const currentTime = new Date().getTime();
  
  const secondsSince = (currentTime - time) / 1000;

  if (secondsSince < 60) {
    return Math.floor(secondsSince) + ` second${secondsSince == 1 ? '' : 's'} ago`;

  } else if (secondsSince < 60 * 60) {
    return Math.floor(secondsSince / 60) + ` minute${Math.floor(secondsSince / 60) == 1 ? '' : 's'} ago`;

  } else if (secondsSince < 60 * 60 * 24) {
    return Math.floor(secondsSince / 60 / 60) + ` hour${Math.floor(secondsSince / 60 / 60) == 1 ? '' : 's'} ago`;

  } else if (secondsSince < 60 * 60 * 24 * 30) {
    return Math.floor(secondsSince / 60 / 60 / 24) + ` day${Math.floor(secondsSince / 60 / 60 / 24) == 1 ? '' : 's'} ago`;

  } else if (secondsSince < 60 * 60 * 24 * 30 * 12) {
    return Math.floor(secondsSince / 60 / 60 / 24 / 30) + ` month${Math.floor(secondsSince / 60 / 60 / 24 / 30) == 1 ? '' : 's'} ago`;

  } else {
    return Math.floor(secondsSince / 60 / 60 / 24 / 30 / 12) + ` year${Math.floor(secondsSince / 60 / 60 / 24 / 30 / 12) == 1 ? '' : 's'} ago`;
  }
}
  