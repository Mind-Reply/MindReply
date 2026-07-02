import { google } from 'googleapis';

function createOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );
}

export const googleAuth = createOAuth2Client();

export const gmail = google.gmail({
  version: 'v1',
  auth: googleAuth,
});

export const youtube = google.youtube({
  version: 'v3',
  auth: googleAuth,
});
