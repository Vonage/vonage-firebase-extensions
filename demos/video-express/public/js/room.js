/* global OT, VideoExpress, apiKey, sessionId, token */

// client-side js, loaded by index.html
// run by the browser each time the page is loaded

// Get reference to HTML elements
const previewContainerEl = document.querySelector('#previewContainer');
const configInputContainer = document.querySelector("#config-input-container");
const configInput = document.querySelector("#config-input");
const saveConfigBtn = document.querySelector("#save-config");
const selectDevices = document.querySelector('#select-devices');
const videoChat = document.querySelector('#video-chat');
const audioSelector = document.querySelector('#audio-source-select');
const videoSelector = document.querySelector('#video-source-select');
const previewSelectionBtn = document.querySelector('#previewSelection');
const requestAccessBtn = document.querySelector('#requestAccess');
const permissionDeniedEl = document.querySelector('#permissionDenied');
const participantNameInput = document.querySelector('#participant-name');
const joinRoomBtn = document.querySelector('#joinRoomButton');
const veContainerEl = document.querySelector('#VEcontainer');
const videoBtn = document.querySelector('#videoButton');
const videoStatusEl = document.querySelector('#videoStatus');
const audioBtn = document.querySelector('#audioButton');
const audioStatusEl = document.querySelector('#audioStatus');
const layoutBtn = document.querySelector('#layoutButton');
const layoutStatusEl = document.querySelector('#layoutStatus');
const screenshareStartBtn = document.querySelector('#screenshareStartButton');
const screenshareStopBtn = document.querySelector('#screenshareStopButton');
const leaveBtn = document.querySelector('#leaveButton');
const myPreviewVideoEl = document.querySelector("#myPreviewVideo");

let previewPublisher;
let room;
let apiKey;
let sessionId;
let token;
let participantName;

let db;
let firebaseConfig

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot, getDoc } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

console.log("window.location.search: ", window.location.search);
const roomName = window.location.search.split("=")[1];
console.log("roomName: ",roomName);

async function initFirebase(){
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log('db: ', db);
  if (db){
    configInputContainer.style.display = "none";
    previewContainerEl.style.display = "flex";
    try {
      const docSnap = await getDoc(doc(db, "rooms", roomName));
      if (docSnap.exists()) {
        console.log("Room data: ", docSnap.data());
        apiKey = docSnap.data().apiKey;
        sessionId = docSnap.data().sessionId;
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error getting room data: ",error);
    }
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

const loadAVSources = async() => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.log("enumerateDevices() not supported.");
    return;
  }
  try {
    // Need to ask permission in order to get access to the devices to be able to list them in the dropdowns.
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    stream.getTracks().forEach(track => track.stop());
    let audioCount = 0;
    let videoCount = 0;
    const devices = await VideoExpress.getDevices();
    devices.forEach(function(device) {
      if (device.kind.toLowerCase() === 'audioinput') {
        audioCount += 1;
        audioSelector.innerHTML += `<option value="${device.deviceId}">${device.label || device.kind + audioCount}</option>`;
      }
      if (device.kind.toLowerCase() === 'videoinput') {
        videoCount += 1;
        videoSelector.innerHTML += `<option value="${device.deviceId}">${device.label || device.kind + audioCount}</option>`;
      }
    });
    audioSelector.innerHTML += `<option value="">No audio</option>`;
    videoSelector.innerHTML += `<option value="">No video</option>`;
  } catch (error) {
    console.error("error loading AV sources: ", error)
  }
}

loadAVSources();

requestAccessBtn.addEventListener("click", () => {
  permissionDeniedEl.style.display = "none";
  loadAVSources();
});

const startPreview = () => {
  myPreviewVideoEl.innerHTML = "";
  previewPublisher = new VideoExpress.PreviewPublisher('previewContainer');
  previewPublisher.previewMedia({
    targetElement: 'myPreviewVideo',
    publisherProperties: {
      resolution: '1280x720',
      [audioSelector.value === "" ? "publishAudio" : "audioSource" ]: audioSelector.value === "" ? false : audioSelector.value,
      [videoSelector.value === "" ? "publishVideo" : "videoSource" ]: videoSelector.value === "" ? false : videoSelector.value,
      mirror: false,
      audioBitrate: 15,
      audioFallbackEnabled: true,
    },
  });
}

previewSelectionBtn.addEventListener("click", () =>{
  startPreview();
  // joinRoomBtn.disabled = false;
});

participantNameInput.addEventListener('input', (e) => {
  participantName = e.target.value;
  joinRoomBtn.disabled = participantName === "" ? true : false;
})

const joinRoom = async() => {
  console.log("joinRoom room: ",room);
  if(!room){
    console.log("create a new room")
    room = new VideoExpress.Room({
      apiKey: apiKey, // add your OpenTok APIKey
      sessionId: sessionId, // add your OpenTok Session Id
      token: token, // add your OpenTok token
      participantName: participantName,
      roomContainer: 'roomContainer',
      managedLayoutOptions: {
        cameraPublisherContainer: 'myVideo',
      },
    });
  }

  const { camera, screen } = room;

  try {
    await room.join({
      // targetElement: 'previewContainer',
      publisherProperties: {
        resolution: '1280x720',
        [audioSelector.value === "" ? "publishAudio" : "audioSource" ]: audioSelector.value === "" ? false : audioSelector.value,
        [videoSelector.value === "" ? "publishVideo" : "videoSource" ]: videoSelector.value === "" ? false : videoSelector.value,
        mirror: true,
        audioBitrate: 6000,
        audioFallbackEnabled: true,
      },
    });
  } catch (error){
    console.error("Error joining room: ", error);
  }

  videoStatusEl.innerText = camera.isVideoEnabled() ? "enabled" : "disabled";
  audioStatusEl.innerText = camera.isAudioEnabled() ? "enabled" : "disabled";

  const toggleVideo = () => {
    console.log('camera.isVideoEnabled()',camera.isVideoEnabled());
    if (camera.isVideoEnabled()){
      camera.disableVideo();
      videoStatusEl.innerText = "disabled";
    } else {
      camera.enableVideo();
      videoStatusEl.innerText = "enabled";
    }
  }

  videoBtn.addEventListener("click", toggleVideo, false);

  const toggleAudio = () => {
    console.log('camera.isAudioEnabled()',camera.isAudioEnabled());
    if (camera.isAudioEnabled()){
      camera.disableAudio();
      audioStatusEl.innerText = "disabled";
    } else {
      camera.enableAudio();
      audioStatusEl.innerText = "enabled";
    }
  }

  audioBtn.addEventListener("click", toggleAudio, false);

  const toggleLayout = () => {
    if (layoutStatusEl.innerText === "grid"){
      room.setLayoutMode("active-speaker");
      layoutStatusEl.innerText = "active speaker";
    } else {
      room.setLayoutMode("grid");
      layoutStatusEl.innerText = "grid";
    }
  }

  layoutBtn.addEventListener("click", toggleLayout, false);

  const startScreensharing = () => {
    room.startScreensharing("myScreenshare");
    screenshareStartBtn.style.display = "none";
    screenshareStopBtn.style.display = "block";
  }

  const stopScreensharing = () => {
    room.stopScreensharing();
    screenshareStopBtn.style.display = "none";
    screenshareStartBtn.style.display = "block";
  }

  screenshareStartBtn.addEventListener("click", startScreensharing, false);

  screenshareStopBtn.addEventListener("click", stopScreensharing, false);

  leaveBtn.addEventListener("click", () => {
    screenshareStartBtn.removeEventListener("click", startScreensharing, false);
    screenshareStopBtn.removeEventListener("click", stopScreensharing, false);
    videoBtn.removeEventListener("click", toggleVideo, false);
    audioBtn.removeEventListener("click", toggleAudio, false);
    layoutBtn.removeEventListener("click", toggleLayout, false);
    room.leave();
    previewContainerEl.style.display = "flex";
    veContainerEl.style.display = "none";
    startPreview();
  });

  screen.on('started', () => {
    console.log('The screen sharing has started!');
    screenshareStartBtn.style.display = "none";
    screenshareStopBtn.style.display = "block";
  });

  screen.on('stopped', () => {
    console.log('The screen stopped sharing because: ');
    screenshareStopBtn.style.display = "none";
    screenshareStartBtn.style.display = "block";
  });

  room.on('connected', async() => {
    console.log('room connected!');
  });

  room.on('participantJoined', (participant) => {
    console.log('participantJoined: ', participant);
    participant.on('cameraCreated', (cameraSubscriber) => {
      console.log('Paricipant camera created! ',cameraSubscriber);
    });
    participant.on('cameraDestroyed', (reason) => {
      console.log('Paricipant camera destroyed!', reason);
    });
    participant.on('screenCreated', (screenSubscriber) => {
      console.log('Paricipant Screen created!',screenSubscriber);
    });
    participant.on('screenDestroyed', (reason) => {
      console.log('Paricipant Screen destroyed!',reason);
    });
    participant.on('destroyed', (reason) => {
      console.log('Paricipant Screen destroyed!',reason);
    });
  });

  room.on('disconnected', () => {
    console.log('room disconnected!');
  });

  room.on('reconnecting', () => {
    console.log('room reconnecting!');
  });

  room.on('reconnected', () => {
    console.log('room reconnected!');
  });
};

joinRoomBtn.addEventListener("click", async () => {
  joinRoomBtn.disabled = true;
  try {
    await setDoc(doc(db, "rooms", roomName, "participants", participantName), {
      token: "",
    });
    const unsub = onSnapshot(doc(db, "rooms", roomName, "participants", participantName), (docSnap) => {
      if (docSnap.data().token !== ""){
        console.log("Current data: ", docSnap.data());
        token = docSnap.data().token;
        if (previewPublisher){
          previewPublisher.destroy();
        }
        joinRoomBtn.disabled = false;
        previewContainerEl.style.display = "none";
        veContainerEl.style.display = "flex";
        joinRoom();
      }
    });
  } catch (error) {
    console.error("Error joining participant: ", error);
    joinRoomBtn.disabled = false;
  }
});
