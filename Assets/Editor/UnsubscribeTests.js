#pragma strict

import NUnit.Framework;
import System;
import System.Collections.Generic;

@TestFixture
public class UnsubscribeTests
{
	function SubCoroutine(channel:String, cmb:CommonMonoBehaviour):IEnumerator{
		cmb.StartCoroutine(Common.pubnubCommon.Subscribe(channel, false, "", Common.ParseResponseDummy, Common.ParseResponseDummy));
	}
	
	function UnsubCoroutine(channel:String, cmb:CommonMonoBehaviour):IEnumerator{
		cmb.StartCoroutine(Common.pubnubCommon.Unsubscribe(channel, false, Common.ParseResponseDummy));
	}

	@Test
	function Unsubscribe ()
	{
		var uuid = "customuuidUnsub";
		var cmb = Common.InitTest("", uuid, false, true);
		UnsubscribeCommon(uuid, cmb);
	}
	
	@Test
	function UnsubscribeSSL ()
	{
		var uuid = "customuuidUnsubSSL";
		var cmb = Common.InitTest("", uuid, true, true);
		UnsubscribeCommon(uuid, cmb);
	}
	
	function UnsubscribeCommon(uuid:String, cmb:CommonMonoBehaviour){
		var channel = "UnityScriptTestUnsubcribe";
		var controller:CoroutineController;
		Common.pubnubCommon.isTest = false;
		SubCoroutine(channel, cmb);
		Common.pubnubCommon.isTest = true;
		Thread.Sleep(2000);
		UnsubCoroutine(channel, cmb);
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
				Assert.IsTrue(!found);
			} else {
				Assert.Fail ("Unsubscribe null test failed, length 0");
			}
		} else {
			Assert.Fail("Unsubscribe null test failed, response null");			
		}
			
	}
}