// Get reference to HTML elements
const configInputContainer = document.querySelector("#config-input-container");
const configInput = document.querySelector("#config-input");
const saveConfigBtn = document.querySelector("#save-config");
const roomInputContainer = document.querySelector("#room-input-container");
const roomInput = document.querySelector("#room-input");
const createRoomBtn = document.querySelector("#create-room");
const statusDiv = document.querySelector("#status");

let db;
let firebaseConfig

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";

function initFirebase(){
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log('db: ', db);
    if (db){
        configInputContainer.style.display = "none";
        roomInputContainer.style.display = "block";
    }
}

saveConfigBtn.addEventListener("click", () => {
    console.log("config: ", configInput.innerText);
    console.log("config value: ", configInput.value);
    if (configInput.value){
        const configInputString = `{${configInput.value}}`.replace(/([{,])(\s*)([A-Za-z0-9_\-]+?)\s*:/g, '$1"$3":');
        firebaseConfig = JSON.parse(configInputString);
        console.log(`firebaseConfig: `, firebaseConfig);
        initFirebase();
    }
});

createRoomBtn.addEventListener("click", async()=> {
    console.log("room input name: ", roomInput.value);
    const roomName = roomInput.value.replaceAll(' ', '_');
    statusDiv.innerHTML = "Creating the room...";
    createRoomBtn.disabled = true;
    try {
        await setDoc(doc(db, "rooms", roomName), {
            apiKey: "",
            sessionId: ""
        });
        const unsub = onSnapshot(doc(db, "rooms", roomName), (doc) => {
            console.log("Current data: ", doc.data());
            if (doc.data().sessionId !== ""){
                console.log("Current data: ", doc.data());
                statusDiv.innerHTML = `Room created! <br/>Link: <a href="${window.location}room.html?name=${roomName}" target="_blank">${window.location}room.html?name=${roomName}</a>`;
                roomInput.value = "";
                createRoomBtn.disabled = false;
            }
        });
    } catch (error) {
        console.error("Error creating room: ", error);
        statusDiv.innerHTML = "Error creating room!";
        createRoomBtn.disabled = false;
    }
});