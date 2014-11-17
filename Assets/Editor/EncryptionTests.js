#pragma strict

import NUnit.Framework;

@TestFixture
public class EncryptionTests
{
	/// <summary>
	/// Tests the yay decryption.
	/// Assumes that the input message is deserialized  
	/// Decrypted string should match yay!
	/// </summary>
	@Test
	function TestYayDecryptionBasic ()
	{
		var pubnubCrypto:PubnubCrypto = new PubnubCrypto ("enigma");
		
		var message:String = "q/xJqqN6qbiZMXYmiQC1Fw==";
		
		//decrypt
		var decrypted:String = pubnubCrypto.Decrypt (message);
		Assert.True (("yay!").Equals (decrypted));
	}
	
	/// <summary>
	/// Tests the yay encryption.
	/// The output is not serialized
	/// Encrypted string should match q/xJqqN6qbiZMXYmiQC1Fw==
	/// </summary>
	@Test
	function TestYayEncryptionBasic ()
	{
		var pubnubCrypto:PubnubCrypto  = new PubnubCrypto ("enigma");
		//deserialized string
		var message:String = "yay!";
		//Encrypt
		var encrypted:String = pubnubCrypto.Encrypt (message);
		Assert.True (("q/xJqqN6qbiZMXYmiQC1Fw==").Equals (encrypted));
	}

	/// <summary>
	/// Tests the yay decryption.
	/// Assumes that the input message is not deserialized  
	/// Decrypted and Deserialized string should match yay!
	/// </summary>
	@Test
	function TestYayDecryption ()
	{
		var pubnubCrypto:PubnubCrypto  = new PubnubCrypto ("enigma");
		//Non deserialized string
		var message:String = "\"Wi24KS4pcTzvyuGOHubiXg==\"";

		//Deserialize 
		message = Common.Deserialize (message) as String;
		//decrypt
		var decrypted:String = pubnubCrypto.Decrypt (message);
		//deserialize again
		//message = Common.DeserializeString (decrypted);
		message = Common.Deserialize (decrypted) as String;
		Assert.True (("yay!").Equals (message));
	}
	
	/// <summary>
	/// Tests the yay encryption.
	/// The output is not serialized
	/// Encrypted string should match Wi24KS4pcTzvyuGOHubiXg==
	/// </summary>
	@Test
	function TestYayEncryption ()
	{
		var pubnubCrypto:PubnubCrypto  = new PubnubCrypto ("enigma");
		//deserialized string
		var message:String = "yay!";
		//serialize the string
		//message = Common.SerializeString (message);
		message = Common.Serialize (message);
		Debug.Log(message);
		//Encrypt
		var encrypted:String = pubnubCrypto.Encrypt (message);
		Assert.True (("Wi24KS4pcTzvyuGOHubiXg==").Equals (encrypted));
	}

	/// <summary>
	/// Tests the array encryption.
	/// The output is not serialized
	/// Encrypted string should match the serialized object
	/// </summary>
	@Test
	function TestArrayEncryption ()
	{
		var pubnubCrypto:PubnubCrypto  = new PubnubCrypto ("enigma");
		//create an empty array object
		var objArr = [];
		var message = Common.Serialize (objArr);
		//Encrypt
		var encrypted:String = pubnubCrypto.Encrypt (message);
		Debug.Log("encrypted:"+encrypted);
		Assert.True (("Ns4TB41JjT2NCXaGLWSPAQ==").Equals (encrypted));
	}

	/// <summary>
	/// Tests the array decryption.
	/// Assumes that the input message is deserialized
	/// And the output message has to been deserialized.
	/// Decrypted string should match the serialized object
	/// </summary>
	@Test
	function TestArrayDecryption ()
	{
		var pubnubCrypto:PubnubCrypto  = new PubnubCrypto ("enigma");
		//Input the deserialized string
		var message:String = "Ns4TB41JjT2NCXaGLWSPAQ==";
		//decrypt
		var decrypted:String = pubnubCrypto.Decrypt (message);
		//create a serialized object
		var objArr = [];
		var result = Common.Serialize (objArr);
		Debug.Log("decrypted:"+decrypted);
		//var result:String = Common.Serialize (objArr);
		//compare the serialized object and the return of the Decrypt method
		Assert.True ((result).Equals (decrypted));
	}

	/// <summary>
	/// Tests the object encryption.
	/// The output is not serialized
	/// Encrypted string should match the serialized object
	/// </summary>
	@Test
	function TestObjectEncryption ()
	{
		var pubnubCrypto:PubnubCrypto  = new PubnubCrypto ("enigma");
		//create an object
		var obj = new Object ();;
		var message = Common.Serialize (obj);
		
		//Encrypt
		var encrypted:String = pubnubCrypto.Encrypt (message);
		Debug.Log("encrypted:"+encrypted);

		Assert.True (("IDjZE9BHSjcX67RddfCYYg==").Equals (encrypted));
	}

	/// <summary>
	/// Tests the object decryption.
	/// Assumes that the input message is deserialized
	/// And the output message has to be deserialized.
	/// Decrypted string should match the serialized object
	/// </summary>
	@Test
	function TestObjectDecryption ()
	{
		var pubnubCrypto:PubnubCrypto  = new PubnubCrypto ("enigma");
		//Deserialized
		var message:String = "IDjZE9BHSjcX67RddfCYYg==";
		//Decrypt
		var decrypted:String = pubnubCrypto.Decrypt (message);
		//create an object
		var obj = new Object ();;
		//Serialize the object		
		var result = Common.Serialize (obj);
		Assert.True ((decrypted).Equals (result));
	}

	/// <summary>
	/// Tests my object encryption.
	/// The output is not serialized 
	/// Encrypted string should match the serialized object
	/// </summary>
	@Test
	function TestMyObjectEncryption ()
	{
		var pubnubCrypto:PubnubCrypto  = new PubnubCrypto ("enigma");
		//create an object of the custom class
		var cc:CustomClass = new CustomClass ();
		
		//serialize it
		var result:String = Common.Serialize (cc);
		//encrypt it
		var encrypted:String = pubnubCrypto.Encrypt (result);

		UnityEngine.Debug.Log ("encrypted:" + encrypted);
		UnityEngine.Debug.Log ("result:" + result);
		Assert.True (("Zbr7pEF/GFGKj1rOstp0tWzA4nwJXEfj+ezLtAr8qqE=").Equals (encrypted));
	}

	/// <summary>
	/// Tests my object decryption.
	/// The output is not deserialized
	/// Decrypted string should match the serialized object
	/// </summary>
	@Test
	function TestMyObjectDecryption ()
	{
		var pubnubCrypto:PubnubCrypto  = new PubnubCrypto ("enigma");
		//Deserialized
		var message:String = "Zbr7pEF/GFGKj1rOstp0tWzA4nwJXEfj+ezLtAr8qqE=";
		//Decrypt
		var decrypted:String = pubnubCrypto.Decrypt (message);
		//create an object of the custom class
		var cc:CustomClass = new CustomClass ();
		//Serialize it
		var result:String = Common.Serialize (cc);

		UnityEngine.Debug.Log ("decrypted:" + decrypted);
		UnityEngine.Debug.Log ("result:" + result);
		Assert.True ((decrypted).Equals (result));
	}

	/// <summary>
	/// Tests the pub nub encryption2.
	/// The output is not serialized
	/// Encrypted string should match f42pIQcWZ9zbTbH8cyLwB/tdvRxjFLOYcBNMVKeHS54=
	/// </summary>
	@Test
	function TestPubNubEncryption2 ()
	{
		var pubnubCrypto:PubnubCrypto  = new PubnubCrypto ("enigma");
		//Deserialized
		var message:String = "Pubnub Messaging API 2";
		//serialize the message
		message = Common.Serialize (message);
		//encrypt
		var encrypted:String = pubnubCrypto.Encrypt (message);

		Assert.True (("f42pIQcWZ9zbTbH8cyLwB/tdvRxjFLOYcBNMVKeHS54=").Equals (encrypted));
	}

	/// <summary>
	/// Tests the pub nub decryption2.
	/// Assumes that the input message is deserialized  
	/// Decrypted and Deserialized string should match Pubnub Messaging API 2
	/// </summary>
	@Test
	function TestPubNubDecryption2 ()
	{
		var pubnubCrypto:PubnubCrypto  = new PubnubCrypto ("enigma");
		//Deserialized string    
		var message:String = "f42pIQcWZ9zbTbH8cyLwB/tdvRxjFLOYcBNMVKeHS54=";
		//Decrypt
		var decrypted:String = pubnubCrypto.Decrypt (message);
		//Deserialize
		message = Common.Deserialize (decrypted) as String;
		Assert.True (("Pubnub Messaging API 2").Equals (message));
	}

	/// <summary>
	/// Tests the pub nub encryption1.
	/// The input is not serialized
	/// Encrypted string should match f42pIQcWZ9zbTbH8cyLwByD/GsviOE0vcREIEVPARR0=
	/// </summary>
	@Test
	function TestPubNubEncryption1 ()
	{
		var pubnubCrypto:PubnubCrypto  = new PubnubCrypto ("enigma");
		//non serialized string
		var message:String = "Pubnub Messaging API 1";
		//serialize
		message = Common.Serialize (message);
		//encrypt
		var encrypted:String = pubnubCrypto.Encrypt (message);

		Assert.True (("f42pIQcWZ9zbTbH8cyLwByD/GsviOE0vcREIEVPARR0=").Equals (encrypted));
	}

	/// <summary>
	/// Tests the pub nub decryption1.
	/// Assumes that the input message is  deserialized  
	/// Decrypted and Deserialized string should match Pubnub Messaging API 1        
	/// </summary>
	@Test
	function TestPubNubDecryption1 ()
	{
		var pubnubCrypto:PubnubCrypto  = new PubnubCrypto ("enigma");
		//deserialized string
		var message:String = "f42pIQcWZ9zbTbH8cyLwByD/GsviOE0vcREIEVPARR0=";
		//decrypt
		var decrypted:String = pubnubCrypto.Decrypt (message);
		//deserialize
		message = Common.Deserialize (decrypted) as String;
		Assert.True (("Pubnub Messaging API 1").Equals (message));
	}

	/// <summary>
	/// Tests the stuff can encryption.
	/// The input is serialized
	/// Encrypted string should match zMqH/RTPlC8yrAZ2UhpEgLKUVzkMI2cikiaVg30AyUu7B6J0FLqCazRzDOmrsFsF
	/// </summary>
	@Test
	function TestStuffCanEncryption ()
	{
		var pubnubCrypto:PubnubCrypto  = new PubnubCrypto ("enigma");
		//input serialized string
		var message:String = "{\"this stuff\":{\"can get\":\"complicated!\"}}";
		//encrypt
		var encrypted:String = pubnubCrypto.Encrypt (message);

		Assert.True (("zMqH/RTPlC8yrAZ2UhpEgLKUVzkMI2cikiaVg30AyUu7B6J0FLqCazRzDOmrsFsF").Equals (encrypted));
	}

	/// <summary>
	/// Tests the stuffcan decryption.
	/// Assumes that the input message is  deserialized  
	/// </summary>
	@Test
	function TestStuffcanDecryption ()
	{
		var pubnubCrypto:PubnubCrypto  = new PubnubCrypto ("enigma");
		//deserialized string
		var message:String = "zMqH/RTPlC8yrAZ2UhpEgLKUVzkMI2cikiaVg30AyUu7B6J0FLqCazRzDOmrsFsF";
		//decrypt
		var decrypted:String = pubnubCrypto.Decrypt (message);

		Assert.True (("{\"this stuff\":{\"can get\":\"complicated!\"}}").Equals (decrypted));
	}

	/// <summary>
	/// Tests the hash encryption.
	/// The input is serialized
	/// Encrypted string should match GsvkCYZoYylL5a7/DKhysDjNbwn+BtBtHj2CvzC4Y4g=
	/// </summary>
	@Test
	function TestHashEncryption ()
	{
		var pubnubCrypto:PubnubCrypto  = new PubnubCrypto ("enigma");
		//serialized string
		var message:String = "{\"foo\":{\"bar\":\"foobar\"}}";
		//encrypt
		var encrypted:String = pubnubCrypto.Encrypt (message);

		Assert.True (("GsvkCYZoYylL5a7/DKhysDjNbwn+BtBtHj2CvzC4Y4g=").Equals (encrypted));
	}

	/// <summary>
	/// Tests the hash decryption.
	/// Assumes that the input message is  deserialized  
	/// </summary>        
	@Test
	function TestHashDecryption ()
	{
		var pubnubCrypto:PubnubCrypto  = new PubnubCrypto ("enigma");
		//deserialized string
		var message:String = "GsvkCYZoYylL5a7/DKhysDjNbwn+BtBtHj2CvzC4Y4g=";
		//decrypt
		var decrypted:String = pubnubCrypto.Decrypt (message);

		Assert.True (("{\"foo\":{\"bar\":\"foobar\"}}").Equals (decrypted));
	}

	/// <summary>
	/// Tests the null encryption.
	/// The input is serialized
	/// </summary>
	@Test
	@ExpectedException (typeof(System.ArgumentNullException))
	function TestNullEncryption ()
	{
		var pubnubCrypto:PubnubCrypto  = new PubnubCrypto ("enigma");
		//serialized string
		var message:String = null;
		//encrypt
		var encrypted:String = pubnubCrypto.Encrypt (message);

		Assert.True (("").Equals (encrypted));
	}

	/// <summary>
	/// Tests the null decryption.
	/// Assumes that the input message is  deserialized  
	/// </summary>        
	@Test
	@ExpectedException (typeof(System.ArgumentNullException))
	function TestNullDecryption ()
	{
		var pubnubCrypto:PubnubCrypto  = new PubnubCrypto ("enigma");
		//deserialized string
		var message:String = null;
		//decrypt
		var decrypted:String = pubnubCrypto.Decrypt (message);

		Assert.True (("").Equals (decrypted));
	}

	/// <summary>
	/// Tests the unicode chars encryption.
	/// The input is not serialized
	/// </summary>
	@Test
	function TestUnicodeCharsEncryption ()
	{
		var pubnubCrypto:PubnubCrypto  = new PubnubCrypto ("enigma");
		var message:String = "漢語";
		message = Common.Serialize (message);
		Debug.Log(message);
		var encrypted:String = pubnubCrypto.Encrypt (message);
		Debug.Log(encrypted);
		Assert.That (("+BY5/miAA8aeuhVl4d13Kg==").Equals (encrypted));
	}

	/// <summary>
	/// Tests the unicode decryption.
	/// Assumes that the input message is  deserialized  
	/// Decrypted and Deserialized string should match the unicode chars       
	/// </summary>
	@Test
	function TestUnicodeCharsDecryption ()
	{
		var pubnubCrypto:PubnubCrypto  = new PubnubCrypto ("enigma");
		var message:String = "+BY5/miAA8aeuhVl4d13Kg==";
		//decrypt
		var decrypted:String = pubnubCrypto.Decrypt (message);
		//deserialize
		message = Common.Deserialize (decrypted) as String;

		Assert.True (("漢語").Equals (message));
	}

	/// <summary>
	/// Tests the german chars decryption.
	/// Assumes that the input message is  deserialized  
	/// Decrypted and Deserialized string should match the unicode chars  
	/// </summary>
	@Test
	function TestGermanCharsDecryption ()
	{
		var pubnubCrypto:PubnubCrypto  = new PubnubCrypto ("enigma");
		var message:String = "stpgsG1DZZxb44J7mFNSzg==";
		//decrypt
		var decrypted:String = pubnubCrypto.Decrypt (message);
		//deserialize
		message = Common.Deserialize (decrypted) as String;

		Assert.True (("ÜÖ").Equals (message));
	}

	/// <summary>
	/// Tests the german encryption.
	/// The input is not serialized
	/// </summary>
	@Test
	function TestGermanCharsEncryption ()
	{
		var pubnubCrypto:PubnubCrypto  = new PubnubCrypto ("enigma");
		var message:String = "ÜÖ";
		message = Common.Serialize (message);
		Debug.Log("message:"+message);
		var encrypted:String = pubnubCrypto.Encrypt (message);
		Debug.Log("encrypted:"+encrypted);

		Assert.True (("stpgsG1DZZxb44J7mFNSzg==").Equals (encrypted));
	}

	@Test
	function TestPAMSignature ()
	{
		var pubnubCrypto:PubnubCrypto = new PubnubCrypto ("");
		var secretKey:String = "secret";
		var message:String = "Pubnub Messaging 1";

		var signature:String = pubnubCrypto.PubnubAccessManagerSign (secretKey, message);

		Assert.True (("mIoxTVM2WAM5j-M2vlp9bVblDLoZQI5XIoYyQ48U0as=").Equals (signature));
	}
}        
