The Vonage messaging extension allows you to easily send SMS, WhatsApp, Facebook Messenger, or Viber messages from your Firebase application using [Vonage Messages API](https://developer.vonage.com/en/messages/overview).

The extension adds a Firebase function that allows you to send a message from either the backend of a Firebase application, or from a client-side application while keeping your credentials secret.

### Things you will need:
- Firebase [cloud Functions](https://console.firebase.google.com/project/_/functions) must be enabled in your project's console. The extension will need this to function properly.
- A Vonage API developer account. If you don't have one, you can sign up on the [Vonage Customer Dashboard](https://ui.idp.vonage.com/ui/auth/registration).
- A Vonage application with messages enabled, and the associated application ID and private key. See the [Vonage Developer Portal](https://developer.vonage.com/en/application/overview) for information on configuring a Vonage application. The private key should be [base64 formatted](https://developer.vonage.com/en/blog/using-private-keys-in-environment-variables).

### Billing
To install an extension, your project must be on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing).

- You will be charged a minimal amount (typically around $0.01/month) for the Firebase resources required by this extension (even if it is not used).
- This extension uses Firebase functionswhich has associated charges if you exceed the service’s no-cost tier:
  - Cloud functions (Node.js 16+ runtime. [See FAQs](https://firebase.google.com/support/faq#extensions-pricing)))
- This extension also uses the Vonage Messages API which has a consumption charge as well as some channel charges. [See Pricing](https://www.vonage.com/communications-apis/messages/pricing/)
