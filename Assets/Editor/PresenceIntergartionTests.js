#pragma strict

import System;
import System.Collections.Generic;
 
@IntegrationTest.DynamicTest("SubscribeTestScene2")
@IntegrationTest.Timeout(15)
class PresenceIntergartionTests extends MonoBehaviour{
	var pubkey = 'demo';
	var subkey = 'demo';
	var seckey = 'demo';
	var secure = false;
	var channel = 'mainchat';
	var cipher = '';

	var pubnub: PubNub;

	var errorResponse:String;
	var deliveryStatus:boolean;
	var response:Array;
	function SubscribeTest(){
		Debug.Log("In SubscribeTest");
	}
	
	function Start(){
		
		pubnub = gameObject.AddComponent(PubNub);
		var uuid = "PresenceTest2";
		pubnub.Init(pubkey, subkey, seckey, cipher, uuid, secure);
		StartCoroutine(pubnub.Subscribe(channel, true, "", ParseResponseDummy, ParseResponse));
		yield WaitForSeconds(5);
		StartCoroutine(pubnub.Subscribe(channel, false, "", ParseResponseDummy, ParseResponse));
		//StartCoroutine(Subscribe(channel));
		var count = 0;
		while(!deliveryStatus){
			yield WaitForSeconds(5);
			Debug.Log("waiting:" + count);
			count++;
		}
		Debug.Log("resp:"+response.ToString());
		var found = false;
		if(response.ToString().Contains(uuid)){
			Debug.Log("uuid found");
			found = true;
		}
		StartCoroutine(pubnub.Unsubscribe(channel, false, ParseResponseDummy));
		yield WaitForSeconds(2);
		StartCoroutine(pubnub.Unsubscribe(channel, true, ParseResponseDummy));
		//Assert.IsTrue(true);
		if(found){
			IntegrationTest.Pass(gameObject);	
			//Assert.IsTrue(true);
			Debug.Log("throwing exception found");	
			//throw new System.ArgumentException("UUIDFound", "UUIDFound");
			//Testing.Pass();
		}
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
		Debug.Log("ParseResponse:" + msgs[0].ToString());		
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