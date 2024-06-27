import {initializeApp} from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {defineString} from "firebase-functions/params";

const apiKey = defineString("API_KEY");
const authDomain = defineString("AUTH_DOMAIN");
const projectId = defineString("PROJECT_ID");
const storageBucket = defineString("STORAGE_BUCKET");
const messagingSenderId = defineString("MESSAGING_SENDER_ID");
const appId = defineString("APP_ID");

type Entry = {
    amount: number;
    date: string;
    descr?: string;
    category: string;
    user: string;
};

const converter = {
  toFirestore: (data: Entry) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as Entry,
};

export const addRecord = onRequest(async (request, response) => {
  logger.info(".....Start Add Record.....", {structuredData: true});
  const {amount, date, category, user} = request.body;
  const descr = request.body.descr || "";

  if (!amount || !date || !category || !user) {
    response.status(401).json({result: "Invalid params"});
    return;
  }

  const firebaseConfig = {
    apiKey: apiKey.value(),
    authDomain: authDomain.value(),
    projectId: projectId.value(),
    storageBucket: storageBucket.value(),
    messagingSenderId: messagingSenderId.value(),
    appId: appId.value(),
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  try {
    const docRef = await addDoc(
      collection(db, "entries").withConverter(converter),
      {
        amount, date, descr, category, user,
      },
    );
    logger.info("Document written with ID: ", docRef.id);
    response.json({result: `Message with ID: ${docRef.id} added.`});
  } catch (e) {
    console.error("Error adding document: ", e);
    response.status(500).json({result: "Failed adding entry"});
  }
});
