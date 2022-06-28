# Create Multiparty Video Calls with Vonage Video Express

## Summary

With this [Firebase Extension](https://firebase.google.com/docs/extensions), quickly build sophisticated live video apps with many participants using the [Vonage Video Express](https://tokbox.com/developer/video-express/).

## Installation

Via the Firebase console, visit this [link](https://console.firebase.google.com/project/_/extensions/install?ref=vonage%2Ffirestore-vonage-video-express)

Via the [Firebase CLI](https://firebase.google.com/docs/cli), run this command
```
firebase ext:install vonage/firestore-vonage-video-express --project=destination_project_id
```

The Firebase Extension comes packaged with a [demo](https://github.com/Vonage/vonage-firebase-extensions/tree/main/demos/video-express/public) to show the Vonage Video Express in action.

## About Vonage Video Express

Not only does the Vonage Video Express helps remove the complexity of building an application with multiparty video and screenshare, it brings other optimizations.

### Quality Manager

To help create the best quality video call, various methods will be automatically applied like maximizing tile sizes for visible video streams and pausing ones not seen, adjusting resolutions and frame rates depending on network conditions and CPU, and setting higher priorities on speakers and screen shares.

![Graphic showing the larger video feed on the left with a higher resolution and more bitrate and a column of other smaller video feeds to the right with smaller resolution and bitrates.](./qualitymanager.jpeg)

### Experience Manager

Optimizations done on the client-side like muting participants past 10 and reducing bandwidth by requesting smaller streams for smaller sized videos to help increase user experience.

(Unoptimized Video Session)
![Table showing the amount of bandwidth used for audio and video for 1 to 1, 10 videos, and 25 videos in unoptimized sessions.](./unoptimized-video-session.jpeg)

(Optimized Video Session)
![Table showing the amount of bandwidth used for audio and video for 1 to 1, 10 videos, and 25 videos in optimized sessions with as much as 80% lower bandwidth.](./optimized-video-session.jpeg)

### Layout Manager

Automatically adjust the layout of the streams based on screen size and the number of participants.

![Demonstrating the layout changes of colored blocks representing video feeds as they are being added and removed to the screen.](./layoutmanager.gif)
