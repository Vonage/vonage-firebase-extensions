## Getting started with Vonage Messages

### Documentation

To get an overview and reference for the API, visit the [Vonage Messages API Documentation](https://developer.vonage.com/en/messages/overview).

### Demo Application

To help you get quickly started, we offer a basic demo application that can be run locally. The demo application will ask for configuration for your Firebase application, and then bootstraps an instance that can call the function.

Please see the source code available on [GitHub](https://github.com/Vonage/vonage-firebase-extensions/tree/main/demos/messages/public).

### Usage

This extension provides an `onCall` function that can be called from a Firebase application. It adds a new function that can be pulled from Firebase named `send` that can accept a [Messages Request](https://developer.vonage.com/en/api/messages-olympus#SendMessage) object that will send a message through the Vonage Messages API. 

```js
const send = httpsCallable(getFunctions(app), 'ext-firebase-vonage-messages-send');
send({
    to: document.getElementById('to').value,
    from: document.getElementById('from').value,
    text: document.getElementById('text').value,
    channel: 'sms',
    message_type: 'text'
})
    .then(resp => {
    if (resp.data?.messageUUID) {
        console.log('Your message was sent successfully. If you do not recieve it on your device, check your logs in your Vonage Customer Dashboard');
    } else {
        console.error(`There was an issue sending the message: ${resp.data.response.data.title} - ${resp.data.response.data.detail}`);
    }
    
    })
    .catch(err => {
        console.error(`There was an issue sending the message: ${err.data.response.data.title} - ${err.data.response.data.detail}`);
    });
```

### Monitoring

As a best practice, you can [monitor the activity](https://firebase.google.com/docs/extensions/manage-installed-extensions#monitor) of your installed extension, including checks on its health, usage, and logs.

### More resources

- [API Reference](https://developer.vonage.com/en/api/messages-olympus)
- [Developer Documentation](https://developer.vonage.com/en/messages/overview)
- Community Slack: Give us any feedback and ask questions [here](https://developer.vonage.com/slack)