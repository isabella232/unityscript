#pragma strict

import NUnit.Framework;
import System;

@TestFixture
public class DetailedHistoryTests
{
	@Test
	function BasicDetailedHistory ()
	{
		var cmb = Common.InitTest("", "", false, true);
		DetailedHistoryCommon(cmb);
	}
	
	function DetailedHistoryCommon(cmb:CommonMonoBehaviour){
		var message = "Message 1";
		var controller:CoroutineController;
		var ch = "UnityScriptTest";
		//cmb.StartCoroutineEx(Common.pubnubCommon.Publish(ch, message, false, Common.ParseResponseDummy), controller);

		//cmb.StartCoroutineEx(Common.pubnubCommon.DetailedHistory(ch, 1, -1, -1, false, Common.ParseResponse), controller);
		cmb.StartCoroutine(Common.pubnubCommon.Publish(ch, message, false, Common.ParseResponseDummy));

		cmb.StartCoroutine(Common.pubnubCommon.DetailedHistory(ch, 1, -1, -1, false, Common.ParseResponse));
		if(Common.response != null){
			var i = Common.response.length;

			if(i > 0){
				var output:Object[] = JsonReader.Deserialize (Common.response[0].ToString()) as Object[];
				if(output.Length > 0){
					var output2:Object[] = output[0] as Object[];
					Debug.Log("Reponse:" + output2[0].ToString());
					Assert.IsTrue(output2[0].ToString().Equals(message));	
				} else {
					Assert.Fail("DetailedHistory null test failed");
				}
			} else {
				Assert.Fail ("DetailedHistory null test failed, length 0");
			}
		} else {
			Assert.Fail("DetailedHistory null test failed, response null");			
		}		
	}
	
	@Test
	function BasicDetailedHistoryCipher ()
	{
		var cmb = Common.InitTest("enigma", "", false, true);
		DetailedHistoryCommon(cmb);
	}	
	
	@Test
	function BasicDetailedHistorySSL ()
	{
		var cmb = Common.InitTest("", "", true, true);
		DetailedHistoryCommon(cmb);	
	}
	
	@Test
	function BasicDetailedHistoryCipherSSL ()
	{
		var cmb = Common.InitTest("enigma", "", true, true);
		DetailedHistoryCommon(cmb);	
	}		
	
	//function ParseDetailedHistory(channel: String, totalMessages:int, starttime:long, midtime:long, reverse:boolean, cb: Function, messages:String[], cmb:CommonMonoBehaviour, controller:CoroutineController){
		//cmb.StartCoroutineEx(Common.pubnubCommon.DetailedHistory(channel, totalMessages, starttime, midtime, reverse, cb), controller);
	function ParseDetailedHistory(channel: String, totalMessages:int, starttime:long, midtime:long, reverse:boolean, cb: Function, messages:String[], cmb:CommonMonoBehaviour){
		cmb.StartCoroutine(Common.pubnubCommon.DetailedHistory(channel, totalMessages, starttime, midtime, reverse, cb));
		if(Common.response != null){
			var i = Common.response.length;

			if(i > 0){
				var output:Object[] = JsonReader.Deserialize (Common.response[0].ToString()) as Object[];
				if(output.Length > 0){
					var output2:Object[] = output[0] as Object[];
					var j =0;
					var isResultTrue = true;
					for(j =0; j<output2.Length; j++){
						Debug.Log("Reponse:" + output2[j].ToString() + " " + messages[j]);
						if(!output2[j].ToString().Equals(messages[j])){
							isResultTrue = false;
							break;
						}	
					}
					Assert.IsTrue(isResultTrue);
				} else {
					Assert.Fail("DetailedHistory null test failed");
				}
			} else {
				Assert.Fail ("DetailedHistory null test failed, length 0");
			}
		} else {
			Assert.Fail("DetailedHistory null test failed, response null");			
		}		
	}
	
	@Test
	function DetailedHistoryParams ()
	{
		var cmb = Common.InitTest("", "", false, true);
		
		DetailedHistoryParamsCommon(cmb);
	}
	
	@Test
	function DetailedHistoryParamsCipher ()
	{
		var cmb = Common.InitTest("enigma", "", false, true);
		
		DetailedHistoryParamsCommon(cmb);
	}
	
	@Test
	function DetailedHistoryParamsSSL ()
	{
		var cmb = Common.InitTest("", "", false, true);
		
		DetailedHistoryParamsCommon(cmb);
	}
	
	function DetailedHistoryParamsCommon(cmb:CommonMonoBehaviour){
		//var controller:CoroutineController;
		var ch = "UnityScriptTest";
		var starttime:long = Common.GetTimestamp (cmb);
		var midtime:long;
		var k = 0;
		var messagePrefix = "Message1 ";
		var msgArr1:String[] = new String[5];
		var msgArr2:String[] = new String[5];
		
		for (k=0; k<5; k++){
			var message = messagePrefix + k.ToString();			
			msgArr1[k] = message;
			//cmb.StartCoroutineEx(Common.pubnubCommon.Publish(ch, message, false, Common.ParseResponseDummy), controller);
			cmb.StartCoroutine(Common.pubnubCommon.Publish(ch, message, false, Common.ParseResponseDummy));
		}
		midtime = Common.GetTimestamp (cmb);						
		messagePrefix = "Message2 ";
		for (k=0; k<5; k++){	
			var message2 = messagePrefix + k.ToString();			
			msgArr2[k] = message2;
			//cmb.StartCoroutineEx(Common.pubnubCommon.Publish(ch, message2, false, Common.ParseResponseDummy), controller);
			cmb.StartCoroutine(Common.pubnubCommon.Publish(ch, message2, false, Common.ParseResponseDummy));
		}
		var endtime:long = Common.GetTimestamp (cmb);
		
		Common.response = null;
		Common.deliveryStatus = false;		

		//ParseDetailedHistory(ch, 5, starttime, midtime, false, Common.ParseResponse, msgArr1, cmb, controller);
		ParseDetailedHistory(ch, 5, starttime, midtime, false, Common.ParseResponse, msgArr1, cmb);
		
		Common.response = null;
		Common.deliveryStatus = false;		
		
		//ParseDetailedHistory(ch, 5, midtime, endtime, false, Common.ParseResponse, msgArr2, cmb, controller);
		ParseDetailedHistory(ch, 5, midtime, endtime, false, Common.ParseResponse, msgArr2, cmb);	
	}
	
	@Test
	function DetailedHistoryParamsCipherSSL ()
	{
		var cmb = Common.InitTest("enigma", "", false, true);
		
		DetailedHistoryParamsCommon(cmb);
	}
	
	function PublishCommonTest(cmb:CommonMonoBehaviour, message:Object){
		var controller:CoroutineController;
		var ch = "UnityScriptTest";
		cmb.StartCoroutineEx(Common.pubnubCommon.Publish(ch, message, false, Common.ParseResponse), controller);
	}
}