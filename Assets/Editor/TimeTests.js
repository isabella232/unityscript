#pragma strict

import NUnit.Framework;
import System;

@TestFixture
public class TimeTests
{
	 var pubkey = 'demo';
	 var subkey = 'demo';
	 var seckey = 'demo';
	 var secure = false;
	static var errorResponse:String;
	static var deliveryStatus:boolean;
	static var response:Array;
	static var grantManualEvent:ManualResetEvent = new ManualResetEvent (false);
	var pn:PubNub;
	var message:Hashtable;
	var cmb2:CommonMonoBehaviour;
	var channel:String;
	
	public function ParseResponse( msgs: Array ){
		Debug.Log("ParseResponse:" + msgs[0].ToString());		
		response = msgs;
		deliveryStatus = true;
	}
	
	public function ParseResponseDummy( msgs: Array ){
		Debug.Log("ParseResponseDummy:" + msgs[0].ToString());		
	}

	public function ParseResponseSubscribe( msgs: Array ){
		Debug.Log("ParseResponseSubscribe:" + msgs[0].ToString());		
		//response = msgs;
		//deliveryStatus = true;
	}
	public function ParseResponsePresence( msgs: Array ){
		Debug.Log("ParseResponsePresence:" + msgs[0].ToString());		
		//response = msgs;
		//deliveryStatus = true;
	}
	
	function Publish(){
		Thread.Sleep(2000);
		Debug.Log("Publishing");
		var someCoroutine:IEnumerator = pn.Publish(channel, message, false, ParseResponseDummy);
		while (someCoroutine.MoveNext())
		{
			Debug.Log("Im running");
			
		}
	}

	function SubCoroutineEx(channel:String, isPresence:Boolean, timetoken:String, cmb:CommonMonoBehaviour):IEnumerator{
		Common.pubnubCommon.isTest = false;	
		//yield cmb.StartCoroutine(Common.pubnubCommon.Subscribe(channel, false, timetoken.ToString(), ParseResponse, ParseResponseDummy));
		var someCoroutine:IEnumerator = Common.pubnubCommon.Subscribe(channel, false, timetoken.ToString(), Common.ParseResponse, Common.ParseResponseDummy);
		var startSomeCoroutine:Coroutine = cmb.StartCoroutine(someCoroutine);
		while (!someCoroutine.MoveNext())
		{
			Debug.Log("Im running");
			yield WaitForSeconds(100);
		}
		yield startSomeCoroutine;
	}
	
	//@Test
	function Subscribe ()
	{
		var ch = "test";
		var cmb = Common.InitTest("", "", true, true);
		var messageToSend:Hashtable = new Hashtable();
		messageToSend["username"] = "username3";
		messageToSend["message"] = "messageToChat3";
		message = messageToSend;
		var starttime:long = Common.GetTimestamp (cmb);
		Common.response = null;
		Common.deliveryStatus = false;		
		
		cmb.StartCoroutine(Common.pubnubCommon.Publish(ch, message, false, Common.ParseResponseDummy));		
		Common.response = null;
		Common.deliveryStatus = false;		
		
		//var t = new Task(pubnub.Subscribe(ch, false, ParseResponse, ParseResponseDummy), true);
		//var controller:CoroutineController;
		//cmb.Init(pn, ch, controller, ParseResponse, ParseResponseDummy);
		//cmb.StartCoroutineEx(Common.pubnubCommon.Subscribe(ch, false, starttime.ToString(), ParseResponse, ParseResponseDummy), controller);
		//cmb.Init(pn, ch, controller, ParseResponse, ParseResponseDummy);
		//controller.Pause();
		//Debug.Log(controller.state);
		
		//controller.Resume();	
		//Debug.Log(controller.state);		
		/*var someCoroutine:IEnumerator = Common.pubnubCommon.Subscribe(ch, false, starttime.ToString(), ParseResponse, ParseResponseDummy;
		var startSomeCoroutine:Coroutine = cmb.StartCoroutine(someCoroutine);
		while (!someCoroutine.MoveNext())
		{
			Debug.Log("Im running");
			//yield WaitForSeconds(100);
		}	*/	
		SubCoroutineEx(ch, false, starttime.ToString(), cmb);
		while (!Common.deliveryStatus){
			Debug.Log("Waiting for response");
		}
		//Thread.Sleep(2000);
		//t.Pause();
		//cmb.StartCoroutine(pubnub.Publish(ch, message, false, ParseResponseDummy));		
		//t.Unpause();
		//while(t.Running) { Debug.Log("t running"); }
		//var thd:Thread = new Thread(new ThreadStart(Publish));
		//thd.Start();
		//cmb.Init(pn, ch, messageToSend, ParseResponse, ParseResponseDummy);
		
		//CoroutineController controller;
		//cmb.StartCoroutineEx(SomeCoroutine(), out controller);
		//cmb.StartCoroutine(pubnub.Subscribe(ch, false, ParseResponse, ParseResponseDummy));
						
		if(Common.response != null){
			var i = Common.response.length;
			if(i > 0){
				Debug.Log("reponse0:" + Common.response[0].ToString());
				Assert.False (("0").Equals (Common.response[0].ToString()));
			} else {
				Assert.Fail ("Subscribe test failed");
			}
		} else {
			Assert.Fail("Subscribe test failed response null");			
		}
	}

	@Test
	function ThenItShouldReturnTimeStamp ()
	{
		var cmb = Common.InitTest("", "", true, true);
		TimeCommonTest(cmb);
	}
	
	@Test
	function ThenItShouldReturnTimeStampSSL ()
	{
		var cmb = Common.InitTest("", "", true, true);
		TimeCommonTest(cmb);
	}	
	
	function TimeCommonTest(cmb:CommonMonoBehaviour){
		//var t = new Task(pubnub.Time(ParseResponse), true);
		//cmb.StartCoroutine(pubnub.Time(ParseResponse));
		//var controller:CoroutineController;
		//cmb.StartCoroutineEx(Common.pubnubCommon.Time(Common.ParseResponse), controller);
		cmb.StartCoroutine(Common.pubnubCommon.Time(Common.ParseResponse));
		if(Common.response != null){
			var i = Common.response.length;
			if(i > 0){
				Assert.False (("0").Equals (Common.response[0].ToString()));
			} else {
				Assert.Fail ("Time test failed");
			}
		} else {
			Assert.Fail("Time test failed");			
		}
	}

	/*@Test
	function ThenItShouldReturnTimeStampSSL ()
	{
		Pubnub pubnub = new Pubnub (
					 Common.PublishKey,
					 Common.SubscribeKey,
					 "",
					 "",
					 false
				 );

		Common common = new Common ();
		common.DeliveryStatus = false;
		common.Response = null;

		pubnub.PubnubUnitTest = common.CreateUnitTestInstance ("WhenGetRequestServerTime", "ThenItShouldReturnTimeStamp");
		;

		string response = "";

		pubnub.Time (common.DisplayReturnMessage, common.DisplayReturnMessageDummy);

		common.WaitForResponse ();

		IList<object> fields = common.Response as IList<object>;
		response = fields [0].ToString ();
		Console.WriteLine ("Response:" + response);
		Assert.False (("0").Equals (response));
		pubnub.EndPendingRequests ();
	}

	private void ReturnTimeStampCallback (string result)
	{
		if (!string.IsNullOrEmpty (result) && !string.IsNullOrEmpty (result.Trim ())) {
			Pubnub pubnub = new Pubnub ("demo", "demo", "", "", false);
			object[] deserializedMessage = pubnub.JsonPluggableLibrary.DeserializeToListOfObject (result).ToArray ();
			if (deserializedMessage is object[]) {
				string time = deserializedMessage [0].ToString ();
				Int64 nanoTime;
				if (time.Length > 2 && Int64.TryParse (time, out nanoTime)) {
					timeReceived = true;
				}
			}
		}
		mreTime.Set ();
	}

	@Test
	function TranslateDateTimeToUnixTime ()
	{
		Debug.Log ("Running TranslateDateTimeToUnixTime()");
		//Test for 26th June 2012 GMT
		DateTime dt = new DateTime (2012, 6, 26, 0, 0, 0, DateTimeKind.Utc);
		long nanoSecondTime = Pubnub.TranslateDateTimeToPubnubUnixNanoSeconds (dt);
		Assert.True ((13406688000000000).Equals (nanoSecondTime));
	}

	@Test
	function TranslateUnixTimeToDateTime ()
	{
		Debug.Log ("Running TranslateUnixTimeToDateTime()");
		//Test for 26th June 2012 GMT
		DateTime expectedDate = new DateTime (2012, 6, 26, 0, 0, 0, DateTimeKind.Utc);
		DateTime actualDate = Pubnub.TranslatePubnubUnixNanoSecondsToDateTime (13406688000000000);
		Assert.True (expectedDate.ToString ().Equals (actualDate.ToString ()));
	}

	void DummyErrorCallback (string result)
	{
		Debug.Log ("WhenGetRequestServerTime ErrorCallback = " + result);
	}

	void DummyErrorCallback (PubnubClientError result)
	{
		Debug.Log ("WhenUnsubscribedToAChannel ErrorCallback = " + result.ToString ());
	}*/
}