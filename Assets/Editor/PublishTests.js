#pragma strict

import NUnit.Framework;
import System;

@TestFixture
public class PublishTests
{	
	@Test
	function PublishNull ()
	{
		var cmb = Common.InitTest("", "", false, true);
		var message = null;
		PublishCommonTestInvalid(cmb, message);

		/*var player = new GameObject ("Player2");
		var cmb = player.AddComponent(CommonMonoBehaviour);
		var pubnub = player.AddComponent(PubNub);//Common.pubnubCommon;		
		pubnub.Init("", Common.SubscribeKey, "", "", "", false);
		pubnub.isTest = true;
		Common.pubnubCommon = pubnub;
		Common.response = null;
		Common.deliveryStatus = false;		

		PublishCommonTestInvalid(cmb);
	
		var cmb = Common.InitTest("enigma", "", false, true);
		var controller:CoroutineController;
		var ch = "UnityScriptTest";
		var message = null;
		cmb.StartCoroutineEx(Common.pubnubCommon.Publish(ch, message, false, Common.ParseResponse), controller);
		
		if(Common.response != null){
			var i = Common.response.length;

			if(i > 0){
				var output:Object[] = JsonReader.Deserialize (Common.response[0].ToString()) as Object[];
				if(!("1").Equals (output[0].ToString()) || !("Sent").Equals (output[1].ToString())){
					Assert.Fail("Publish null test failed");
				} 
			} else {
				Assert.Fail ("Publish null test failed, length 0");
			}
		} else {
			Assert.Fail("Publish null test failed, response null");			
		}*/
	}
	
	@Test
	function PublishMessageNonEncrypted ()
	{
		var cmb = Common.InitTest("", "", false, true);
		var message = "Pubnub API Usage Example";
		PublishCommonTest(cmb, message);
	}	
	
	@Test
	function PublishMessageEncrypted ()
	{
		var cmb = Common.InitTest("enigma", "", false, true);
		var message = "Pubnub API Usage Example";
		PublishCommonTest(cmb, message);
	}
		
	@Test
	function PublishMessageNonEncryptedSSL ()
	{
		var cmb = Common.InitTest("", "", true, true);
		var message = "Pubnub API Usage Example";
		PublishCommonTest(cmb, message);
	}	
	
	@Test
	function PublishMessageEncryptedSSL ()
	{
		var cmb = Common.InitTest("enigma", "", true, true);
		var message = "Pubnub API Usage Example";
		PublishCommonTest(cmb, message);
	}

	@Test
	function PublishComplexMessage ()
	{
		var cmb = Common.InitTest("", "", true, true);
		var message = new PubnubDemoObject ();
		PublishCommonTest(cmb, message);
	}
	
	@Test
	function PublishComplexMessageEncrypted ()
	{
		var cmb = Common.InitTest("enigma", "", true, true);
		var message = new PubnubDemoObject ();
		PublishCommonTest(cmb, message);
	}
	
	@Test
	function PublishKeyShouldBeOverriden ()
	{
		var player = new GameObject ("Player2");
		var cmb = player.AddComponent(CommonMonoBehaviour);
		var pubnub = player.AddComponent(PubNub);//Common.pubnubCommon;		
		pubnub.Init("", Common.SubscribeKey, "", "", "", false);
		pubnub.Init(Common.PublishKey, Common.SubscribeKey, "", "", "", false);
		pubnub.isTest = true;
		Common.pubnubCommon = pubnub;
		Common.response = null;
		Common.deliveryStatus = false;		
		var message = "Pubnub API Usage Example";
		PublishCommonTest(cmb, message);
	}
	
	@Test
	function SecretKeyNotProvided ()
	{
		var player = new GameObject ("Player2");
		var cmb = player.AddComponent(CommonMonoBehaviour);
		var pubnub = player.AddComponent(PubNub);//Common.pubnubCommon;		
		pubnub.Init(Common.PublishKey, Common.SubscribeKey, "", "", "", false);
		pubnub.isTest = true;
		Common.pubnubCommon = pubnub;
		Common.response = null;
		Common.deliveryStatus = false;		
		var message = "Pubnub API Usage Example";
		PublishCommonTest(cmb, message);
	}	
	
	@Test
	function PublishKeyNotProvided ()
	{
		var player = new GameObject ("Player2");
		var cmb = player.AddComponent(CommonMonoBehaviour);
		var pubnub = player.AddComponent(PubNub);//Common.pubnubCommon;		
		pubnub.Init("", Common.SubscribeKey, "", "", "", false);
		pubnub.isTest = true;
		Common.pubnubCommon = pubnub;
		Common.response = null;
		Common.deliveryStatus = false;		

		var message = "Pubnub API Usage Example";
		PublishCommonTestInvalid(cmb, message);
	}
	
	function PublishCommonTestInvalid(cmb:CommonMonoBehaviour, message:Object){
		//var controller:CoroutineController;
		var ch = "UnityScriptTest";
		
		//cmb.StartCoroutineEx(Common.pubnubCommon.Publish(ch, message, false, Common.ParseResponse), controller);
		cmb.StartCoroutine(Common.pubnubCommon.Publish(ch, message, false, Common.ParseResponse));
		
		if(Common.response != null){
			var i = Common.response.length;

			if(i > 0){
				var output:Object[] = JsonReader.Deserialize (Common.response[0].ToString()) as Object[];
				if(!output[1].ToString().Contains("Invalid")){
					Assert.Fail("Publish null test failed");
				} 
			} else {
				Assert.Fail ("Publish null test failed, length 0");
			}
		} else {
			Assert.Fail("Publish null test failed, response null");			
		}	
	}

		
	function PublishCommonTest(cmb:CommonMonoBehaviour, message:Object){
		//var controller:CoroutineController;
		var ch = "UnityScriptTest";
		//cmb.StartCoroutineEx(Common.pubnubCommon.Publish(ch, message, false, Common.ParseResponse), controller);
		cmb.StartCoroutine(Common.pubnubCommon.Publish(ch, message, false, Common.ParseResponse));
		
		if(Common.response != null){
			var i = Common.response.length;

			if(i > 0){
				var output:Object[] = JsonReader.Deserialize (Common.response[0].ToString()) as Object[];
				if(!("1").Equals (output[0].ToString()) || !("Sent").Equals (output[1].ToString())){
					Assert.Fail("Publish null test failed");
				} 
			} else {
				Assert.Fail ("Publish null test failed, length 0");
			}
		} else {
			Assert.Fail("Publish null test failed, response null");			
		}	
	}
}