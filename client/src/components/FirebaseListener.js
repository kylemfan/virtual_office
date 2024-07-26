import { firebaseDatabase } from '../firebase/firebase';
import { ref, onValue } from "firebase/database";
import { useEffect } from "react";

const characterRef = ref(firebaseDatabase, 'users/' + MY_CHARACTER_INIT_CONFIG.id);
onValue(characterRef, (snapshot) => {
    const data = snapshot.val();
    // updateStarCount(postElement, data);  (FIXME)
})

// Register onvalue function using useEffect hook
// useEffect(() => {

// }, );