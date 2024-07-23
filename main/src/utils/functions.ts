import { collection, doc, getDoc, getDocs, limit, orderBy, query, startAfter } from "firebase/firestore";
import { db } from "./firebase";
import { Video } from "@/stores/userStore";

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

export function concatBigNumber (num: number) {
  const numString = String(Math.abs(num));

  if (numString.length < 4) return num.toLocaleString();
  else if (numString.length < 7) return (num/1000).toFixed(1) + "K";
  else if (numString.length < 10) return (num/1000000).toFixed(1) + "M";
  else if (numString.length < 13) return (num/1000000000).toFixed(1) + "B";
  else return (num/1000000000000).toFixed(1) + "T";
}

export async function getVideo () {
  let videoRendered = false;

  while (!videoRendered) {
    const allVideos = await getDocs(collection(db, "videos"));
    const numberOfVideos = allVideos.size;
  
    const randomIndex = getRandomIntInclusive(0, numberOfVideos - 1);
  
    const randomDocQuery = query(collection(db, "videos"), orderBy("__name__"), limit(1), startAfter(allVideos.docs[randomIndex].id));
    const randomDocSnapshot = await getDocs(randomDocQuery);
    if (randomDocSnapshot.empty) continue;
  
    const selectedDoc = randomDocSnapshot.docs[0];
    
    try {
      const firebaseObject = await getDoc(doc(db, "videos", selectedDoc.id));
      console.log(firebaseObject.data())
      if (firebaseObject.exists()) return firebaseObject.data() as Video;
  
    } catch (error) {
      console.error(error);

    } finally {
      videoRendered = true;
    }
  }
}
  