const admin = require("firebase-admin");

const serviceAccount = {
  type: "service_account",
  project_id: "marvans-ecom",
  private_key_id: "0df53c6fe8419b53964749358474fddce0c223e0",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDgpJqyZUWZcOzL\ngjENLNhgSD8a0OXND2uAZ67fM3pMrKcflzt3NSpuSZoIcoMMtMAXh0wS4IruD04L\ndB/Pk5YSeYwmqTHAnuY2ZaaE4I8f1ITk6LaHDbP6j0VvPGFJxD71YCPkTj6FVhYU\nOGtlghqnJGIm3cQb2bUG25l65091n0ibP14L+/arIYw6mju/kg6cawwamqeyi3aN\noIslon26exKekAT2NAbr/h6BmnnZHbacP0/Qp9aJEwVUD7US8ZiiP1Irm4zRmijk\nqgURf8lR6sQqnzwHsP/OW/AQcF5cn+iI8FkFQhPm95Da+ce1fLPDTsmxrONkn+wt\nvPrwcdC7AgMBAAECggEAG6hjJtFYKIRM6zYcHZqms0gB2Pvc5zUy+kwJrY+0IDTm\nSKSWh4lDWvEd5qoD9NsGMX9mFYbmzq48tiVLIK6ePKe8DSsp+yS1Lv+vPk863+OK\n+cyluGqup4vfM8r+fBYOMv4YvSxdqeNHnvVep6Xv68yLdxc5D2gWT9dWsK6XoQv1\nyDta41nwrS0cmYThMMG0bDARTW+dcAhxNTHDpJJm7N/brYBAWHEhcoHDA9uDma8+\n5uidX/133JMacq7vrV65L/1LdwZVFMChF/9PLKugVWSW0U3tmRehvzGSE03ModSg\ncRryzdULGPfZOP0S0hn91HOH+uOvFyoX7+Yy9IZ2jQKBgQD7ACYp/1s7nrSLE8FB\nc/35gf9ZRFr5oLPpviMw3OwulwRv196b7GoGnl7DmUjuuPFEV5k/WoJnJrFa73pp\n5czEZzrQTCc6DKrQpDEye7l3OL2bxxy+s5SGPubEj1YjfLRdMAE1KlpNZrRYNNhe\norKqnEe67PLc5a8bhXM/DlkzHQKBgQDlHg7UfzMWJMhy6PxfhW+coOltggrmmkA1\ntyv6YOL/KWylPU0pwKi3v+7+mA21B+An7/wP3FP7u5E36E6NWAliIij5QxbEf1MR\nT78OM2VBzlBMoS89sFWZYgEDmzUKlQEgPCPbfMlnf9i33RPdIBFQCwGmgWQ1sHdM\nIOpEQ+WztwKBgET1HIcLPbBagLV43u4xhMQIn/ORYQEV0nfUIezptQVzvedQQjtK\nLzLUTaqlMTFMpBQnkNWj8xGNwsn94v63AJOw3KqfUWOUWVVq1o1NCn4jm4vxnwcR\nZSugmlvEGWE0gITdjGdj1F1RaxiUpCETx8wxlU9Yi7x+aaZA+pGHSqBNAoGADv2o\ner7X2NsPQnV8DcPtSZI9s6yOiggNq3YQqpEsSQWs1iLsqY6xe1RTjtTkELQzNmm9\nVExWMmJTXhUVDqpz8rfJdoWtN64dAUT2ezdhqKyXFGx3atHex+phpprBHbAiIrnM\nns/LXbo/s8gDRLSUbWhK81oD9H9XTuPYcB8BKIECgYBUcpXytMBjiWHBbRMWeqKp\nOu5Zv6vSsTIjrRYlvm9qilezpZMBb1NSMzfAhCJGdR/9UymqY3kD79AbbYOMvzxu\nLPvA43NdX7ug64j/1OOSAoR0b1dyHBkalb+Xutk60iez3P5UgGyK1PkVU8tNY1Yo\npzfJYhSmVJfrSlqUAHfUnw==\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-9hrr4@marvans-ecom.iam.gserviceaccount.com",
  client_id: "118015399891638543398",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-9hrr4%40marvans-ecom.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://marvans-ecom.firebaseio.com",
  storageBucket: "gs://marvans-ecom.appspot.com",
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { admin, db, bucket };
