#pragma strict

import NUnit.Framework;
import System;

@TestFixture
public class PresenceTests
{
	@Test
	function CustomUUID ()
	{
		var cmb = Common.InitTest("", "customuuid", false, true);
		var channel = "UnityScriptTestCustomUUID";
		var controller:CoroutineController;
		//var e:IEnumerator = Common.pubnubCommon.Subscribe(channel, false, Common.ParseResponseDummy, Common.ParseResponseDummy);
		
		//cmb.Init(Common.pubnubCommon, channel, controller, Common.ParseResponseDummy, Common.ParseResponseDummy);
		cmb.StartCoroutineEx(Common.pubnubCommon.Subscribe(channel, false, Common.ParseResponseDummy, Common.ParseResponseDummy), controller);

		cmb.StartCoroutine(Common.pubnubCommon.HereNow(channel, Common.ParseResponse));
		
		if(Common.response != null){
			var i = Common.response.length;

			if(i > 0){
				var output:Object[] = JsonReader.Deserialize (Common.response[0].ToString()) as Object[];
				if(output.Length > 0){
					var output2:Object[] = output[0] as Object[];
					Debug.Log("Reponse:" + output2[0].ToString());
				} else {
					Assert.Fail("CustomUUID null test failed");
				}
			} else {
				Assert.Fail ("CustomUUID null test failed, length 0");
			}
		} else {
			Assert.Fail("CustomUUID null test failed, response null");			
		}	
		cmb.StartCoroutine(Common.pubnubCommon.Unsubscribe(channel, false, Common.ParseResponseDummy));
	}
	
	 /*[Test]
        public void ThenPresenceShouldReturnCustomUUID ()
        {
            Pubnub pubnub = new Pubnub (Common.PublishKey,
                          Common.SubscribeKey,
                          "", "", false);

            Common commonHereNow = new Common ();
            commonHereNow.DeliveryStatus = false;
            commonHereNow.Response = null;

            Common commonSubscribe = new Common ();
            commonSubscribe.DeliveryStatus = false;
            commonSubscribe.Response = null;

            pubnub.PubnubUnitTest = commonHereNow.CreateUnitTestInstance ("WhenAClientIsPresented", "ThenPresenceShouldReturnCustomUUID");
            ;
            pubnub.SessionUUID = "CustomSessionUUIDTest";

            string channel = "hello_world3";
            pubnub.Unsubscribe<string> (channel, commonSubscribe.DisplayReturnMessageDummy, commonSubscribe.DisplayReturnMessageDummy, commonSubscribe.DisplayReturnMessage, commonSubscribe.DisplayReturnMessage);
            commonSubscribe.WaitForResponse (30);

            pubnub.Subscribe<string> (channel, commonSubscribe.DisplayReturnMessageDummy, commonSubscribe.DisplayReturnMessage, commonSubscribe.DisplayReturnMessage);

            commonSubscribe.WaitForResponse (30);
            Thread.Sleep (5000);

            pubnub.HereNow<string> (channel, commonHereNow.DisplayReturnMessage, commonHereNow.DisplayReturnMessage);

            commonHereNow.WaitForResponse (30);
            pubnub.Unsubscribe<string> (channel, commonSubscribe.DisplayReturnMessageDummy, commonSubscribe.DisplayReturnMessageDummy, commonSubscribe.DisplayReturnMessageDummy, commonSubscribe.DisplayReturnMessage);

            if (commonHereNow.Response != null) {
                #if (USE_JSONFX || USE_JSONFX_UNITY || USE_JSONFX_UNITY_IOS|| USE_MiniJSON)
                #if (USE_JSONFX) 
				IList<object> fields = new JsonFXDotNet ().DeserializeToObject (commonHereNow.Response.ToString ()) as IList<object>;
                #elif (USE_JSONFX_UNITY)
				IList<object> fields = new JsonFXDotNet ().DeserializeToObject (commonHereNow.Response.ToString ()) as IList<object>;
                #elif (USE_JSONFX_UNITY_IOS)
                IList<object> fields = JsonReader.Deserialize<IList<object>> (commonHereNow.Response.ToString ()) as IList<object>;
                #elif (USE_MiniJSON)
				IList<object> fields = Json.Deserialize (commonHereNow.Response.ToString ()) as IList<object>;
                #endif
                if (fields [0] != null) {
                    bool result = false;
                    Dictionary<string, object> message = (Dictionary<string, object>)fields [0];
                    foreach (KeyValuePair<String, object> entry in message) {
                        Console.WriteLine ("value:" + entry.Value + "  " + "key:" + entry.Key);
                        Type valueType = entry.Value.GetType ();
                        var expectedType = typeof(string[]);
                        if (valueType.IsArray && expectedType.IsAssignableFrom (valueType)) {
                            List<string> uuids = new List<string> (entry.Value as string[]);
                            if (uuids.Contains (pubnub.SessionUUID)) {
                                result = true;
                                break;
                            }
                        }
                    }
                    Assert.True (result);
                } else {
                    Assert.Fail ("Null response");
                }
                #else
								object[] serializedMessage = JsonConvert.DeserializeObject<object[]>(commonHereNow.Response.ToString());
								JContainer dictionary = serializedMessage[0] as JContainer;
								var uuid = dictionary["uuids"].ToString();
								if (uuid != null)
								{
								Assert.True(uuid.Contains(pubnub.SessionUUID));
								} else {
								Assert.Fail("Custom uuid not found.");
								}
                #endif
            } else {
                Assert.Fail ("Null response");
            }
            pubnub.EndPendingRequests ();
        }
    }*/
}	