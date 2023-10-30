<!-- 
This file provides your users an overview of your extension. All content is optional, but this is the recommended format. Your users will see the contents of this file when they run the `firebase ext:info` command.

Include any important functional details as well as a brief description for any additional setup required by the user (both pre- and post-installation).

Learn more about writing a PREINSTALL.md file in the docs:
https://firebase.google.com/docs/extensions/publishers/user-documentation#writing-preinstall
-->

This extension allows you to easily send a message such as an SMS, WhatsApp, Facebook Messenger, or Viber message from your Firebase application using the [Vonage Messaging API](https://developer.vonage.com/en/messages/overview).

This extension adds a Firebase Function that allows you to send a Message from either the backend of a Firebase application, or from a client-side application while keeping your credentials secret. 

### Things you will need:

- Firebase [Cloud Functions](https://console.firebase.google.com/project/_/functions) must be enabled in your project's console. The extension will need this to function properly.

- A Vonage API Developer Account. If you don't have one, you can sign up at the [Vonage Customer Dashboard](https://ui.idp.vonage.com/ui/auth/registration).

- A Vonage Application with Messages enabled, and the associated Application ID and Private Key. See the [Vonage Developer Portal](https://developer.vonage.com/en/application/overview) for information on configuring a Vonage Application. The Private Key should be [base64 formatted](https://developer.vonage.com/en/blog/using-private-keys-in-environment-variables).

<!-- We recommend keeping the following section to explain how billing for Firebase Extensions works -->
### Billing

To install an extension, your project must be on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing)

- You will be charged a small amount (typically around $0.01/month) for the Firebase resources required by this extension (even if it is not used).
- This extension uses Firebase Functions, which have associated charges if you exceed the service’s no-cost tier:
  - Cloud Functions (Node.js 16+ runtime. [See FAQs](https://firebase.google.com/support/faq#extensions-pricing))
- This extension also uses the Vonage Messages API which has a consumption charge as well as some channel charges. [See Pricing](https://www.vonage.com/communications-apis/messages/pricing/)



