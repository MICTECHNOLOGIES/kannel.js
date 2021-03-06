# KANNEL Box Protocol for Nodejs (v0.0.5)
[![NPM](https://nodei.co/npm/kannel.png?downloads=true&stars=true)](https://nodei.co/npm/kannel/) [![NPM](https://nodei.co/npm-dl/kannel.png?months=1)](https://nodei.co/npm/kannel/)

### Installation
<pre>
npm install kannel
</pre>

### Connect to bearerbox using object config
<pre>
	var kannel = require('kannel'),
	    app = new kannel.smsbox({
			host : '192.168.10.3', // bearerbox host - default '127.0.0.1'
			port : 14001, //smsc connection port - default 13001
			id   : "helloBox", // smsc id - defaut ""
			frequence : 1 // hearbeat - default 5s
		});
	app.on('connect',function(){
		console.log("hello box is connected to "+app.conf["host"]+":"+app.conf['port']);
	});
	app.connect();
</pre>

### Connect to bearerbox using kannel config file information
<pre>
	var kannel = require('kannel'),
	    app = new kannel.smsbox("kannel/kannel.conf?"+
	    	"host=$..bearerbox-host&"+
	    	"port=$..smsbox-port&"+
	    	"id=$.smsbox[-1:].smsbox-id&"+
	    	"frequence=$.smsbox[-1:].frequence-time"
	    );
	app.on('connect',function(){
		console.log("hello box is connected to "+app.conf["host"]+":"+app.conf['port']);
	});
	app.connect();
</pre>

The parser use [JSONpath](http://goessner.net/articles/JsonPath/) for access to the json representation of the conf file.

### Receive / Send SMS
<pre>
	var kannel = require('kannel'),
	    app = new kannel.smsbox("kannel/kannel.conf?"+
	    	"host=$..bearerbox-host&"+
	    	"port=$..smsbox-port&"+
	    	"id=$.smsbox[-1:].smsbox-id&"+
	    	"frequence=$.smsbox[-1:].frequence-time"
	    );
	app.on('connect',function(){
		console.log("hello box is connected to "+app.conf["host"]+":"+app.conf['port']);
	});
	app.on("sms",function(data){
		console.log("Recive SMS ",
			" [FROM:",data.sender.toString(),
			"][TO:",data.receiver.toString(),
			"][MSG :",data.msgdata.toString(),
		"]");
		app.sendSMS({
		  sender: data.receiver,
		  receiver: data.sender,
		  msgdata: 'Hello', // string or buffer
		  id : data.id
		});	
	});
	app.connect();
</pre>


### Send a delivery to SMS
<pre>
	var kannel = require('kannel'),
	    app = new kannel.smsbox("kannel/kannel.conf?"+
	    	"host=$..bearerbox-host&"+
	    	"port=$..smsbox-port&"+
	    	"id=$.smsbox[-1:].smsbox-id&"+
	    	"frequence=$.smsbox[-1:].frequence-time"
	    );
	app.on('connect',function(){
		console.log("hello box is connected to "+app.conf["host"]+":"+app.conf['port']);
	});
	app.on("sms",function(data){
		console.log("Recive SMS ",
			" [FROM:",data.sender.toString(),
			"][TO:",data.receiver.toString(),
			"][MSG :",data.msgdata.toString(),
		"]");
		app.write("ack",{
			nack : kannel.status.ack.success,
			time :  Math.floor((new Date).getTime()/1000),
			id   :  data.id
		});
	});
	app.connect();
</pre>


### Receive ADMIN command from bearerbox
<pre>
	var kannel = require('kannel'),
	    app = new kannel.smsbox("kannel/kannel.conf?"+
	    	"host=$..bearerbox-host&"+
	    	"port=$..smsbox-port&"+
	    	"id=$.smsbox[-1:].smsbox-id&"+
	    	"frequence=$.smsbox[-1:].frequence-time"
	    );
	app.on('connect',function(){
		console.log("hello box is connected to "+app.conf["host"]+":"+app.conf['port']);
	});
	app.on("admin",function(data){
		console.log("Receive ADMIN CMD ",
			" [CODE:",data.command,
			"][FROM BOX:",data.boxc_id.toString(),
		"]");
		switch(data.command){
			case kannel.status.admin.shutdown:
				/*Shutdown*/
				console.log("Receive shutdown command...bye");
				process.exit();
				break;
		};
	});
	app.connect();
</pre>

### How test samples
Run bearebox
<pre>
	$ cd path/to/kannel.js
	$ sudo bearerbox kannel/kannel.conf
</pre>


##### Test hellobox (REPL sms)
![alt tag](https://raw.githubusercontent.com/badlee/kannel.js/master/img/hello.png)
<pre>
    $ cd path/to/kannel.js
    $ node samples/hellobox
    hello box is connected to 127.0.0.1:14001
    for send a message tip 
        SMS > FROM TO Your Message
        Exp:  070805 09505 hello SMS.
    SMS > 
</pre>
Type your SMS in REPL console, the server send a echo responce for each recieved sms. 


##### Test messagesBoard (websocket and sms chat)
![alt tag](https://raw.githubusercontent.com/badlee/kannel.js/master/img/messageBoard.png)
<pre>
	$ cd path/to/kannel.js
	$ node samples/messagesBoard
	Fri Apr 11 2014 04:09:22 GMT+0100 (WAT) Server is listening on port 14014
</pre>
Goto to http://127.0.0.1:14014,
Type your name, your message or send sms for chat, Enjoy your chat.


##### Test scripting (coffeeScript and javascript VAS applications)
![alt tag](https://raw.githubusercontent.com/badlee/kannel.js/master/img/scripting.png)
<pre>
	$ cd path/to/kannel.js
	$ node samples/scripting
	Fri Apr 11 2014 04:09:22 GMT+0100 (WAT) Server is listening on port 14014
</pre>
Goto to http://127.0.0.1:14014, for show the dashboard.
Goto to samples/scripting/public/scripts for sms service.
The SMS services is identified by the name of script whitout extension. ( Ex : "FUTURE" represent futur.coffee, "COUNT" represent count.js )

You can also send SMS from http request
<pre>
/cgi-bin/sendsms
	send sms GET request

Paramametres
	from : default "****"
	to : receiver 
	text : SMS to send

Response
	Success : http code 200 
	Fails	: http code 403

Exemple : http://127.0.0.1:14014/cgi-bin/sendsms?from=07086&to=05026&text=Test
</pre>

### License

(The MIT License)

Copyright (c) 2007-2009 Ulrich Badinga &lt;badinga.ulrich@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.