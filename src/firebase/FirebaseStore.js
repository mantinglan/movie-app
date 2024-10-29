import { db } from "./FirebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { useCallback } from "react";
import { useAlert } from "../context/alertProvider";

export const useFirestore = () => {
  const { showAlert } = useAlert();
  const addDocument = async (collectionName, data) => {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
  };

  const addToWatchlist = async (userId, dataId, data) => {
    try {
      if (await checkIfInWatchlist(userId, dataId)) {
        showAlert({
          message: "This item is already in your wathclist.",
          type: "info",
        });
        return false;
      }
      await setDoc(doc(db, "users", userId, "watchlist", dataId), data);
      showAlert({
        message: "Success!",
        type: "success",
      });
    } catch (error) {
      console.log(error, "Error adding document");
      showAlert({
        message: "Error Occour!",
        type: "danger",
      });
    }
  };

  const checkIfInWatchlist = async (userId, dataId) => {
    const docRef = doc(
      db,
      "users",
      userId?.toString(),
      "watchlist",
      dataId?.toString()
    );

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return true;
    } else {
      return false;
    }
  };

  const removeFromWatchlist = async (userId, dataId) => {
    try {
      await deleteDoc(
        doc(db, "users", userId?.toString(), "watchlist", dataId?.toString())
      );
      showAlert({
        message: "Removed from watchlist.",
        type: "success",
      });
    } catch (error) {
      showAlert({
        message: "Error Occour!",
        type: "danger",
      });
      console.log(error, "Error while deleting doc");
    }
  };

  const getWatchlist = useCallback(async (userId) => {
    const querySnapshot = await getDocs(
      collection(db, "users", userId, "watchlist")
    );
    const data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));
    return data;
  }, []);

  return {
    addDocument,
    addToWatchlist,
    checkIfInWatchlist,
    removeFromWatchlist,
    getWatchlist,
  };
};
