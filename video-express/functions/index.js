const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const OpenTok = require("opentok");

const db = admin.firestore();

async function initializeOpenTok(){
    console.log("initializeOpenTok");
    return new OpenTok(process.env.VONAGE_API_KEY, process.env.VONAGE_API_SECRET);
}

async function createSession(){
    console.log("createSession");
    let opentok;
    try {
        opentok = await initializeOpenTok();
    } catch (error) {
        console.log('error initializing OpenTok ', error);
    }
    return new Promise( (resolve, reject) => {
        opentok.createSession({mediaMode:"routed"}, (error, session)=>{
            if(error){
                console.error("error creating session ", error);
                reject({error});
            } else {
                resolve(session);
            }
        });
    });
}

exports.createRoom = functions.handler.firestore.document
    .onCreate(async (snap, context) => {
        console.log("createRoom");
        try {
            const session = await createSession();
            const pathSegments = snap.ref._path.segments
            const roomId = pathSegments[pathSegments.length-1];
            return db.collection("rooms").doc(roomId).set({
                apiKey: session.ot.apiKey,
                sessionId: session.sessionId
            },{merge: true})
            .then(()=>{
                console.log("Room successfully created!");
                return {status: 200, text: "woohoo"};
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
            const opentok = await initializeOpenTok();
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
                    const token = opentok.generateToken(sessionId);
                    return db.collection("rooms").doc(pathSegments[1]).collection("participants").doc(participantName).set({
                        token: token
                    },{merge: true})
                    .then(()=>{
                        console.log("Room successfully created!");
                        return {status: 200, text: "Room successfully created!"};
                    })
                    .catch((error) => {
                        console.error("Error creating room: ", error);
                        return {status: 500, text: error};
                    });
                }
            }).catch((error) => {
                console.log("Error initializing OpenTok: ", error);
            })
        } catch (error){
            console.error("Error creating room or session: ", error);
            return {status: 500, text: error};
        }
    });
