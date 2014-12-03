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
- And the following in the "plugins" folder
 - CommonMethods.cs
 - Pathfinding.JsonFx.dll 
- For unit test you need to add the following folders (in addition to the above) and their complete contents in "Assets folder"
 - Editor
 - plugins 

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

#### Limitations:
As of now the Heartbeat feature doesn't work on the web player. It has been disabled for now.

#### Usage

##### Init
```UnityScript
var pubnub: PubNub;
pubnub = gameObject.AddComponent(PubNub);
pubnub.Init(pubkey, subkey, seckey, cipher, uuid, secure);

```
Note:The PubNub object should be added as a component of the gameObject. This is required as to start/stop coroutines from within the PubNub class.

##### Settings
```UnityScript

//Resume the request from the last successful time token after internet reconnection
pubnub.resumeOnReconnect = true; //true or false

//Heartbeat retry interval
pubnub.retryInterval = 10; //int

//Heartbeat max retries
pubnub.maxRetries = 50; //int

```

##### SetUuid
```UnityScript
//init pubnub as shown above

pubnub.SetUuid("CustomUUID");
```

##### GetUUID
```UnityScript
//init pubnub as shown above

pubnub.GetUuid();
``` 

##### End (call before quitting the app)
```UnityScript
//init pubnub as shown above

pubnub.End();
``` 

##### Subscribe
```UnityScript
//init pubnub as shown above

var channel = "testChannel";
StartCoroutine(pubnub.Subscribe(channel, false, "", ParseResponseSubscribe, ParseResponsePresence));

//As example ParseResponsePresence and ParseResponseSubscribe are shown below
``` 

##### ParseResponsePresence and ParseResponseSubscribe
```
function ParseResponsePresence( msgs: Array ){
	try{
		if(msgs.length > 2 ){
			Debug.Log("msgs[0].ToString()" + msgs[0].ToString());
			Debug.Log("msgs[1].ToString()" + msgs[1].ToString());
			Debug.Log("msgs[2].ToString()" + msgs[2].ToString());
		
		} else {
			//Debug.Log("ParseResponsePresence msgs length <2");
			Debug.Log("msgs[0].ToString()" + msgs[0].ToString());
			Debug.Log("channel:" + msgs[1].ToString());
			
			var output2:Object[] = JsonReader.Deserialize (msgs[0].ToString()) as Object[];
			if((output2 != null) &&  (output2[1].ToString().Contains("Connected"))){
				Debug.Log("Subscription to presence of " + msgs[1].ToString() + " connected");
			} else if ((output2 != null) &&  (output2[1].ToString().Contains("Already Subscribed"))){
				Debug.Log("Subscription to presence of " + msgs[1].ToString() + " already subscribed");			
			} 
		}
	}catch (err) {
		Debug.Log("ParseResponsePresence:" +err);
	}
}

function ParseResponseSubscribe( msgs: Array ){
	try{
		if((msgs.length> 3) && (msgs[3])){
			Debug.Log("msgs[0].ToString()" + msgs[0].ToString());
			Debug.Log("msgs[1].ToString()" + pubnub.toDateFromEpoch(msgs[1].ToString()));
			Debug.Log("msgs[2].ToString()" + msgs[2].ToString());
			Debug.Log("msgs[3].ToString()" + msgs[3].ToString());
		
			var output3:Object[] = JsonReader.Deserialize (msgs[0].ToString()) as Object[];
			if((output3 != null) &&  (output3[1].ToString().Contains("Internet reconnected"))){
				Debug.Log("Subscription to " + msgs[2].ToString() + " reconnected.");
			} 			
		} else if ((msgs.length> 3) && (!msgs[3])){
			Debug.Log("msgs[0].ToString()" + msgs[0].ToString());
			Debug.Log("msgs[1].ToString()" + pubnub.toDateFromEpoch(msgs[1].ToString()));
			Debug.Log("msgs[2].ToString()" + msgs[2].ToString());
			Debug.Log("msgs[3].ToString()" + msgs[3].ToString());
		
			var output4:Object[] = JsonReader.Deserialize (msgs[0].ToString()) as Object[];
			if((output4 != null) &&  (output4[0].Equals("0"))){
				Debug.Log("Channel: " + msgs[2].ToString() + " " + output4[1]);
			} else if((output4 != null) &&  (output4[0].Equals("2"))){	
				Debug.Log( output4[1] + " " + msgs[2].ToString() );
			}
		} else if (msgs.length > 2 ){
			Debug.Log("msgs[0].ToString()" + msgs[0].ToString());
			Debug.Log("msgs[1].ToString()" + pubnub.toDateFromEpoch(msgs[1].ToString()));
			Debug.Log("msgs[2].ToString()" + msgs[2].ToString());
		
			var cTime:Date = pubnub.toDateFromEpoch(msgs[1].ToString());
			
			var i = msgs.length;
			if(i > 1){
				var subscribeNotification = "Subscribe Response on " + GetDateTimeString(cTime, false) + " for channel '" + msgs[2].ToString() + "'";
				var output:Object[] = JsonReader.Deserialize (msgs[0].ToString()) as Object[];
				Debug.Log(subscribeNotification);
				if(output != null){
					var k = 0;
					for (k = 0; k < output.Length; k++){
						var dict:Dictionary.<String, Object> = output[k] as Dictionary.<String, Object>;
						Debug.Log("username:" + dict["username"].ToString());
						Debug.Log("message:" + dict["message"].ToString());
						
					}
				}				
			}
		} else {
			Debug.Log("msgs[0].ToString()" + msgs[0].ToString());
			Debug.Log("channel:" + msgs[1].ToString());
			
			var output2:Object[] = JsonReader.Deserialize (msgs[0].ToString()) as Object[];
			if((output2 != null) &&  (output2[1].ToString().Contains("Connected"))){
				Debug.Log("Subscription to " + msgs[1].ToString() + " connected");
			} else if ((output2 != null) &&  (output2[1].ToString().Contains("Already Subscribed"))){
				Debug.Log("Subscription to " + msgs[1].ToString() + " already subscribed");			
			}
		}
	}catch (err) {
		Debug.Log("ParseResponseSubscribe:" +err);
	}
}
```

##### Subscribe (with timetoken)
```UnityScript
//init pubnub as shown above

var channel = "testChannel";
var timetoken = "14175807506036443";
StartCoroutine(pubnub.Subscribe(channel, false, timetoken, ParseResponseSubscribe, ParseResponsePresence));

//As example ParseResponsePresence and ParseResponseSubscribe are shown above
``` 

##### Presence
```UnityScript
//init pubnub as shown above

var channel = "testChannel";
StartCoroutine(pubnub.Subscribe(channel, true, "", ParseResponseSubscribe, ParseResponsePresence));

//As example ParseResponsePresence and ParseResponseSubscribe are shown above
``` 

##### Time
```UnityScript
//init pubnub as shown above

StartCoroutine(pubnub.Time(ParseTimeResponse));

//As example ParseTimeResponse is shown below
``` 

##### ParseTimeResponse
```UnityScript
function ParseTimeResponse( msgs: Array ){
	var i = msgs.length;
	for( var msg in msgs ){
		var ts: Int64 = i--;
		Debug.Log(msg.ToString());
		WriteToLogs (msg.ToString(), "Time");
	}
}
```

##### Publish
```UnityScript
//init pubnub as shown above

var channel = "testChannel";
var publishedMessage = "test message";
StartCoroutine(pubnub.Publish(channel, publishedMessage, true, ParsePublishResponse));

//As example ParseDetailedHistoryResponse is shown below
``` 

##### ParsePublishResponse
```UnityScript
function ParsePublishResponse( msgs: Array ){
	var i = msgs.length;
	for( var msg in msgs ){
		var ts: Int64 = i--;
		Debug.Log(msg.ToString());
		//WriteToLogs (msg.ToString(), "Publish Response on " + GetDateTimeString(cTime, false) + " for channel '" + channel + "'");
	}
	var output:Object[] = JsonReader.Deserialize (msgs[0].ToString()) as Object[];
	var cTime:Date = pubnub.toDateFromEpoch(output[2].ToString());

	WriteToLogs (msgs[0].ToString(), "Publish Response on " + GetDateTimeString(cTime, false) + " for channel '" + msgs[1].ToString() + "'");
}

```

##### DetailedHistory
```UnityScript
//init pubnub as shown above

var channel = "testChannel";

//Usage Example 1:
StartCoroutine(pubnub.DetailedHistory(channel, 100, -1, -1, false, ParseDetailedHistoryResponse));

//second parameter: number of messages to fetch, int
//third parameter: start timetoken, int64
//fourth parameter: end timetoken, int64
//fifth parameter: reverse, bool

//Usage Example 2:
var startTimetoken = "14175792736904906";
var endTimetoken = "14175807506036443";
StartCoroutine(pubnub.DetailedHistory(channel, 10, startTimetoken, endTimetoken, false, ParseDetailedHistoryResponse));

//As example ParseDetailedHistoryResponse is shown below
``` 

##### ParseDetailedHistoryResponse
```UnityScript
function ParseDetailedHistoryResponse( msgs: Array ){
	var i = msgs.length;
	for( var msg in msgs ){
		var ts: Int64 = i--;
		Debug.Log(msg.ToString());
		WriteToLogs (msg.ToString(), "DetailedHistory Response");
	}
}
```

##### HereNow
```UnityScript
//init pubnub as shown above

var channel = "testChannel";
StartCoroutine(pubnub.HereNow(channel, ParseHereNowResponse));

//As example ParseHereNowResponse is shown below
``` 

##### ParseHereNowResponse
```UnityScript
function ParseHereNowResponse( msgs: Array ){
	var i = msgs.length;
	if(i>0){
		//var j:json = json.fromString(msgs[0].ToString());
		//var uuids:json = j.getArray("uuids");
		var output:Object = JsonReader.Deserialize (msgs[0].ToString());
		if(output != null){
			var dict:Dictionary.<String, Object> = output as Dictionary.<String, Object>;
			var uuids:Object[] = dict["uuids"] as Object[];
			var k =0;
			users = new Array ();
			for (k=0; k< uuids.Length; k++){
				users.Add(uuids[k]);
			}
			Debug.Log(users.join('\n'));
		}
	}
	for( var msg in msgs ){
		var ts: Int64 = i--;
		Debug.Log(msg.ToString());
	}
	WriteToLogs (msgs[0].ToString() + "," + msgs[1].ToString(), "HereNow Response2");
	enableControls = true;
}
```

##### Unsubscribe
```UnityScript
//init pubnub as shown above

var channel = "testChannel";
StartCoroutine(pubnub.Unsubscribe(channel, false, ParseResponseUnsubscribe));

//As example ParseResponseUnsubscribe is shown below
``` 

##### UnsubscribePresence
```UnityScript
//init pubnub as shown above

var channel = "testChannel";
StartCoroutine(pubnub.Unsubscribe(channel, true, ParseResponseUnsubscribe));

//As example ParseResponseUnsubscribe is shown below
``` 

##### ParseResponseUnsubscribe
```UnityScript
function ParseResponseUnsubscribe( msgs: Array ){
	var i = msgs.length;
	for( var msg in msgs ){
		var ts: Int64 = i--;
		Debug.Log(msg.ToString());
	}
	WriteToLogs (msgs[0].ToString(), "Unsubscribed channel '" + msgs[1].ToString() + "'");
}
```


# Please direct all Support Questions and Concerns to Support@PubNub.com
