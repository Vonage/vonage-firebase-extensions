const { Messages } = require('@vonage/messages');
const { Auth } = require('@vonage/auth');
const functions = require("firebase-functions");

exports.send = functions.https.onCall(async (data, context) => {
  const client = new Messages(new Auth({
    applicationId: process.env.VONAGE_APPLICATION_ID,
    privateKey: Buffer.from(process.env.VONAGE_PRIVATE_KEY_64,
  'base64').toString('ascii')
  }));

  const resp = await client.send(data)
    .then(resp => {
      console.log(resp)
      return resp;
    })
    .catch(err => {
      console.log(err.data)
      return err;
    });

    return resp;
});
