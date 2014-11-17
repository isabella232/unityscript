#pragma strict
import Pathfinding.Serialization.JsonFx;
import System.Collections.Generic;
import System.Text;
import System.Threading;


class PubNub extends MonoBehaviour{
	var host = "pubsub.pubnub.com";
	var puburl = "publish";
	var suburl = "subscribe";
	var hurl = "v2";
	var turl = "time/0";
	var pubkey = "";
	var subkey = "";
	var seckey = "";
	var cipherkey = "";
	var ssl = false;
	var limit = 1800;
	var channels = {};
	var chArr = new Array ();
	var NULL = '0';
	var timetoken = NULL;
	var uuid = "";
	var channelUpdateLock = false;
	var retryInterval = 10; //sec
	var heartBeatRunning = false;
	private var builder: System.Text.StringBuilder;
	var thdHeartbeat:Thread;
	var disableHeartbeat = true;
	var isTest = false;
	var pnsdk = "pnsdk=PubNub-UnityScript/3.4";
	
	function PubNub(){
		builder = new System.Text.StringBuilder();
	}
	
	private function Request( url: Array , q:Array){
		var scheme = ssl && 'https://' || 'http://';
		var jurl =  scheme + host + '/' + url.Join('/');
		if(q!=null){
			jurl += "?" + q.Join('&'); 
		}
		Debug.Log("url:" + jurl);
		return WWW(jurl);
	}	
	
	function GetHex (decimal : int) {
		var alpha = "0123456789abcdef";
		var out = "" + alpha[decimal];
		return out;
	};
	
	function S4() {
		var ret = "";
		var i = 0;
		for(i=0; i<=3; i++){
			var flo = Random.Range(0,15);		
			var dec = parseInt(flo);
			ret += GetHex(dec);
		}		
		return ret;
	};

	function Guid() {
	  return S4() + S4() + '-' + S4() + '-' + S4() + '-' +
	         S4() + '-' + S4() + S4() + S4();
	}
	
	function Md5Sum(strToEncrypt: String)
	{
		var encoding = System.Text.UTF8Encoding();
		var bytes = encoding.GetBytes(strToEncrypt);
 
		// encrypt bytes
		var md5 = System.Security.Cryptography.MD5CryptoServiceProvider();
		var hashBytes:byte[] = md5.ComputeHash(bytes);
 
		// Convert the encrypted bytes back to a string (base 16)
		var hashString = "";
 
		for (var i = 0; i < hashBytes.Length; i++)
		{
			hashString += System.Convert.ToString(hashBytes[i], 16).PadLeft(2, "0"[0]);
		}
 
		return hashString.PadLeft(32, "0"[0]);
	}
	
	function SetUuid(guid:String){
		uuid = guid;
	}
	
	function GetUuid():String{
		return uuid;
	}
	
	function Init(publishKey: String, subscribeKey: String, secretKey: String, cipher: String, nuuid: String, sslOn: boolean){
		pubkey = publishKey;
		subkey = subscribeKey;
		seckey = secretKey;
		cipherkey = cipher;
		ssl = sslOn;
		uuid = nuuid;
		if(uuid == ""){
			uuid = Guid();
		}
	}
	
	private function Escape( msg: String ): String { return WWW.EscapeURL(msg); }
	private function UnEscape( msg: String ): String { return WWW.UnEscapeURL(msg); }
	//private function Wrap( msg: String ): String{ return Escape('"'+msg+'"'); }
	
	function IsSubKeyInvalid(cb: Function):boolean{
		if((subkey == null) || (subkey == "")){
			cb( ["[\"Invalid Subscribe Key\"]"] );
			return true;
		} else {
			return false;
		}
	}

	function IsChannelInvalid(channel:String, cb: Function):boolean{
		if((channel == null) || (channel == "")){
			cb( ["[\"Invalid Channel\"]", channel] );
			return true;
		} else {
			return false;
		}
	}

	function IsMessageInvalid(message:Object, cb: Function, channel:String):boolean{
		if((message == null) || (message.ToString() == "")){
			cb( ["[\"Invalid Message\"]", channel] );
			return true;
		} else {
			return false;
		}
	}

	//TODO:Accept objects
	function Publish( channel: String, objectToSerialize: Object, sendAsIs: boolean, cb: Function ){
		var msg: String;
		if((pubkey == null) || (pubkey == "")){
			cb( ["[\"Invalid Publish Key\"]"] );
			return;
		}
		
		if(IsSubKeyInvalid(cb)){			
			return;
		}
		
		if(IsChannelInvalid(channel, cb)){
			return;
		}
		
		if(IsMessageInvalid(objectToSerialize, cb, channel)){
			return;
		}		
		
		if(sendAsIs){
			msg = objectToSerialize.ToString();
		}else {
			msg = JsonWriter.Serialize (objectToSerialize);
		}
		channel = Escape(channel);
		if(this.cipherkey!=""){
			var pubnubCrypto:PubnubCrypto = new PubnubCrypto(this.cipherkey);
			var origmsg = msg;
			msg = pubnubCrypto.Encrypt(msg);
			msg = JsonWriter.Serialize (msg);
			Debug.Log("pubnubCrypto.Encrypt:" + origmsg +":"+ msg);
		}
		msg = Escape(msg);
		Debug.Log("msg: " + msg);
		
		var w: WWW = null;
		var backoff = 0;
		try{
			var signature:String = "0";
			if (this.seckey.Length > 0) {
                var stringToSign:StringBuilder = new System.Text.StringBuilder();
                stringToSign
					.Append (this.pubkey)
					.Append ('/')
					.Append (this.subkey)
					.Append ('/')
					.Append (this.seckey)
					.Append ('/')
					.Append (channel)
					.Append ('/')
					.Append (msg); // 1

                // Sign Message
                signature = Md5Sum (stringToSign.ToString ());
            }
			w = Request([puburl, pubkey, subkey, signature, channel, 0, msg], ["uuid=" + uuid, pnsdk]);
		} catch(err) {
			Debug.Log("Publish Error:" + err);
			return;
		}	
					
		//yield w;
		if(!isTest){
			yield w;
		} else {
			while(!w.isDone){
				Debug.Log("waiting");
			}
		}
	
		if( w.error ){
			Debug.Log( w.error );
			if( backoff < 1 ) backoff += 0.1;
			yield WaitForSeconds( backoff );
			
		} else {
			try{
				var output:Object[] = JsonReader.Deserialize (w.text) as Object[];
				 
				var lTimetoken = "";
				if(output.Length >2){
					lTimetoken = output[2] as String;
					//Debug.Log("output:"+ output[2]);	
				}
				cb( [w.text, channel] ); 
			} catch(err) Debug.Log("Publish Error2:" +err);
			return; 
		}
	}
	
	function Decrypt(pubnubCrypto: PubnubCrypto, jsonObject:Object): Object{
		try
		{
			var message:String = jsonObject as String;
			if(message != null){
				Debug.Log("Decrypt message: " + message);
				var parsed:String = pubnubCrypto.Decrypt(message);
				var returnObj = JsonReader.Deserialize(parsed);
				return returnObj;	
			} else {
				return jsonObject;	
			}
		} catch (err) {
			Debug.Log("Decrypt error: " + err);
			return jsonObject;	
		}	
	}

	function DetailedHistory( channel: String, count:int, start:long, end:long, reverse:boolean, cb: Function ){
		
		if(IsSubKeyInvalid(cb)){			
			return;
		}
		
		if(IsChannelInvalid(channel, cb)){
			return;
		}
		
		channel = Escape(channel);
		
		if (count <= -1) count = 100;

		var paramString = "";
		if (reverse) {
			var reverseString = "reverse=" + reverse.ToString().ToLower ();
			paramString = reverseString;
		}
		if (start != -1) {
			var startString = "start=" + start.ToString().ToLower();
			if(paramString != ""){
				paramString += "&" + startString;
			} else {
				paramString += startString;
			}
		}
		if (end != -1) {
			var endString = "end=" + end.ToString().ToLower();
			if(paramString != ""){
				paramString += "&" + endString;
			} else {
				paramString += endString;
			}
		}
		
		var backoff = 0;
		var w = Request([hurl, "history", "sub-key" , subkey, "channel", channel], ["count=" + count, "uuid=" + uuid, pnsdk, paramString ]);
		//yield w;
		if(!isTest){
			yield w;
		} else {
			while(!w.isDone){
				Debug.Log("waiting");
			}
		}		
	
		if( w.error ){
			Debug.Log( w.error );
			if( backoff < 1 ) backoff += 0.1;
			yield WaitForSeconds( backoff );
			
		} else { 
			if(this.cipherkey!=""){
				Debug.Log("w.text"+w.text);
				var pubnubCrypto:PubnubCrypto = new PubnubCrypto(this.cipherkey);
				
				var output:Object[] = JsonReader.Deserialize (w.text) as Object[];
		
				//var timetoken1:double;
				var t1: System.Double;
				//var timetoken2:double;
				var t2: System.Double;
				if(output.Length >1){
					//timetoken1 = output[1];
					System.Double.TryParse( output[2].ToString(), t1 );
				}
				if(output.Length >2){
					//timetoken2 = output[2];
					System.Double.TryParse( output[2].ToString(), t2 );	
				}

				var returnArray = new ArrayList();
				var output2:Object[] = output[0] as Object[];
				var k =0;
				for (k=0; k< output2.Length; k++){
					var decrypted = Decrypt(pubnubCrypto, output2[k]);
					returnArray.Add(decrypted);
				}
				
				var returnArrayFinal = new ArrayList();
				returnArrayFinal.Add(returnArray);
				if(output.Length >1){
					returnArrayFinal.Add(t1);
				}
				if(output.Length >2){
					returnArrayFinal.Add(t2);
				}
				cb( JsonWriter.Serialize(returnArrayFinal) ); 
			} else {
				cb( UnEscape(w.text) ); 
			}
			return; 
		}
	}
	
	function yieldOrWait(w:WWW){
		if(!isTest){
			yield w;
		} else {
			while(!w.isDone){
				Debug.Log("waiting");
			}
		}
	}

	function Time (cb: Function){
		var backoff = 0;
		var w = Request([turl], ["uuid=" + uuid, pnsdk]);

		if(!isTest){
			yield w;
		} else {
			while(!w.isDone){
				Debug.Log("waiting");
			}
		}
		
		if( w.error ){
			Debug.Log( w.error );
			if( backoff < 1 ) backoff += 0.1;
			yield WaitForSeconds( backoff );
			
		} else { 
			Debug.Log("Return:" + w.text);
			cb( w.text ); return; 
		}		
	}

	function HereNow( channel: String, cb: Function ){
		if(IsSubKeyInvalid(cb)){			
			return;
		}
		
		if(IsChannelInvalid(channel, cb)){
			return;
		}
			
		channel = Escape(channel);
		var w: WWW = null;
		var backoff = 0;
		try{		
			w = Request([hurl, "presence", "sub-key" , subkey, "channel", channel], ["uuid=" + uuid, pnsdk]);
		} catch(err) {
			Debug.Log("Herenow Error:" +err);
			return;
		}	
		yield w;
	
		if( w.error ){
			Debug.Log( w.error );
			if( backoff < 1 ) backoff += 0.1;
			yield WaitForSeconds( backoff );
			
		} else { 
			cb( [w.text, channel] ); 
			return; 
		}
	}
	
	function Subscribe( channel: String, isPresence: boolean, cb: Function, cbPresence: Function){
		if(IsChannelInvalid(channel, cb)){
			return;
		}
	
		if(isPresence){
			channel +="-pnpres";
			if(IsSubKeyInvalid(cbPresence)){			
				return;
			}
		} else if(IsSubKeyInvalid(cb)){			
			return;
		}		
		
		if(channelUpdateLock){
			Debug.Log("Processing....");
			return;
		}

		try{
			channelUpdateLock = true;
			for (var value in chArr) {
				if(value == channel){
					Debug.Log("Channel already subscribed ");
					return;
				}
			}
		
			var chLen = chArr.length;
		
			chArr.Add(channel);
			if(chLen >= 1){
				StopCoroutine("SubLoop");
			}
		}catch(err) {
			channelUpdateLock = false;			
			Debug.Log("channelUpdate:" + err);
			return;
		} finally {
			channelUpdateLock = false;
		}
		var cbArr = [cb, cbPresence];
		StopHeartbeat();
		yield StartCoroutine("SubLoop", cbArr);

	}
		
	function toDateFromEpoch(lTimetoken: String){
		if( lTimetoken == ""){
			return System.DateTime.Now;
		}
		var dDate: System.DateTime = new DateTime(1970, 1, 1, 0, 0, 0, System.DateTimeKind.Utc);
		try{
			var t: System.Int64;
			System.Int64.TryParse( lTimetoken, t );
			var mEpoch = t/10000000;

			dDate = dDate.AddSeconds(mEpoch);
		} catch (err){
			Debug.Log("toDateFromEpoch:" + err);
			dDate = System.DateTime.Now;
		}
		return dDate;
	}
	
	function StopHeartbeat(){
		heartBeatRunning = false;
		if(!disableHeartbeat){		
			if(thdHeartbeat != null){
				Debug.Log("Joining heartbeat");
				thdHeartbeat.Join(100);
				thdHeartbeat = null;
			} else {
				Debug.Log("HB null");
			}
		}
	}	
	
	function Heartbeat(cb:Function){
		while(heartBeatRunning){
			Debug.Log("Heartbeat running...");
			if(CheckForInternetConnection()){
				Debug.Log("Internet Connection OK");
			} else {
				Debug.Log("Internet Connection Error");
				SendErrorMessage(cb);
			}

			//yield WaitForSeconds(10);
			Thread.Sleep(retryInterval * 1000);
		}
	}
	
	function CheckForInternetConnection()
	{
		//var client : System.Net.WebClient;
		//var stream : System.IO.Stream;
		try
		{
			//client = new System.Net.WebClient();
			var url = "http://" + host;
			var www = WWW(url);
			
			Debug.Log("url:"+url);
			while(!www.isDone){
				Debug.Log("waiting completion:");			
				Thread.Sleep(1000);
			}
			if( www.error ){
				if(www.error.Contains("404")){
					Debug.Log(" w.error CheckForInternetConnection: 404");
					return true;
				}
				Debug.Log( "w.error " + www.error );
				return false;
			} else { 
				Debug.Log( "w.text " + www.text );
				//cb( [w.text, channel] ); 
				return true;
			}
			//stream = client.OpenRead(url);
			//return true;
		}
		catch (ex)
		{
			if(ex.ToString().Contains("404")){
				Debug.Log("CheckForInternetConnection: 404");
				return true;
			}
			Debug.Log("CheckForInternetConnection:" + ex.ToString());
			return false;
		}
		finally
		{
			//if(client) { client.Dispose(); }
			//if(stream) { stream.Dispose(); }
		}
	}
	
	function SendErrorMessage(cb:Function){
		try {
			var returnArray = new ArrayList();
			returnArray.Add("Internet connection error. Retry count 1 of 50.");
			var message = JsonWriter.Serialize(returnArray);
			for (var value in chArr) {
				var retChannel:String = value as String;
				var pos = retChannel.IndexOf("-pnpres");
				if(pos < 0){
					cb ([message], retChannel, false, timetoken);
				}
			}
		} catch(err) Debug.Log("SendErrorMessage:" +err);	
	}
	
	function SubLoop(cbArr: Function[]){
		var cb = cbArr[0];
		var cbPresence:Function;
		if(cbArr[1]!= null){
			cbPresence = cbArr[1];
		}
		
		timetoken = NULL;
		var backoff = 0;

		var running = true;

		while( running ){ // while subscribed
			if(uuid == ""){
				uuid = Guid();
			}
			//Debug.Log("while subscribed: ");
			if(channelUpdateLock){
				yield WaitForSeconds(0.5);
				continue;
			}
			
			//StopCoroutine("Heartbeat");
			if(chArr.length<=0) {
				StopHeartbeat();
				break;
			}
			
			var ch = "";
			var count =0;
			var nonPresenceCount =0;
			try {
				for (var value in chArr) {
					if(count > 0){
						ch += ",";
					}
					ch += value;
					count++;
					if(!disableHeartbeat){
						var val:String = value as String;
						var pos = val.IndexOf("-pnpres");
						if(pos < 0){
							nonPresenceCount++;
						}
					}
				}
			} catch(err) Debug.Log("Sub loop Error:" +err);	
						
			if(!disableHeartbeat){
				if( nonPresenceCount >0 && !heartBeatRunning){
					//yield StartCoroutine("Heartbeat", cb);
					thdHeartbeat = new Thread(new ParameterizedThreadStart(Heartbeat));
					thdHeartbeat.Name = "heartbeart thread";
					heartBeatRunning = true;
					thdHeartbeat.Start(cb);
				} else if (nonPresenceCount <= 0){
					StopHeartbeat();
				}
			}
			
			var subscribeWww1 = Request( [suburl, subkey, Escape(ch), NULL, timetoken], ["uuid=" + uuid, pnsdk] );
			yield subscribeWww1;
			/*if(!isTest){
				yield subscribeWww1;
			} else {
				while(!subscribeWww1.isDone){
					Debug.Log("waiting");
				}
			}*/

			try {									
				if(subscribeWww1 != null ){

					if( subscribeWww1.error ){
						Debug.Log("Www Error: " + subscribeWww1.error);
						if( backoff < 1 ) backoff += 0.1;
					} else {
						var response = subscribeWww1.text;
						Debug.Log("w.text:" + response);
						ProcessCallbacks(ch, response, cb, cbPresence);
					}
				} else {
					Debug.Log("Subscribe null");
				}						
			}catch(err) Debug.Log("Force close www: " + err);
		}
		running = false;
	}
	
	function ProcessCallbacks(ch:String, response:String, cb: Function, cbPresence: Function){
		try {
			var output:Object[] = JsonReader.Deserialize (response) as Object[];
	
			if(output.Length >1){
				timetoken = output[1] as String;
			}
			
			//timetoken = j._get(1).toString();
			var params = output[1] as String;//j._get(0).stringify(); 
			var t: System.Int64;
			System.Int64.TryParse( timetoken, t );
			var cTime = toDateFromEpoch(timetoken);
			var retChannels:String = ch;
		
			/*if(j.length() > 2 ){
				retChannels = j._get(2).toString();
			}*/
			if(output.Length >2){
				retChannels = output[2] as String;
			}
			var channelArr:String[] = retChannels.Split(","[0]);
			//var messArr:json = json.fromString(j._get(0).stringify());
			
			var output2:Object[] = output[0] as Object[];
			var k =0;
			//for (k=0; k< messArr.length(); k++){
			for (k=0; k< output2.Length; k++){
				var retChannel:String;
				if(channelArr.Length>k){
					retChannel = channelArr[k];
				} else if(channelArr.Length==1){
					retChannel = channelArr[0];
				}
				var pos = retChannel.IndexOf("-pnpres");

				var isPresence = false;
				if(pos >-1){
					retChannel = retChannel.Substring(0, pos);
					isPresence = true;
				}
				params = output2[k] as String;

				if( params != "[]" ) {
					if(isPresence && cbPresence != null){
						Debug.Log(retChannel + " SENDING on presence callback");
						Debug.Log(params + " params");
						var message = JsonWriter.Serialize(params);
						cbPresence( [UnEscape(message), t, retChannel] ); // pass only non-empty msgs
					} else {
						ProcessSubscribeCallback(output2[k], cTime, retChannel, t, cb);
					}
				} else if(retChannel != ""){
					var arr =  new Array ();
					Debug.Log(retChannel + " Connected");
					arr.Add ("1");
					arr.Add ("Connected");
					
					Debug.Log(isPresence + " isPresence");
					if(cbPresence == null){
						Debug.Log("cbPresence is null");
					}
					if(isPresence && cbPresence != null){
						Debug.Log(retChannel + " SENDING on presence callback");
						arr.Add (retChannel);
						cbPresence(arr);
					} else {
						Debug.Log(retChannel + " SENDING on subscribe callback");
						arr.Add (retChannel);
						cb ( arr);
					}
				}
			}
		} catch(err) Debug.Log("Deserialize error: " + err.ToString() + " \nResponse:" +response);	
	}
	
	function ProcessSubscribeCallback(messArr:Object, cTime: System.DateTime, retChannel:String, t:System.Int64, cb: Function){
		var pubnubCrypto:PubnubCrypto = new PubnubCrypto(this.cipherkey);
		var returnArray = new ArrayList();
		if(this.cipherkey!=""){
			var decrypted = Decrypt(pubnubCrypto, messArr);
			returnArray.Add(decrypted);
		} else {
			returnArray.Add(messArr);
		}
		var message = JsonWriter.Serialize(returnArray);
		cb( [UnEscape(message), t, retChannel] ); // pass only non-empty msgs
	}
	
	function Unsubscribe( channel: String, isPresence: Boolean, cb: Function ){
		if(IsSubKeyInvalid(cb)){			
			return;
		}
		
		if(IsChannelInvalid(channel, cb)){
			return;
		}		
		if(isPresence) channel +="-pnpres";
		
		channelUpdateLock = true;
		if(!channel in channels) return;

		//channels[channel] = false;
		if(!isPresence) StopHeartbeat();
		
		chArr.Remove(channel);	
		channelUpdateLock = false;
		channel = Escape(channel);
		var w: WWW = null;
		var backoff = 0;
		try{		
			w = Request([hurl, "presence", "sub-key" , subkey, "channel", channel, "leave"], ["uuid=" + uuid, pnsdk]);
		} catch(err) {
			Debug.Log("Unsubscribe Error:" +err);
			return;
		}	
		yield w;
	
		if( w.error ){
			Debug.Log( w.error );
			if( backoff < 1 ) backoff += 0.1;
			yield WaitForSeconds( backoff );
			
		} else { 
			cb( [w.text, channel] ); 
			return; 
		}
	}
}
