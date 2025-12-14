const functions = require("firebase-functions/v2");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

admin.initializeApp(); // prod admin

// Secret stored in prod via: firebase functions:secrets:set VIEWER_SERVICE_ACCOUNT_JSON
const VIEWER_SERVICE_ACCOUNT_JSON = defineSecret("VIEWER_SERVICE_ACCOUNT_JSON");

// Collections to mirror from prod -> viewer
const COLLECTIONS = [
  "players",
  "fixtures",
  "transactions",
  "participations",
  "opponents",
  "venues",
  "referees",
  "kitDetails",
  "kitQueue",
];

let viewerDb;

function getViewerDb() {
  if (viewerDb) return viewerDb;

  const raw = VIEWER_SERVICE_ACCOUNT_JSON.value();
  if (!raw) throw new Error("Missing VIEWER_SERVICE_ACCOUNT_JSON secret");

  const creds = JSON.parse(raw);

  // Create a named secondary admin app for viewer
  const viewerApp = initializeApp({ credential: cert(creds) }, "viewerApp");
  viewerDb = getFirestore(viewerApp);

  return viewerDb;
}

async function mirrorWrite(collection, id, data) {
  const db = getViewerDb();
  await db.collection(collection).doc(String(id)).set(data, { merge: false });
}

async function mirrorDelete(collection, id) {
  const db = getViewerDb();
  await db.collection(collection).doc(String(id)).delete();
}

// One trigger per collection
COLLECTIONS.forEach((name) => {
  exports[`mirror_${name}`] = functions.firestore.onDocumentWritten(
    {
      document: `${name}/{docId}`,
      secrets: [VIEWER_SERVICE_ACCOUNT_JSON],
    },
    async (event) => {
      const { docId } = event.params;

      // Defensive: event.data can be undefined in some edge cases
      if (!event.data) return;

      // Delete
      if (!event.data.after.exists) {
        await mirrorDelete(name, docId);
        return;
      }

      // Create / Update
      const data = event.data.after.data();
      await mirrorWrite(name, docId, { ...data, id: data?.id ?? docId });
    }
  );
});
