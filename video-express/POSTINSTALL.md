## Getting started with Video Express

### Documentation

To get an overview and reference for the API, visit the [Video Express documentation](https://tokbox.com/developer/video-express/).

### Post-installation configuration

Before you can use this extension, you'll need to update your security rules and add some code to your JavaScript app.

#### Update security rules

Update your Cloud Firestore security rules to allow lookups and writes to the `rooms` collection and participant sub-collection.

```
   match /rooms/{id} {
       allow read, write, create, update: if true;
   }

   match /rooms/{id}/participants/{pid} {
       allow read, write, create, update: if true;
   }
```

### Demo application

To get started quickly, there is a demo application so that you can take a look at some code and deploy to Firebase hosting to see the Vonage Video Express in action.

The code can be found in this [GitHub repo](https://github.com/Vonage/vonage-firebase-extensions/tree/main/demos/video-express/public).

The Vonage CLI can be used to scaffold the demo application and be deployed to Firebase hosting.

### More resources

- blog post: [Video Express Is Here and Why It Is Awesome!](https://learn.vonage.com/blog/2021/09/23/video-express-is-here-and-why-it%E2%80%99s-awesome/)
- blog post: [Create a Multiparty Video App With the New Vonage Video Express](https://learn.vonage.com/blog/2021/09/27/create-a-multiparty-video-app-with-the-new-video-express/)
- Community Slack: Give us any feedback and ask questions [here](https://developer.vonage.com/slack)
