const functions = require('firebase-functions');
const {google} = require('googleapis');

exports.updateVideo = functions.pubsub.schedule('every 10 minutes').onRun(async () => {
  const authClient = new google.auth.OAuth2({
    clientId: '778779465616-2lnl9qk8qn607ps87a0n155onp610urc.apps.googleusercontent.com',
    clientSecret: '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',
  });

  authClient.setCredentials({
    // in the video I used a sample (expired) token that will not work anymore
    refresh_token: 'AIzaSyAlSrWwtjzYAmhMOoN9eTJT0iash8T0uW8',
  });

  const youtube = google.youtube({
    auth: authClient,
    version: 'v3',
  });

  const videoId = 'qqnmvKwBa9A';

  const videoResult = await youtube.videos.list({
    id: videoId,
    part: 'snippet,statistics',
  });

  const {statistics, snippet} = videoResult.data.items[0];

  const newTitle = `Video Ini = (View: ${statistics.viewCount}, Like: ${statistics.likeCount})`;

  console.log(newTitle);

  // this if statement helps to save on quota if the title has not changed
  if (snippet.title !== newTitle) {
    snippet.title = newTitle;

    await youtube.videos.update({
      part: 'snippet',
      requestBody: {
        id: videoId,
        snippet,
      },
    });
  }

  console.log('Done!');
});
