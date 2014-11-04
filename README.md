# Please direct all Support Questions and Concerns to Support@PubNub.com

## PubNub 3.4 Web Data Push Cloud-Hosted API using UnityScript
### Supports PC, Mac, Linux, WebPlayer 
### testing pending for iOS and Android

#### Features
- Subscribe
- Presence
- HereNow
- Detailed History
- Time
- Unsubscribe
- UnsubscribePresence

More features coming soon.

#### How to run the example
##### Run the example: 

- Create a new project in the Unity Editor.
- Add the following files to the "Assets" folder of the project:
 - JSONParse.js
 - protocol.js
 - Pubnub.js
 - Chat.js
 - ChatScene.unity

- Open the scene "ChatScene" from the "Project" tab -> Assets view. Make sure that the file 'Chat.js' is added as a script to the scene.
- From the "File" menu select "Build Settings":
 - In the "Build Settings" window select "Platform" say "PC, Mac and Linux Standanlone".
 - Choose a "Target Platform" say "Mac OS X".
 - Click "Build And Run".
 - Save the application.
 - Choose a "Screen Resolution"/"Graphic Quality" and click "Play".

- In the application: 
 - Enter a unique "Screen Name", or keep the default one. 
 - Click "Connect".
 - When connected the bottom most text area and the "Send message" button will be enabled. 
 - At this point you will see the "Connected users".
 - Enter a message and click "Send Message".
 - The message will the displayed under the "Messages", in the format:
  - (time of message) <screen name> <message>
  - e.g. (14:15:35) <user40> hi there

- Repeat the same steps on another machine or install the app on a device.

# Please direct all Support Questions and Concerns to Support@PubNub.com
