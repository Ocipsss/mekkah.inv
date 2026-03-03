import { useEffect } from "react";
import { db_cloud } from "@/lib/firebase";
import { collection, onSnapshot, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db_local } from "@/lib/db";

let isIncomingSync = false;
let syncCount = 0;

export default function SyncManager() {
  useEffect(() => {
    const setupDownlink = (collectionName: string, localTable: any, keyField: string) => {
      const colRef = collection(db_cloud, collectionName);

      return onSnapshot(colRef, (snapshot) => {
        if (snapshot.metadata.hasPendingWrites) return;

        snapshot.docChanges().forEach(async (change) => {
          const firestoreData = change.doc.data();

          const existingLocalData = await localTable
            .where(keyField)
            .equals(firestoreData[keyField])
            .first();

          if (change.type === "added" || change.type === "modified") {
            try {
              syncCount++;
              isIncomingSync = true;
              await localTable.put({
                ...firestoreData,
                id: existingLocalData?.id,
              });
            } catch (err) {
              console.error(`Sync Error [Downlink ${collectionName}]:`, err);
            } finally {
              syncCount--;
              if (syncCount <= 0) {
                syncCount = 0;
                isIncomingSync = false;
              }
            }
          }

          if (change.type === "removed" && existingLocalData?.id) {
            try {
              syncCount++;
              isIncomingSync = true;
              await localTable.delete(existingLocalData.id);
            } catch (err) {
              console.error(`Sync Error [Delete ${collectionName}]:`, err);
            } finally {
              syncCount--;
              if (syncCount <= 0) {
                syncCount = 0;
                isIncomingSync = false;
              }
            }
          }
        });
      });
    };

    const setupUplink = (tableName: string, localTable: any, keyField: string) => {
      const creatingHook = localTable.hook('creating', (_primKey: any, obj: any) => {
        if (isIncomingSync) return;
        const docId = obj[keyField]?.toString().trim();
        if (docId) {
          setDoc(doc(db_cloud, tableName, docId), {
            ...obj,
            updatedAt: obj.updatedAt || Date.now()
          });
        }
      });

      const updatingHook = localTable.hook('updating', (mods: any, _primKey: any, obj: any) => {
        if (isIncomingSync) return;
        const docId = obj[keyField]?.toString().trim();
        if (docId) {
          setDoc(doc(db_cloud, tableName, docId), {
            ...obj,
            ...mods,
            updatedAt: Date.now()
          }, { merge: true });
        }
      });

      const deletingHook = localTable.hook('deleting', (_primKey: any, obj: any) => {
        if (isIncomingSync) return;
        if (obj && obj[keyField]) {
          const docId = obj[keyField].toString().trim();
          deleteDoc(doc(db_cloud, tableName, docId));
        }
      });

      // PERBAIKAN: Gunakan optional chaining untuk unsubscribe
      return () => {
        if (typeof creatingHook === 'function') (creatingHook as any)();
        else creatingHook?.unsubscribe?.();
        
        if (typeof updatingHook === 'function') (updatingHook as any)();
        else updatingHook?.unsubscribe?.();

        if (typeof deletingHook === 'function') (deletingHook as any)();
        else deletingHook?.unsubscribe?.();
      };
    };

    // Setup listeners
    const unsubProd = setupDownlink("products", db_local.products, "kode");
    const unsubCat = setupDownlink("categories", db_local.categories, "nama");
    const unsubPub = setupDownlink("publishers", db_local.publishers, "nama");
    const unsubStaff = setupDownlink("staff", db_local.staff, "nama");
    const unsubLoc = setupDownlink("locations", db_local.locations, "nama");

    const cleanupProd = setupUplink("products", db_local.products, "kode");
    const cleanupCat = setupUplink("categories", db_local.categories, "nama");
    const cleanupPub = setupUplink("publishers", db_local.publishers, "nama");
    const cleanupStaff = setupUplink("staff", db_local.staff, "nama");
    const cleanupLoc = setupUplink("locations", db_local.locations, "nama");

    return () => {
      // PERBAIKAN: Pastikan semua fungsi cleanup dipanggil dengan aman
      unsubProd?.(); unsubCat?.(); unsubPub?.(); unsubStaff?.(); unsubLoc?.();
      cleanupProd?.(); cleanupCat?.(); cleanupPub?.(); cleanupStaff?.(); cleanupLoc?.();
    };
  }, []);

  return null;
}