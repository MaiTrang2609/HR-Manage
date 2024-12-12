const { google } = require("googleapis");

// const CREDENTIALS = process.env.CREDENTIALS;
const CREDENTIALS = {
  type: "service_account",
  project_id: "hr-manager-service-gem",
  private_key_id: "67d65ff1c176837fb1c6eb6251721c573fb82558",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC9FNZb18p4DVyd\nL9DoGogOQS5MFC25Toww1zwTBhHgA04EVgwFQTFysvbDMuZeiDwCumnXjDFcikas\n3B73UgRH9G+3N0iY2FxIUP6y9WgXwM/Smt+8g66QstsmijyPeH+YpIV5iXAzDd7Z\nF6De4K5x7Q2RmdpzAYlO6UoGHxuDq6Ypzte9NskPMPANLIhwpqfVlZ24UAGZQaiq\noFKP2pGh3NyJTyzmrkpRhWWN8+wfCb2qztIC6y4mDu/9X7yKWBjyq7JqrQJLs3ND\nqrWmuU8O8plNhAFVp9uhZGMXodsXTWv3e6WJzURiTomu2jx0pEb87UoqtIOdkrPh\nP8yzLOczAgMBAAECggEAHSz4cJ6JCuJA7q5ApXfmk5CCNNIORiA1KJollmfi3TaV\nVLz0SOFI4IJ16iPSATczT1Z1W4Gx4i4h/q1Oh+obaADzNgmtRYxpHO2Gh5WvdK7X\nQo+MQ3nsNz6p6zX8Z0T4J1UHlXvcGLykrMnlFE8GC+VAqT1cxE8x4T/FINGu/K98\n5Y5VToHr+t8L6Q9w15rqqZ71RIH04a97m8MyPjAxYdQnOpi6A/t/Am4VOmYp1q7y\n9TDmjqnUKu7bYeHzmcOY/QuNk0j0LvOW5j4i32E4YCPQGB+WVeH8wvhzL8d8DVjs\nAfL0+7tpNB4hBQz4Z3i6BLYLoqUjtDakT9IZb7MJuQKBgQD4NFCM8AwVK43PpJMR\n7zM1Ah9x3Uh7JWGUb8FHilAbSMt15Kb3qb7t61ZdzLqlmXLk0edGePBDGF2MpnnV\nCu3+0xeqmEqFCG5frOi8ddwcg7flrLC7I42X5473NlSQN/b1oI2CHsuiUGdNGNDl\n2/ypRqaMySPeIe7Dr2pFqoTT6wKBgQDDBSUcNnwkW3QSN3qk5QWS4wPGVG945ItH\nPx3TGnCwjAoLoPMTKJGRfKyGwvklY1sWQifwz5MUWT7apNkILJc7j6XJPynVrbNg\n7lwtlI2P3zUtUe0FU4XtLJ6/zo069BJRQY1sXyLfosLXs1BSv/dIg+j9IfQgV2SW\nGUsSdl+P2QKBgEp62FkSh22q3ikbB47wKnuToX/3mRJrCzcRufwPwy4M0BEWhgv3\ngfW/EvGex7t9qn6DhlUdYWug2iGkqxaE6xn2mjl07ZeyCfzn1AcJjv13gS2IfpgJ\neSnGMJ56TTHhuVfHz+7l8tFIM1dtRPJU6yKYss24Zez4Xb+W2dsB6k31AoGAUWs3\neBTjNUadKfHRmUAoWI/Ahq+/rkg0QbV/HSBfxcVheENk2C3KwGO9n7GM1OgrIhrS\nk/4FWKx9ykiid4AuT2aEf4WIULZpOmGpSDpJ87PrfpVCkEOzmTZUvJ1eZyt47kWg\n5oq9g4JvOCCbu0B72+F+hxgC1PHHg8bhib6z3NkCgYAubbtGX9fDeC6mUOx0e8jL\ntW3lZJHIC7d27cBSdPLXmVJSopEYKiDC/+StzhQ2HGPmlm3f7yGD4CfAnz+H6787\nv231Ak30xgpF6Y+fGhYK7F/nWvS2Qr85GkFNJ2vmWgTvWmxP2YC5VJS+iv++sRe+\nPSy/mg4z/59FOP+LaUo9uA==\n-----END PRIVATE KEY-----\n",
  client_email: "hr-manager-service-gem@appspot.gserviceaccount.com",
  client_id: "115372202944369946864",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/hr-manager-service-gem%40appspot.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/calendar",
];

const auth = new google.auth.JWT(
  CREDENTIALS.client_email,
  null,
  CREDENTIALS.private_key,
  SCOPES,
  "hiepnh.fk@gmail.com"
);

const calendar = google.calendar({ version: "v3" });
const event = {
  summary: "Meeting",
  location: "Office",
  description: "Meeting to discuss collaboration",
  start: {
    dateTime: "2024-07-24T10:00:00",
    timeZone: "Asia/Ho_Chi_Minh",
  },
  end: {
    dateTime: "2024-07-24T11:00:00",
    timeZone: "Asia/Ho_Chi_Minh",
  },

  // attendees: [
  //   { email: "hiepnh.fk@gmail.com" },
  //   { email: "dequangnguyenxa@gmail.com" },
  // ],
  // reminders: {
  //   useDefault: false,
  //   overrides: [
  //     { method: "email", minutes: 24 * 60 },
  //     { method: "popup", minutes: 10 },
  //   ],
  // },
  // attendees: [
  //   {
  //     email: "hiepnh.fk@gmail.com",
  //     displayName: "hiepNH",
  //     optional: true,
  //     responseStatus: "needsAction",
  //   },
  //   {
  //     email: "duytu097@gmail.com",
  //     displayName: "TuNT",
  //     optional: true,
  //     responseStatus: "needsAction",
  //   },
  // ],
};

// Insert new event to Google Calendar
const insertEvent = async () => {
  try {
    let response = await calendar.events.insert({
      auth: auth,
     
      calendarId: "primary",
      resource: event,
    });

    if (response["status"] == 200 && response["statusText"] === "OK") {
      return 1;
    } else {
      return 0;
    }
  } catch (error) {
    console.log(`Error at insertEvent --> ${error}`);
    return 0;
  }
};

const deleteEvent = async (eventId) => {
  try {
    let response = await calendar.events.delete({
      auth: auth,
      // calendarId: "hiepnh.fk@gmail.com",
      calendarId: "primary",
      eventId: eventId,
    });

    if (response.data === "") {
      return 1;
    } else {
      return 0;
    }
  } catch (error) {
    console.log(`Error at deleteEvent --> ${error}`);
    return 0;
  }
};

module.exports = { insertEvent, deleteEvent };
