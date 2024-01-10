import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js'
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-functions.js"
const sendSMSButton = document.getElementById('send-sms');
const firebaseConfigTextarea = document.getElementById('config-input');
const saveConfigButton = document.getElementById('save-config');

let firebaseConfig;
let app;

function hideMessages() {
    document.getElementById('success-message').classList.add('hidden');
    document.getElementById('error-message').classList.add('hidden');
    document.getElementById('error-message').innerHTML = '';
    document.getElementById('success-message').innerHTML = '';
}
function displayError(message) {
    hideMessages();

    document.getElementById('error-message').innerHTML = message;
    document.getElementById('error-message').classList.remove('hidden');
}

function displaySuccess(message) {
    hideMessages();

    document.getElementById('success-message').innerHTML = message;
    document.getElementById('success-message').classList.remove('hidden');
}

function initFirebase(){
    app = initializeApp(firebaseConfig);
    if (app){
        document.getElementById('config-input-container').classList.add("hidden");
        document.getElementById('app-container').classList.remove("hidden");
    } else {
        displayError('There was problem initializing your Firebase config. Check your console logs.');
    }
}

saveConfigButton.addEventListener("click", () => {
    if (firebaseConfigTextarea.value){
        const config = `{${firebaseConfigTextarea.value}}`.replace(/([{,])(\s*)([A-Za-z0-9_\-]+?)\s*:/g, '$1"$3":');
        try {
            firebaseConfig = JSON.parse(config);
            console.log(`firebaseConfig: `, firebaseConfig);
            hideMessages();
            document.getElementById('app-container').classList.remove("hidden");
            initFirebase();
        } catch {
            displayError('There was a problem with your config. Make sure it is pasted correctly from the Firebase console');
        }
        
    } else {
        displayError('Please enter a value for the Firebase config');
    }
});

sendSMSButton.addEventListener('click', async () => {
    hideMessages();

    const send = httpsCallable(getFunctions(app), 'ext-firebase-vonage-messages-send');
    send({
        to: document.getElementById('to').value,
        from: document.getElementById('from').value,
        text: document.getElementById('text').value,
        channel: 'sms',
        message_type: 'text'
    })
        .then(resp => {
            console.log(resp);
            if (resp.data?.messageUUID) {
                displaySuccess('Your message was sent successfully. If you do not recieve it on your device, check your logs in your Vonage Customer Dashboard');
            } else {
                displayError(`There was an issue sending the message:<br/><span class="bold">${resp.data.response.data.title}</span> - ${resp.data.response.data.detail}`);
            }
        })
        .catch(err => {
            displayError(`There was an issue sending the message:<br/><span class="bold">${err.data.response.data.title}</span> - ${err.data.response.data.detail}`);
        });
})