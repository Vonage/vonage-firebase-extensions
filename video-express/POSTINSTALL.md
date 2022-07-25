## Getting started with Video Express

### Documentation

To get an overview and reference for the API, visit the [Video Express documentation](https://tokbox.com/developer/video-express/).

### Post-installation configuration

Before you can use this extension, you'll need to update your security rules and add some code to your JavaScript app.

#### Update security rules

Update your Cloud Firestore [security rules](https://console.firebase.google.com/project/_/firestore/rules) to allow lookups and writes to the `rooms` collection and `participants` sub-collection.

```
   match /rooms/{id} {
       allow read, write, create, update: if true;
   }
   match /rooms/{id}/participants/{pid} {
       allow read, write, create, update: if true;
   }
```
### Demo application

To get started quickly, there is a demo application so that you can see the Vonage Video Express in action.

link to demo: [${function:demo.url}/](${function:demo.url}/)

It will start you off in an "admin" panel that will allow you to create a room.

You will be asked for your App's `firebaseConfig` which can be found in under [Project Settings](https://console.firebase.google.com/project/_/settings/general).
> Note: Inputting the `firebaseConfig` is only done because the demo is optional. You would normally supply the `firebaseConfig` in your application when initializing Firebase.

Next, you will be asked to enter a room name to create. Once you click `create`, a new document called the room name you entered is created in Cloud Firestore under the `rooms` collection with the following data:

```js
{
  apiKey: "",
  sessionId: ""
}
```

The `createRoom` Cloud Function listens for new `rooms` documents and will:
- create a session using the OpenTok (Vonage Video) SDK and the API Key and API Secret entered during installation
- set the `apiKey` and `sessionId` values
- return a status if the Cloud Function was a success or if an error occurred.

If successful, a link to the video chat application will be displayed.

Open the link, and you'll once again be asked to enter the `firebaseConfig` and save.

Once saved, you'll be presented with choosing your video and audio devices and preview your selection.

You will also be asked to input your name.

When the `join room` button is clicked, a new Cloud Firestore document is set under `rooms/{roomName}/participants/{participantName}` with 
```js
{
  token: ""
}
```

When there is a document created in the `participants` collection, the Cloud Function `generateToken` will run and then:
- generate the token needed for a person to join the video chat using the OpenTok (Vonage Video) SDK
- set the `token` value
- return a status if the Cloud Function was a success of if an error occurred.

The same steps are repeated for every person that joins the video chat.

The code can be found in this [GitHub repo](https://github.com/Vonage/vonage-firebase-extensions/tree/main/demos).

### Monitoring

As a best practice, you can [monitor the activity](https://firebase.google.com/docs/extensions/manage-installed-extensions#monitor) of your installed extension, including checks on its health, usage, and logs.

### More resources

- blog post: [Video Express Is Here and Why It Is Awesome!](https://learn.vonage.com/blog/2021/09/23/video-express-is-here-and-why-it%E2%80%99s-awesome/)
- blog post: [Create a Multiparty Video App With the New Vonage Video Express](https://learn.vonage.com/blog/2021/09/27/create-a-multiparty-video-app-with-the-new-video-express/)
- Community Slack: Give us any feedback and ask questions [here](https://developer.vonage.com/slack)
