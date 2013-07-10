imap-client
===========

A very simple command-line imap client.

####How does it work?
* Create an Imapfile.js file in the root of the app and type in (I mean copy and paste) the following (you obviously need to replace the placeholders with your real creds.):

```javascript
exports.creds = {
    user: %username%,
    password: %password%,
    host: %host%,
    port: %port%,
    secure: %secure%
}
```

* And execute the following

```bash
$ node index.js #execute index.js
$ Imap> check #issue the command 'check' when prompted for input. You may also use the 'c' command.
$ Check mail
$ 
$ Connecting...
$ Mailbox opened
$ July 09, 2013 09:37AM Re: blah blah
$ July 09, 2013 09:49AM Re: foo bar baz
$ Done fetching all messages.
$ 
$ Imap> quit #issue command to exit app
```

That's it (for now).

####Todo
* Add colors
* Ability to choose a mailbox to retrieve emails from i.e INBOX, Sent etc
* See the number of new emails in a mailbox
* View the body and header of an email
* Send a simple text email
