import System.Security.Cryptography;

class PubnubCrypto
{
	var cipherKey:String = "";

	function PubnubCrypto (cipher_key:String)
	{
		cipherKey = cipher_key;
	}

	function ComputeHashRaw (input:String): String
	{
		var algorithm: HashAlgorithm = new System.Security.Cryptography.SHA256Managed ();

		var inputBytes: Byte[] = System.Text.Encoding.UTF8.GetBytes (input);
		var hashedBytes: Byte[] = algorithm.ComputeHash (inputBytes);
		return BitConverter.ToString (hashedBytes);
	}

	function EncryptOrDecrypt (type:boolean, plainStr:String): String
	{
		{
			var origmsg = plainStr;
			//var params:json = json.fromString(plainStr);
			//plainStr = params.getString(0); 
			var aesEncryption:RijndaelManaged = new RijndaelManaged ();
			aesEncryption.KeySize = 256;
			aesEncryption.BlockSize = 128;
			//Mode CBC
			aesEncryption.Mode = CipherMode.CBC;
			//padding
			aesEncryption.Padding = PaddingMode.PKCS7;
			//get ASCII bytes of the string
			aesEncryption.IV = System.Text.Encoding.ASCII.GetBytes ("0123456789012345");
			aesEncryption.Key = System.Text.Encoding.ASCII.GetBytes (GetEncryptionKey ());

			if (type) {
				var crypto:ICryptoTransform = aesEncryption.CreateEncryptor ();
				plainStr = EncodeNonAsciiCharacters (plainStr);
				var plainText:byte[] = Encoding.UTF8.GetBytes (plainStr);

				//encrypt
				var cipherText:byte[] = crypto.TransformFinalBlock (plainText, 0, plainText.Length);
				return Convert.ToBase64String (cipherText);
			} else {
				try {
					var decrypto:ICryptoTransform = aesEncryption.CreateDecryptor ();
					//decode
					var decryptedBytes:byte[]  = Convert.FromBase64CharArray (plainStr.ToCharArray (), 0, plainStr.Length);

					//decrypt
					var decrypted:String = System.Text.Encoding.UTF8.GetString (decrypto.TransformFinalBlock (decryptedBytes, 0, decryptedBytes.Length));

					return decrypted;
				} catch (ex) {
					Debug.Log (String.Format ("DateTime {0} Decrypt Error. {1}, Orig Msg: {2}", DateTime.Now.ToString (), ex.ToString (), origmsg));
					return(origmsg);
					//return "\"**DECRYPT ERROR**\"";
					//throw ex;
					//Debug.Log(string.Format("DateTime {0} Decrypt Error. {1}", DateTime.Now.ToString(), ex.ToString()));
					//return "**DECRYPT ERROR**";
				}
			}
		}
	}

	function GetEncryptionKey ():String
	{
		//Compute Hash using the SHA256 
		var strKeySHA256HashRaw:String = ComputeHashRaw (this.cipherKey);
		//delete the "-" that appear after every 2 chars
		var strKeySHA256Hash:String = (strKeySHA256HashRaw.Replace ("-", "")).Substring (0, 32);
		//convert to lower case
		return strKeySHA256Hash.ToLower ();
	}

	// encrypt string
	function Encrypt (plainText:String):String 
	{
		if (plainText == null || plainText.Length <= 0)
			throw new ArgumentNullException ("plainText");

		return EncryptOrDecrypt (true, plainText);
	}
	
	// decrypt string
	function Decrypt (cipherText:String):String 
	{
		if (cipherText == null)
			throw new ArgumentNullException ("cipherText");

		return EncryptOrDecrypt (false, cipherText);
	}

	/// <summary>
	/// Converts the upper case hex to lower case hex.
	/// </summary>
	/// <returns>The lower case hex.</returns>
	/// <param name="value">Hex Value.</param>
	function ConvertHexToUnicodeChars (value:String):String 
	{
		/*return Regex.Replace (
			value,
			"\\u(?<Value>[a-zA-Z0-9]{4})", 
			m => {
				return ((char)int.Parse (m.Groups ["Value"].Value, NumberStyles.HexNumber)).ToString ();
			}     
		);*/
	
		/*return System.Text.RegularExpressions.Regex.Replace (
			value,
			"\\u(?<Value>[a-zA-Z0-9]{4})", a(value)
		);*/
		return "";
	}
	
	/*function a(value:String){
		var i:int = int.Parse (value, System.NumberStyles.HexNumber);
		var c:char = System.Convert.ToChar(i);
		return c;
	}*/
	
	function pad_four(input) {
        var l = input.length;
        if (l == 0) return '0000';
        if (l == 1) return '000' + input;
        if (l == 2) return '00' + input;
        if (l == 3) return '0' + input;
        return input;
    }

	/// <summary>
	/// Encodes the non ASCII characters.
	/// </summary>
	/// <returns>
	/// The non ASCII characters.
	/// </returns>
	/// <param name='value'>
	/// Value.
	/// </param>
	function EncodeNonAsciiCharacters (value:String):String 
	{
		//#if (USE_JSONFX_UNITY || USE_JSONFX_UNITY_IOS)
		//value = ConvertHexToUnicodeChars(value);
		//#endif

		var sb:StringBuilder = new StringBuilder ();
		//var c:char;
		//foreach (c in value) {
		l = value.length; 
		/*for (var i = 0; i < l; i++){
			Debug.Log("value.charCodeAt(i)"+value.charCodeAt(i));
			if (value(i) > 127) {
				// This character is too big for ASCII
				//var encodedValue:String = "\\u" + ((int)c).ToString ("x4");
				var encodedValue:String = "\\u" + Convert.ToInt16(ch);//pad_four(value.charCodeAt(i).toString(16));
				sb.Append (encodedValue);
			} else {
				//sb.Append (c);
				sb.Append (value(i));
			}
		}*/
		//foreach (var c in value) {
		for(i=0; i<l; i++){
			var c:char;	
			c = value[i];
			if (c > 127) {
				// This character is too big for ASCII
				var j:int = c;
				var encodedValue:String = "\\u" + j.ToString ("x4");
				sb.Append (encodedValue);
				Debug.Log("c encodedValue: " + c + ":" + encodedValue);
			} else {
				sb.Append (c);
			}
        }
		return sb.ToString ();
	}

	function PubnubAccessManagerSign (key:String, data:String): String 
	{
		var secret:String = key;
		var message:String = data;

		var encoding:UTF8Encoding = new System.Text.UTF8Encoding ();
		var keyByte:byte[] = encoding.GetBytes (secret);
		var messageBytes:byte[] = encoding.GetBytes (message);

		var hmacsha256 = new HMACSHA256 (keyByte);
		var hashmessage:byte[] = hmacsha256.ComputeHash (messageBytes);
		return Convert.ToBase64String (hashmessage).Replace ('+', '-').Replace ('/', '_');
	}
}