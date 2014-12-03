#pragma strict

import System;
import UnityEngine;
import System.Collections.Generic;

//@IntegrationTest.DynamicTestAttribute("ExampleIntegrationTests")
class PresenceTest extends MonoBehaviour{
	var pubkey = 'demo-36';
	var subkey = 'demo-36';
	var seckey = 'demo-36';
	var secure = false;
	var channel = 'mainchat';

	var pubnub: PubNub;

	var errorResponse:String;
	var deliveryStatus:boolean;
	var response:Array;
	function SubscribeTest(){
		Debug.Log("In SubscribeTest");
	}
	
	function Pass(){
		Debug.Log("Pass");
	}
	
	function Start(){
		/*response = null;
		deliveryStatus = false;
		errorResponse = null;
		pubnub = gameObject.AddComponent(PubNub);
		var uuid = "SubscribeTest";
		pubnub.Init(pubkey, subkey, seckey, "", "", secure);
		pubnub.disableHeartbeat = true;
		StartCoroutine(pubnub.Subscribe(channel, true, "", ParseResponseDummy, ParseResponseDummy));
		yield WaitForSeconds(5);
		
		StartCoroutine(pubnub.Subscribe(channel, false, "", ParseResponseDummy, ParseResponse));

		var count = 0;
	
		while(!deliveryStatus){
			yield WaitForSeconds(5);
			Debug.Log("waiting:" + count);
			count++;
		}
		Debug.Log("resp:"+response[0].ToString());
		var found = false;
		
		if(found){
			//IntegrationTest.Pass(gameObject);
			Debug.Log("throwing exception found");	
			throw new System.ArgumentException("UUIDFound", "UUIDFound");
		}	
		StartCoroutine(pubnub.Unsubscribe(channel, false, ParseResponseDummy));
		yield WaitForSeconds(2);
		StartCoroutine(pubnub.Unsubscribe(channel, true, ParseResponseDummy));		
		
		/*pubnub = gameObject.AddComponent(PubNub);
		//var uuid = "PresenceTest4";
		pubnub.Init(pubkey, subkey, seckey, "", "", secure);
		pubnub.disableHeartbeat = true;
		yield StartCoroutine(pubnub.Subscribe(channel, true, "", ParseResponseDummy, ParseResponse));
		yield WaitForSeconds(2);
		response = null;
		deliveryStatus = false;
		var found = false;
		var count = 0;
		Debug.Log("pubnubuuid:" + pubnub.GetUuid());
		yield StartCoroutine(pubnub.Subscribe(channel, false, "", ParseResponseDummy, ParseResponse));
		yield WaitForSeconds(2);
		
		while(!deliveryStatus){
			yield WaitForSeconds(2);
			Debug.Log("waiting:" + count);
			count++;
		}
		Debug.Log("resp"+response[0].ToString());
		
		if(response[0].ToString().Contains(pubnub.GetUuid())){
			Debug.Log("uuid found");
			found = true;
		}
		//StartCoroutine(Subscribe(channel));
		/*var count = 0;
		while(!deliveryStatus){
			yield WaitForSeconds(5);
			Debug.Log("waiting:" + count);
			count++;
		}
		//Debug.Log("resp:"+response.ToString());
		Debug.Log("After waiting");
		Debug.Log("respLen:"+response.length);
		Debug.Log("resp:"+response.ToString());
		
		if(response.ToString().Contains(uuid)){
			Debug.Log("uuid found");
			found = true;
		}
		/*Debug.Log("response[0].ToString():");
		Debug.Log("resp:"+response.ToString());
		var output:Object[] = JsonReader.Deserialize (response.ToString()) as Object[];
		if(output != null){
			var k = 0;
			for (k = 0; k < output.Length; k++){
				var dict:Dictionary.<String, Object> = output[k] as Dictionary.<String, Object>;
				Debug.Log("username:" + dict["username"].ToString());
				Debug.Log("message:" + dict["message"].ToString());
				//
					found = true;
				//}
			}
		}	
		/*if(response!=null){
			Debug.Log("response[0].ToString():"+response[0].ToString());
			var output:Object[] = JsonReader.Deserialize (response[0].ToString()) as Object[];
			var k:int;
			for (k = 0; k < output.Length; k++){
				var dict:Dictionary.<String, Object> = output[k] as Dictionary.<String, Object>;
				Debug.Log("uuid:" + dict["uuid"].ToString());
				if(dict["uuid"].ToString().Equals(uuid)){
					found = true;
				}
			}
		}*/
		/*StartCoroutine(pubnub.Unsubscribe(channel, false, ParseResponseDummy));
		yield WaitForSeconds(2);
		StartCoroutine(pubnub.Unsubscribe(channel, true, ParseResponseDummy));
		//Assert.IsTrue(true);
		if(found){
			//IntegrationTest.Pass(gameObject);	
			//Assert.IsTrue(true);
			Debug.Log("throwing exception found");	
			throw new System.ArgumentException("UUIDFound", "UUIDFound");
		}*/
		//IntegrationTest.Pass(gameObject);	
	}

	// boolean variable to decide whether to show the window or not.
	// Change this from the in-game GUI, scripting, the inspector or anywhere else to
	// decide whether the window is visible
	var doWindow0 : boolean = true;
 
	// Make the contents of the window.
	function DoWindow0 (windowID : int) {
 
	}

	public function ParseResponse( msgs: Array ){
		Debug.Log("ParseResponse2:" + msgs[0].ToString());
		try{		
		var output:Object[] = JsonReader.Deserialize (msgs[0].ToString()) as Object[];
		if((output != null) && (output.Length > 1)){			
			if((output[0].ToString() == "1") && (output[1].ToString() == "Connected")){
				Debug.Log("Connected");
				return;
			}
		}	
		}catch(err) { Debug.Log("err:"+err);}
		response = msgs;
		deliveryStatus = true;	
	}

	public function ParseResponseDummy( msgs: Array ){
		Debug.Log("ParseResponseDummy:" + msgs[0].ToString());		
	}

	function OnGUI(){
	
	}

	function Subscribe(ch:String){
		yield StartCoroutine(pubnub.Subscribe(ch, true, "", ParseResponseDummy, ParseResponse));
		yield WaitForSeconds(2);
		yield StartCoroutine(pubnub.Subscribe(ch, false, "", ParseResponseDummy, ParseResponse));
		yield WaitForSeconds(2);
	
	}

	function Unsubscribe(ch:String){
		StartCoroutine(pubnub.Unsubscribe(ch, false, ParseResponseDummy));
		yield WaitForSeconds(2);
		StartCoroutine(pubnub.Unsubscribe(ch, true, ParseResponseDummy));
		yield WaitForSeconds(2);
	}

	function Update () {

	}
}