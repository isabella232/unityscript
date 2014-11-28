using System;
using System.Text;
using System.Text.RegularExpressions;
using System.Globalization;

public class CommonMethods
{
		/// <summary>
        /// Converts the upper case hex to lower case hex.
        /// </summary>
        /// <returns>The lower case hex.</returns>
        /// <param name="value">Hex Value.</param>
        public static string ConvertHexToUnicodeChars (string value)
        {
            //if(;
            return Regex.Replace (
                value,
                @"\\u(?<Value>[a-zA-Z0-9]{4})",
                m => {
                    return ((char)int.Parse (m.Groups ["Value"].Value, NumberStyles.HexNumber)).ToString ();
                }     
            );
        }	
        
        /*public static string ConvertUnicodeToHex(string s){
        	string encodedUri = "";
            StringBuilder o = new StringBuilder ();
            foreach (char ch in s) {
                if (IsUnsafe (ch, ignoreComma)) {
                    o.Append ('%');
                    o.Append (ToHex (ch / 16));
                    o.Append (ToHex (ch % 16));
                    //UnityEngine.Debug.Log("message1:" + ch.ToString());
                } else {
                    if (ch == ',' && ignoreComma) {
                        o.Append (ch.ToString ());
                    } else if (Char.IsSurrogate (ch)) {
                        //o.Append ("\\u" + ((int)ch).ToString ("x4"));
                        o.Append (ch);
                    } else {
                        string escapeChar = System.Uri.EscapeDataString (ch.ToString ());
                        //UnityEngine.Debug.Log("message2:" + ch.ToString() + escapeChar.ToString());
                        o.Append (escapeChar);
                    }
                }
            }
            encodedUri = o.ToString ();
            return encodedUri;
        }
        
        public static bool IsUnsafe (char ch, bool ignoreComma)
        {
            if (ignoreComma) {
                return " ~`!@#$%^&*()+=[]\\{}|;':\"/<>?".IndexOf (ch) >= 0;
            } else {
                return " ~`!@#$%^&*()+=[]\\{}|;':\",/<>?".IndexOf (ch) >= 0;
            }
        }*/
}