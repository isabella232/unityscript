#pragma strict

import NUnit.Framework;
import System;
import System.Collections.Generic;

@TestFixture
public class UUIDTests
{
	function SubCoroutine(channel:String, isPresence:Boolean, cmb:CommonMonoBehaviour, cb:Function, cbPres:Function):IEnumerator{
		cmb.StartCoroutine(Common.pubnubCommon.Subscribe(channel, isPresence, "", cb, cbPres));
	}
	
	function UnsubCoroutine(channel:String, isPresence:Boolean, cmb:CommonMonoBehaviour):IEnumerator{
		cmb.StartCoroutine(Common.pubnubCommon.Unsubscribe(channel, false, Common.ParseResponseDummy));
	}
	
	@Test
	function UUIDTest(){
		var cmb = Common.InitTest("enigma", "", false, true);
		var uuid = Common.pubnubCommon.Guid();
		Debug.Log("uuid:"+ uuid);
		if( uuid==null || uuid == ""){
			Assert.Fail("uuid null");
		}
	}
	
	@Test
	function CustomUUID ()
	{
		var uuid = "customuuid";
		var cmb = Common.InitTest("", uuid, false, true);
		CustomUUIDCommon(uuid, cmb);
	}
	
	@Test
	function CustomUUIDSSL ()
	{
		var uuid = "customuuidssl";
		var cmb = Common.InitTest("", uuid, true, true);
		CustomUUIDCommon(uuid, cmb);
	}
	
	function CustomUUIDCommon(uuid:String, cmb:CommonMonoBehaviour){
		var channel = "UnityScriptTestCustomUUID";
		var controller:CoroutineController;
		//cmb.Init(Common.pubnubCommon, channel, controller, Common.ParseResponseDummy, Common.ParseResponseDummy);
		//cmb.StartCoroutineEx(Common.pubnubCommon.Subscribe(channel, false, Common.ParseResponseDummy, Common.ParseResponseDummy), controller);
		Common.pubnubCommon.isTest = false;
		SubCoroutine(channel, false, cmb, Common.ParseResponseDummy, Common.ParseResponseDummy);
		Common.pubnubCommon.isTest = true;
		Thread.Sleep(2000);
		cmb.StartCoroutine(Common.pubnubCommon.HereNow(channel, Common.ParseResponse));
		
		if(Common.response != null){
			var i = Common.response.length;

			if(i > 0){
				var output:Object = JsonReader.Deserialize (Common.response[0].ToString());
				var found = false;
				if(output != null){
					var dict:Dictionary.<String, Object> = output as Dictionary.<String, Object>;
					var uuids:Object[] = dict["uuids"] as Object[];
					var k =0;
					for (k=0; k< uuids.Length; k++){
						if(uuids[k].ToString().Equals(uuid)){
							found = true;
							break;
						}
					}
				}
				Assert.IsTrue(found);
			} else {
				Assert.Fail ("CustomUUID null test failed, length 0");
			}
		} else {
			Assert.Fail("CustomUUID null test failed, response null");			
		}
		UnsubCoroutine(channel, false, cmb);	
	}
	
	//function SubCoroutineEx(channel:String, isPresence:Boolean, cmb:CommonMonoBehaviour, cb:Function, cbPres:Function, controller:CoroutineController):IEnumerator{
	function SubCoroutineEx(channel:String, isPresence:Boolean, timetoken:String, cmb:CommonMonoBehaviour):IEnumerator{
		/*cmb.StartCoroutine(Sub2(channel, cmb));
		Thread.Sleep(2000);
		Sub3(channel, cmb);*/
		//Common.pubnubCommon.isTest = false;
		if(timetoken == ""){
			cmb.StartCoroutine(Common.pubnubCommon.Subscribe(channel, isPresence, timetoken, Common.ParseResponseDummy, Common.ParseResponse));
		} else {
			var someCoroutine:IEnumerator = Common.pubnubCommon.Subscribe(channel, isPresence, timetoken, Common.ParseResponseDummy, Common.ParseResponse);
			var startSomeCoroutine:Coroutine = cmb.StartCoroutine(someCoroutine);
			while (!someCoroutine.MoveNext())
			{
				Debug.Log("Im running");
				//yield WaitForSeconds(100);
			}		
		}
		
		//Common.pubnubCommon.isTest = true;
		//cmb.StartCoroutine(Common.pubnubCommon.Subscribe(channel, false, Common.ParseResponseDummy, Common.ParseResponse));
	}
	
	function Sub2(channel:String, cmb:CommonMonoBehaviour){
		//yield cmb.StartCoroutineEx(Common.pubnubCommon.Subscribe(channel, isPresence, cb, cbPres), controller);
		Common.pubnubCommon.isTest = false;
		yield cmb.StartCoroutine(Common.pubnubCommon.Subscribe(channel, true, "", Common.ParseResponseDummy, Common.ParseResponse));
	}
	function Sub3(channel:String, cmb:CommonMonoBehaviour){
		//yield cmb.StartCoroutineEx(Common.pubnubCommon.Subscribe(channel, isPresence, Common.ParseResponseDummy, Common.ParseResponse), controller);
		//cmb.StartCoroutine(Common.pubnubCommon.Subscribe(channel, false, Common.ParseResponseDummy, Common.ParseResponse));
		Common.pubnubCommon.isTest = true;
		cmb.StartCoroutine(Common.pubnubCommon.Subscribe(channel, false, "", Common.ParseResponseDummy, Common.ParseResponse));
		/*var someCoroutine:IEnumerator = Common.pubnubCommon.Subscribe(channel, false, Common.ParseResponseDummy, Common.ParseResponse);
		var startSomeCoroutine:Coroutine = cmb.StartCoroutine(someCoroutine);
		//var startSomeCoroutine:Coroutine = StartCoroutine(pubnub.Time(ParseResponse));
		//someCoroutine.MoveNext();
		while (!someCoroutine.MoveNext())
		{
			Debug.Log("Im running");
			//yield WaitForSeconds(100);
		}
		//yield startSomeCoroutine;*/
	}
	
	//@Test
	function Presence ()
	{
		var uuid = "customuuidpresence";
		var cmb1 = Common.InitTest("", uuid, true, true);
		var starttime:long = Common.GetTimestamp (cmb1);
		
		var cmb = Common.InitTest("", uuid, true, false);
		var channel = "UnityScriptTestPresence";
		var controller:CoroutineController;
		Common.response = null;
		Common.deliveryStatus = false;		

		SubCoroutineEx(channel, true, "", cmb);

		var cmb2 = Common.InitTest("", uuid, true, true);		
		
		Thread.Sleep(2000);
		SubCoroutineEx(channel, false, starttime.ToString(), cmb2);
		
		Debug.Log("after sleep");
		if(Common.response != null){
			var i = Common.response.length;
 
			if(i > 0){
				var output:Object = JsonReader.Deserialize (Common.response[0].ToString());
				var found = false;
				if(output != null){
					var dict:Dictionary.<String, Object> = output as Dictionary.<String, Object>;
					var uuids:Object[] = dict["uuids"] as Object[];
					var k =0;
					for (k=0; k< uuids.Length; k++){
						if(uuids[k].ToString().Equals(uuid)){
							found = true;
							break;
						}
					}
				}
				Assert.IsTrue(found);
			} else {
				Assert.Fail ("Presence null test failed, length 0");
			}
		} else {
			Assert.Fail("Presence null test failed, response null");			
		}
		UnsubCoroutine(channel, false, cmb);	
		UnsubCoroutine(channel, true, cmb);	
	}

}	