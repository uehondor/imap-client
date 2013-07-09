var readline = require('readline'),
	Imap = require('imap')
	moment = require('moment');

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});


rl.setPrompt('Imap> ');
rl.prompt();


rl.on('line', function(cmd) {
	switch(cmd.trim()) {
		case 'c':
		case 'check':{
			console.log('Check mail');
			console.log();
			checkNewMail();
			break;
		}
		case 'q':
		case 'quit': {
			quit();
			break;
		}		
		default: {
			console.log('Say what? I might have heard `' + cmd.trim() + '`');
			rl.prompt();
			break;
		}
	}
}).on('close', function() {
	quit();
});

function quit() {
	console.log('Signing off.');
	process.exit(0);
}

function checkNewMail() {
	var creds = require('./Imapfile').creds;
	var imap = new Imap({
		user: creds.user,
		password: creds.password,
		host: creds.host,
		port: creds.port,
		secure: creds.secure
	});

	function show(obj) {
		return inspect(obj, false, Infinity);
	}

	function die(err) {
		console.log('Uh oh: ' + err);
		process.exit(1);
	}

	function checkError(err) {
		if (err) {
			die(err);
		}
	}

	function formatDate(date, includeTime, relative) {
		if (relative) {
			return date.fromNow();
		}

		var format = 'MMMM DD, YYYY';
		if (includeTime) {
			format += ' hh:mmA';
		}

		return date.format(format);
	}

	function onMailboxOpen(error, mailbox) {
		checkError(error);
		console.log('Mailbox opened');

		var sinceDate = moment();
		sinceDate.subtract('days', 1); //since yesterday

		imap.search(
			[ 'UNSEEN', ['SINCE', formatDate(sinceDate, false)]], 
			function(error, results) {
				checkError(error);

				imap.fetch(
					results,
					{
						headers: ['from', 'to', 'subject', 'date'],
						cb: function(fetch) {
							fetch.on('message', function(msg) {
								msg.on('headers', function(hdrs) {
									var date = moment(hdrs.date[0]);
									console.log(formatDate(date, true) + ' ' + hdrs.subject[0]);
								});
							});
						}
					},
					function(error) {
						if (error) {
							throw error;
						}

						console.log('Done fetching all messages.');
						imap.logout();

						rl.prompt();
					}
				);
			}
		);
	}

	function onConnect(error) {
		console.info('Connecting...');
		checkError(error);

		imap.openBox('INBOX', true, onMailboxOpen);
	}


	imap.connect(onConnect);
}