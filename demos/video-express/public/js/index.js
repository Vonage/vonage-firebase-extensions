// Get reference to HTML elements
const configInputContainer = document.querySelector("#config-input-container");
const configInput = document.querySelector("#config-input");
const saveConfigBtn = document.querySelector("#save-config");
const roomInputContainer = document.querySelector("#room-input-container");
const roomInput = document.querySelector("#room-input");
const createRoomBtn = document.querySelector("#create-room");
const statusDiv = document.querySelector("#status");

let db;

function initFirebase(){
    db = firebase.firestore()
}

saveConfigBtn.addEventListener("click", () => {
    console.log("config value: ", configInput.value);
});

createRoomBtn.addEventListener("click", ()=> {
    console.log("room input name: ", roomInput.value);
    const roomName = roomInput.value.replaceAll(' ', '_');
    statusDiv.innerHTML = "Creating the room...";
    createRoomBtn.disabled = true;

    db.collection("rooms").doc(roomName).set({
        apiKey: "",
        sessionId: ""
    })
    .then(() => {
        console.log("Room created successfully");
        statusDiv.innerHTML = "Database entry created.";
    })
    .catch((error) => {
        console.error("Error creating room: ", error);
        statusDiv.innerHTML = "Error creating room!";                
        createRoomBtn.disabled = false;
    });

    db.collection("rooms").doc(roomName)
    .onSnapshot((doc) => {
        if (doc.data().sessionId !== ""){
            console.log("Current data: ", doc.data());
            statusDiv.innerHTML = `Room created! <br/>Link: <a href="${window.location}room.html?name=${roomName}" target="_blank">${window.location}room.html?name=${roomName}</a>`;
            roomInput.value = "";    
            createRoomBtn.disabled = false;    
        }
    });
});