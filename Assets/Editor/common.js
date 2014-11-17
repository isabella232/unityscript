#pragma strict

import NUnit.Framework;
import System.Threading;
import Pathfinding.Serialization.JsonFx;
import System.Xml;

class CommonMonoBehaviour2 extends MonoBehaviour{
	
}

class CommonMonoBehaviour extends MonoBehaviour{

	//function Init(pubnub:PubNub, ch:String, message:Hashtable, ParseResponse:Function, ParseResponseDummy:Function){
	function Init(pubnub:PubNub, ch:String, controller:CoroutineController, ParseResponse:Function, ParseResponseDummy:Function){
		//StartCoroutine(Init2(pubnub, ch, controller, ParseResponse, ParseResponseDummy));
		Subs(pubnub, ch, controller, ParseResponse, ParseResponseDummy);
	}
	
	function Init2(pubnub:PubNub, ch:String, controller:CoroutineController, ParseResponse:Function, ParseResponseDummy:Function){
		//yield StartCoroutine(Subs(pubnub, ch, controller, ParseResponse, ParseResponseDummy));
	}
	
	//function Subs(pubnub:PubNub, ch:String, message:Hashtable, ParseResponse:Function, ParseResponseDummy:Function){
	function Subs(pubnub:PubNub, ch:String, controller:CoroutineController, ParseResponse:Function, ParseResponseDummy:Function): IEnumerator{
		var someCoroutine:IEnumerator = pubnub.Subscribe(ch, false, ParseResponse, ParseResponseDummy);
		var startSomeCoroutine:Coroutine = StartCoroutine(someCoroutine);
		//var startSomeCoroutine:Coroutine = StartCoroutine(pubnub.Time(ParseResponse));
		//someCoroutine.MoveNext();
		while (!someCoroutine.MoveNext())
		{
			Debug.Log("Im running");
			yield WaitForSeconds(100);
		}
		yield startSomeCoroutine;
		
		//StartCoroutineEx(pubnub.Subscribe(ch, false, ParseResponse, ParseResponseDummy), controller);
		//StartCoroutine(pubnub.Subscribe(ch, false, ParseResponse, ParseResponseDummy));
		//yield StartCoroutine(pubnub.Subscribe(ch, false, ParseResponse, ParseResponseDummy));
		//yield StartCoroutine(pubnub.Publish(ch, message, false, ParseResponseDummy));
	}
}

class Common{
	static var errorResponse:String;
	static var deliveryStatus:boolean;
	static var response:Array;

	static var pubnubCommon: PubNub;
	
	static var PublishKey = "demo-36";
	static var SubscribeKey = "demo-36";
	static var SecretKey = "demo-36";
	
	static function ParseResponse( msgs: Array ){
		Debug.Log("ParseResponse:" + msgs[0].ToString());		
		response = msgs;
		deliveryStatus = true;
	}
	static function ParseResponseDummy( msgs: Array ){
		Debug.Log("ParseResponseDummy:" + msgs[0].ToString());		
	}
	
	static function GetTimestamp(cmb:CommonMonoBehaviour){
		cmb.StartCoroutine(Common.pubnubCommon.Time(Common.ParseResponse));
		if(Common.response != null){
			var i = Common.response.length;
			if(i > 0){
				var output:Int64[] = JsonReader.Deserialize (Common.response[0].ToString()) as Int64[];
				Debug.Log("output: " + output[0].ToString());
				return output[0];
			} else {
				Assert.Fail ("Time test failed");
			}
		} else {
			Assert.Fail("Time test failed");			
		}
	}
	
	static function InitTest(cipher:String, uuid:String, secure:boolean, isTestVal:boolean): CommonMonoBehaviour{
		var player = new GameObject ("Player2");
		var cmb = player.AddComponent(CommonMonoBehaviour);
		var pubnub = player.AddComponent(PubNub);//Common.pubnubCommon;		
		pubnub.Init(Common.PublishKey, Common.SubscribeKey, Common.SecretKey, cipher, uuid, secure);
		pubnub.isTest = isTestVal;
		pubnubCommon = pubnub;
		response = null;
		deliveryStatus = false;		
		return cmb;
	}
	
	/*public static function DeserializeString (msg:String): String{
		var j:json = json.fromString(msg);
		var jsonTypeString = j.toString();
		return jsonTypeString;
	}

	public static function SerializeString (msg:String): String{
		var j:json = json._string(msg);
		var jsonTypeString = j.stringify();
		return jsonTypeString;
	}

	public static function Serialize (msg:Object): String{
		Debug.Log("typeof(GameObject):"+ typeof(msg));
		var j:json = json._string(msg);
		var jsonTypeString = j.stringify();
		return jsonTypeString;
	}*/
	/// <summary>
	/// Deserialize the specified message using either JSONFX or NEWTONSOFT.JSON.
	/// The functionality is based on the pre-compiler flag
	/// </summary>
	/// <param name="message">Message.</param>
	public static function Deserialize (message: String)
	{
		var retMessage: Object;
		UnityEngine.Debug.Log ("message: " + message);
		retMessage = JsonReader.Deserialize (message);
		return retMessage;
	}

	/// <summary>
	/// Serialize the specified message using either JSONFX or NEWTONSOFT.JSON.
	/// The functionality is based on the pre-compiler flag
	/// </summary>
	/// <param name="message">Message.</param>
	public static function Serialize (message:Object):String
	{
		var retMessage:String;
		retMessage = JsonWriter.Serialize (message);
		//retMessage = ConvertHexToUnicodeChars (retMessage);
		return retMessage;
	}
}

@Serializable
class PubnubDemoObject
{
	var VersionID:double = 3.4;
	var Timetoken:long = 13601488652764619;
	var OperationName:String = "Publish";
	var Channels:String[]  = [ "ch1" ];
	var DemoMessage:PubnubDemoMessage = new PubnubDemoMessage ();
	var CustomMessage:PubnubDemoMessage = new PubnubDemoMessage ("This is a demo message");
	var SampleXml:XmlDocument = new PubnubDemoMessage ().TryXmlDemo ();
}

@Serializable
class PubnubDemoMessage
{
	var DefaultMessage:String = "~!@#$%^&*()_+ `1234567890-= qwertyuiop[]\\ {}| asdfghjkl;' :\" zxcvbnm,./ <>? ";

	function PubnubDemoMessage ()
	{
	}
	
	function PubnubDemoMessage (message:String)
	{
		DefaultMessage = message;
	}

	function TryXmlDemo():XmlDocument
	{
		var xmlDocument:XmlDocument = new XmlDocument ();
		xmlDocument.LoadXml ("<DemoRoot><Person ID='ABCD123'><Name><First>John</First><Middle>P.</Middle><Last>Doe</Last></Name><Address><Street>123 Duck Street</Street><City>New City</City><State>New York</State><Country>United States</Country></Address></Person><Person ID='ABCD456'><Name><First>Peter</First><Middle>Z.</Middle><Last>Smith</Last></Name><Address><Street>12 Hollow Street</Street><City>Philadelphia</City><State>Pennsylvania</State><Country>United States</Country></Address></Person></DemoRoot>");

		return xmlDocument;
	}
}

@TestFixture
public class WhenAClientIsPresented
{
	@Test
	function TestsForUNITYANDROID ()
	{
		Assert.True (true);
	}
}        

/// <summary>
/// Custom class for testing the encryption and decryption 
/// </summary>
public class CustomClass
{
	var foo:String = "hi!";
	var bar:int[] = [1,2,3,4,5];
}
