#pragma strict

import System;
import System.Collections.Generic;

var pubkey = 'demo';
var subkey = 'demo';
var seckey = 'demo';
var secure = false;
var channel = 'mainchat';

var messages: SortedList.<Int64, String>;
var scrollpos: Vector2;
var input: String;
var username: String;
var newname: String;
var started = false;
var theFont: Font;
var lh = Screen.height/20; // label height
var someInt : int = 20;
var send : Texture2D;
var background : Texture2D;
var background2 : Texture2D;
var bt_Texture : Texture2D;
var chatMessages : String;
var connectedUsers : String;
var logs : String;
var users: Array;
var connectedUsersScroll : Vector2 = Vector2.zero;
var messagesScroll : Vector2;

var scrollViewVector : Vector2 = Vector2 (scrollPosition.x, Mathf.Infinity);

var showPublishWindow = false;
var showAdvanced = false;
var enableControls = false;
var connectInit = false;
var connectTitle = "Connect";

var scrollPosition : Vector2 = Vector2.zero;
var windowRect : Rect = Rect (20, 20, 280, 150);
var publishedMessage = "";
var messageToChat = "";

var pubnub: PubNub;

var textAreaStyle : GUIStyle;

function Start(){
	users = new Array ();
	newname = username;
	messages = new SortedList.<Int64, String>();
	
	pubnub = gameObject.AddComponent(PubNub);
	var flo = UnityEngine.Random.Range(0,99);		
	var dec = parseInt(flo);
	
	var uuid = GetUserID();
	
	pubnub.Init(pubkey, subkey, seckey, "", uuid, secure);
	
	username = pubnub.GetUuid();
	
	enableControls = true;
}

function GetUserID():String{
	var flo = UnityEngine.Random.Range(0,99);		
	var dec = parseInt(flo);
	
	var uuid = "user" + dec.ToString();
	return uuid;	
}

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

function ParseResponseUnsubscribe( msgs: Array ){
	var i = msgs.length;
	for( var msg in msgs ){
		var ts: Int64 = i--;
		Debug.Log(msg.ToString());
	}
	WriteToLogs (msgs[0].ToString(), "Unsubscribed channel '" + msgs[1].ToString() + "'");
}

function ParseTimeResponse( msgs: Array ){
	var i = msgs.length;
	for( var msg in msgs ){
		var ts: Int64 = i--;
		Debug.Log(msg.ToString());
		WriteToLogs (msg.ToString(), "Time");
	}
}

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
			connectedUsers = users.join('\n');
		}
	}
	for( var msg in msgs ){
		var ts: Int64 = i--;
		Debug.Log(msg.ToString());
	}
	WriteToLogs (msgs[0].ToString() + "," + msgs[1].ToString(), "HereNow Response2");
	enableControls = true;
}

function ParseDetailedHistoryResponse( msgs: Array ){
	var i = msgs.length;
	for( var msg in msgs ){
		var ts: Int64 = i--;
		Debug.Log(msg.ToString());
		WriteToLogs (msg.ToString(), "DetailedHistory Response");
	}
}

function WriteToLogs(msg: String, forWhat: String){
	var cLogs = forWhat + ":\n";
	cLogs += msg;
	cLogs += "\n\n";
	logs = cLogs + logs;
}

function GetChannelUserDiaplayVal(channel: String, user: String): String{
	var cMessages = "<" + channel + "> ";
	cMessages += user;
	return cMessages;
}

function GetDateTimeString (cTime: System.DateTime, onlyTime: Boolean): String{
	if(onlyTime){
		return String.Format("{0:D2}:{1:D2}:{2:D2}", cTime.Hour, cTime.Minute, cTime.Second);
	} else {
		return cTime.ToString("dddd dd MMMM HH:mm:ss (UTC)");
	}
}

function ParseResponsePresence( msgs: Array ){
	try{
		if(msgs.length > 2 ){
			Debug.Log("msgs[0].ToString()" + msgs[0].ToString());
			Debug.Log("msgs[1].ToString()" + msgs[1].ToString());
			Debug.Log("msgs[2].ToString()" + msgs[2].ToString());
		
			StartCoroutine(pubnub.HereNow(msgs[2].ToString(), ParseHereNowResponse));		
		} else {
			Debug.Log("ParseResponsePresence msgs length <2");
		}
	}catch (err) {
		Debug.Log("ParseResponseSubscribe:" +err);
	}
}

function ParseResponseSubscribe( msgs: Array ){
	try{
		if(msgs.length > 2 ){
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
					var k =0;
					for (k=0; k< output.Length; k++){
						var dict:Dictionary.<String, Object> = output[k] as Dictionary.<String, Object>;
						Debug.Log("username:" + dict["username"].ToString());
						Debug.Log("message:" + dict["message"].ToString());
						var cMessages = "(" + GetDateTimeString(cTime, true) + ") ";
						cMessages += "<" + dict["username"].ToString() + "> ";
						cMessages += dict["message"].ToString();						
						cMessages += "\n";
						chatMessages = cMessages + chatMessages;
					}
				}				
			}
		} else {
			Debug.Log("ParseResponseSubscribe msgs length <2");
		}
	}catch (err) {
		Debug.Log("ParseResponseSubscribe:" +err);
	}
}

var output = "";
var stack= "";
function OnEnable () {
	Application.RegisterLogCallback(HandleLog);
}
function OnDisable () {
	// Remove callback when object goes out of scope
	Application.RegisterLogCallback(null);
}
function HandleLog (logString : String, stackTrace : String, type : LogType) {
	output = logString;
	stack = stackTrace;
	Debug.Log("output:"+output);
	Debug.Log("stack:"+stack);
}

// boolean variable to decide whether to show the window or not.
// Change this from the in-game GUI, scripting, the inspector or anywhere else to
// decide whether the window is visible
var doWindow0 : boolean = true;
 
// Make the contents of the window.
function DoWindow0 (windowID : int) {
 
}

function DoPublishWindow (windowID : int) {
	GUI.backgroundColor = new Color(1,1,1,1);
	GUI.Label (new Rect (10, 10,100,20), "Message");

	publishedMessage = GUI.TextArea (new Rect (110, 25, 150, 60), publishedMessage, 2000);
	if (GUI.Button (new Rect (30, 100, 100, 30), "Publish")){
	
		StartCoroutine(pubnub.Publish(channel, publishedMessage, true, ParsePublishResponse));
		showPublishWindow = false;
	}
	if (GUI.Button (new Rect (150, 100, 100, 30), "Cancel")){
		showPublishWindow = false;
	}
	GUI.backgroundColor = new Color (1, 1, 1, 1);
}

function OnGUI(){
	if(showAdvanced){
		if(showPublishWindow){
			windowRect = GUI.ModalWindow (0, windowRect, DoPublishWindow, "Publish");	
		}
		GUI.backgroundColor = new Color (1, 1, 1, 1);	
		GUI.Label (new Rect (10, 10,100,20), "Channel");

		channel = GUI.TextField (Rect (120, 10, 200, 20), channel, 25);

		if (GUI.Button (Rect (500,7,130,30), "Chat View")) {		
			showAdvanced = !showAdvanced;
		}
		
		if (GUI.Button (Rect (10,40,150,40), "Subscribe")) {
			GUI.enabled = false;
			StartCoroutine(pubnub.Subscribe(channel, false, ParseResponseSubscribe, ParseResponsePresence));
			GUI.enabled = true;		
		}
		if (GUI.Button (Rect (170,40,150,40), "Publish")) {
			showPublishWindow = true;
		}
		if (GUI.Button (Rect (330,40,150,40), "Presence")) {
			StartCoroutine(pubnub.Subscribe(channel, true, ParseResponseSubscribe, ParseResponsePresence));
		}
		if (GUI.Button (Rect (490,40,150,40), "Time")) {
			StartCoroutine(pubnub.Time(ParseTimeResponse));
		}
		if (GUI.Button (Rect (10,90,150,40), "Detailed History")) {
			StartCoroutine(pubnub.DetailedHistory(channel, 10, -1, -1, false, ParseDetailedHistoryResponse));
		}
		if (GUI.Button (Rect (170,90,150,40), "Here Now")) {
			StartCoroutine(pubnub.HereNow(channel, ParseHereNowResponse));
		}
		if (GUI.Button (Rect (330,90,150,40), "Unsubscribe")) {
			StartCoroutine(pubnub.Unsubscribe(channel, false, ParseResponseUnsubscribe));
		}
		if (GUI.Button (Rect (490,90,150,40), "Unsubscribe Presence")) {
			StartCoroutine(pubnub.Unsubscribe(channel, true, ParseResponseUnsubscribe));
		}

		GUI.Label (new Rect (10, 160,100,30), "Connected users");
	
		GUI.TextArea(Rect (10, 200, 300, 200), connectedUsers);

		GUI.Label (new Rect (400, 160,100,30), "Messages");	
		GUI.TextArea(new Rect(400, 200, 300, 200), chatMessages);
	
		GUI.Label (new Rect (10, 400,100,30), "Logs");
		logs = GUI.TextArea(new Rect(10, 430, 690, 150), logs);
	} else {
		GUI.backgroundColor = new Color (1, 1, 1, 1);	
		if(connectInit){
			GUI.enabled = false;
		} else {
			GUI.enabled = enableControls;
		}
		GUI.Label (new Rect (10, 10,100,20), "Screen Name");
		username = GUI.TextField (Rect (120, 10, 200, 20), username, 25);
		GUI.enabled = true;
		if (GUI.Button (Rect (330,7,150,25), connectTitle)) {
			if(connectTitle.Equals("Connect")){
				pubnub.SetUuid(username);
				StartCoroutine(Subscribe(channel));
				connectTitle = "Disconnect";
				connectInit = true;
			} else {
				StartCoroutine(Unsubscribe(channel));
				connectTitle = "Connect";
				connectInit = false;
			}
		}
		
		if (GUI.Button (Rect (500,7,130,25), "Advanced View")) {		
			showAdvanced = !showAdvanced;
		}
						
		GUI.Label (new Rect (10, 40,100,30), "Connected users");
	
		GUI.TextArea (Rect (10, 80, 300, 420), connectedUsers);

		GUI.Label (new Rect (400, 40, 100,30), "Messages");	
		GUI.TextArea(new Rect(400, 80, 300, 420), chatMessages);
		
		if(connectInit){
			GUI.enabled = enableControls;
		} else {
			GUI.enabled = false;
		}
		messageToChat = GUI.TextArea(new Rect(10, 530, 590, 50), messageToChat);
		
		if (GUI.Button (Rect (610, 530, 90, 50), "Send \nMessage")) {
			/*var json_obj = json._object(); // new empty object
			
			json_obj._set("username", json._string(username)); 	
			json_obj._set("message", json._string(messageToChat)); 	
			
			var messageToSend = json_obj.stringify();*/
			var messageToSend:Hashtable = new Hashtable();
			messageToSend["username"] = username;
			messageToSend["message"] = messageToChat;
			StartCoroutine(pubnub.Publish(channel, messageToSend, false, ParsePublishResponse));
			messageToChat = "";
		}
	}
}

function Subscribe(ch:String){
	enableControls = false;
	StartCoroutine(pubnub.Subscribe(ch, true, ParseResponseSubscribe, ParseResponsePresence));
	yield WaitForSeconds(2);
	StartCoroutine(pubnub.Subscribe(ch, false, ParseResponseSubscribe, ParseResponsePresence));
	yield WaitForSeconds(2);
	StartCoroutine(pubnub.HereNow(channel, ParseHereNowResponse));
}

function Unsubscribe(ch:String){
	enableControls = false;
	StartCoroutine(pubnub.Unsubscribe(ch, false, ParseResponseUnsubscribe));
	yield WaitForSeconds(2);
	StartCoroutine(pubnub.Unsubscribe(ch, true, ParseResponseUnsubscribe));
	yield WaitForSeconds(2);
	StartCoroutine(pubnub.HereNow(ch, ParseHereNowResponse));
}