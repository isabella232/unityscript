#pragma strict
#pragma downcast


enum MsgType{
	chat,
	announce
}

private static var SEP = ":";

static function Encode( mtype: MsgType, fields: Array ){
	var t: int;
	t = mtype;
	var sb = System.Text.StringBuilder(t.ToString());
	
	for( var val: String in fields ){
		sb.Append( SEP );
		sb.Append( val.length );
		sb.Append( SEP );
		sb.Append( val );
	}
	
	return sb.ToString();
}

static function Decode( msg: String ): Array {
	var res: Array = new Array();
	var sb = System.Text.StringBuilder(msg.length);
	
	res.Push( System.Enum.Parse(MsgType, msg[0].ToString()) ); // message type
	
	var state = 0;	// 0: reading length; 1: reading data
	var flen = 0;	// length of next field
	for( var i=2; i<msg.length; i++ ){
		var c = msg[i];
		if( c == SEP || i == msg.length-1 ){
			if( state == 1 ){	// end of field
				if(i == msg.length-1) sb.Append( c ); // last char
				if( flen > sb.Length ) continue; // colon is part of msg
				res.Push( sb.ToString() );
				
			} else {	// end of field length
				flen = System.Convert.ToInt16(sb.ToString());
			}
			
			if(sb.Length > 0) sb.Remove(0,sb.Length); // reset stringbuilder
			state = 1-state;	// switch state
			
		} else sb.Append( c );
	}
	
	return res;
}


