Use this extension to quickly add multiparty video chats to your application using the [Vonage Video Express](https://tokbox.com/developer/video-express/).

This extension will create rooms `/rooms/{roomId}` in Firestore and with Functions, generate credentials needed to participate in the video chats.

### Things you will need:

- Firebase Functions and Firestore must be enabled in your project's console. The extension will need these to function properly.

- a Vonage Video Account. If you don't have one, you can sign up at the [Video API Dashboard](https://tokbox.com/account).

- Project API Key and Secret. In the left-side menu of the [dashboard](https://tokbox.com/account), click `Projects` and select a previous project or create a new one to view the API Key and Secret.

  ![Screenshot of account add-ons dashboard](./projects-dashboard-screenshot.jpg)
  ![Screenshot of account add-ons dashboard](./project-api-key-secret-screenshot.jpg)

- Video Express add-on. Click Account Settings in the left-side menu. In the list of Account add-ons, find Video Express and click Add to account. Then follow the remaining instructions to enable the add-on.
  
  ![Screenshot of account add-ons dashboard](./account-add-ons-screenshot.jpg)

