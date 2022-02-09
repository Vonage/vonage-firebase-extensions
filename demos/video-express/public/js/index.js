// Get reference to HTML elements
const roomInput = document.querySelector("#room-input");
const createRoomBtn = document.querySelector("#create-room");
const statusDiv = document.querySelector("#status");

const db = firebase.firestore();

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