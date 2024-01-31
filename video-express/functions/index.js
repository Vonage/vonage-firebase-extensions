const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const { Vonage } = require('@vonage/server-sdk');

const db = admin.firestore();


// for demo application

const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors({ origin: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/demo/index.html");
});

app.get('/room.html', (req, res) => {
  res.sendFile(__dirname + "/demo/room.html");
});

app.get('/js/room.js', (req, res) => {
  res.sendFile(__dirname + "/demo/js/room.js");
});

app.get('/js/index.js', (req, res) => {
  res.sendFile(__dirname + "/demo/js/index.js");
});

app.get('/style.css', (req, res) => {
  res.sendFile(__dirname + "/demo/style.css");
});

exports.demo = functions.handler.https.onRequest(app);

/////////////////////

async function initializeVonage(){
    console.log("initializeVonage");
    const privateKey = Buffer.from(process.env.VONAGE_PRIVATE_KEY_64, 'base64');
    return new Vonage({
        applicationId: process.env.VONAGE_APPLICATION_ID,
        privateKey: privateKey
    });
}

async function createSession(){
    console.log("createSession");
    let vonage;
    try {
        vonage = await initializeVonage();
    } catch (error) {
        console.log('error initializing Vonage ', error);
    }
    return vonage.video.createSession({mediaMode:"routed"});
}

exports.createRoom = functions.handler.firestore.document
    .onCreate(async (snap, context) => {
        console.log("createRoom");
        try {
            const session = await createSession();
            const pathSegments = snap.ref._path.segments
            const roomId = pathSegments[pathSegments.length-1];
            return db.collection("rooms").doc(roomId).set({
                applicationId: session.ot.applicationId,
                sessionId: session.sessionId
            },{merge: true})
            .then(()=>{
                console.log("Room successfully created!");
                return {status: 200, text: "Room successfully created!"};
            })
            .catch((error) => {
                console.error("Error creating room: ", error);
                return {status: 500, text: error};
            })
        } catch (error){
            console.error("Error creating room or session: ", error);
            return {status: 500, text: error};
        }
    });

exports.generateToken = functions.handler.firestore.document
    .onCreate( async (snap, context) =>{
        console.log("generateToken");
        try {
            const vonage = await initializeVonage();
            const pathSegments = snap.ref._path.segments;
            console.log('pathSegments: ', pathSegments);
            const participantName = pathSegments[pathSegments.length-1];
            console.log('participantName: ', participantName);
            // get sessionId
            return db.collection('rooms').doc(pathSegments[1]).get()
            .then(roomData => {
                if (!roomData.exists){
                    console.log("No such document!");
                } else {
                    const sessionId = roomData.data().sessionId;
                    console.log("sessionId: ", sessionId);
                    const token = vonage.video.generateClientToken(sessionId);
                    return db.collection("rooms").doc(pathSegments[1]).collection("participants").doc(participantName).set({
                        token: token
                    },{merge: true})
                    .then(()=>{
                        console.log("Token successfully created!");
                        return {status: 200, text: "Token successfully created!"};
                    })
                    .catch((error) => {
                        console.error("Error creating token: ", error);
                        return {status: 500, text: error};
                    });
                }
            }).catch((error) => {
                console.log("Error initializing Vonage: ", error);
            })
        } catch (error){
            console.error("Error creating room or session: ", error);
            return {status: 500, text: error};
        }
    });
