import fetch from 'node-fetch';

const sendNotification = async () => {
  try {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        to: 'ExponentPushToken[e1Qno4Ivtn5QXdkMyzzzd6]',
        sound: 'default',
        title: 'MUIE',
        body: 'sa iti dau muie',
      }),
    });

    console.log('success');
  } catch (err) {
    console.log(err);
  }
};
//ExponentPushToken[pNxtPFKBaCpS7TWTOo9Re1]
sendNotification();
