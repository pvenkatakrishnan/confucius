var autoReconnect = true;
var autoMark = true;
var Slack = require('slack-client');
var slack = new Slack('xoxb-9882501029-iLuuVgHNPjZ4fJKdxLfROFaP', autoReconnect, autoMark);
var app = require('express')();
var sayings = require('./sayings');
slack.on('message', function(message) {

    var channel, channelError, channelName, errors, response, text, textError, ts, type, typeError, user, userName;
    channel = slack.getChannelGroupOrDMByID(message.channel);
    type = message.type, ts = message.ts, text = message.text;
    if (type === 'message' && (text != null) && (channel != null)) {
        console.info('text', text);
        try {
            Object.keys(sayings).forEach(function(key) {
                if (text.indexOf(key) > -1) {
                    channel.send(sayings[key]);
                    throw new Error('break');
                }
            });
        } catch(e) { }

    } else {
        typeError = type !== 'message' ? "unexpected type " + type + "." : null;
        textError = text == null ? 'text was undefined.' : null;
        channelError = channel == null ? 'channel was undefined.' : null;
        errors = [typeError, textError, channelError].filter(function(element) {
            return element !== null;
        }).join(' ');
        return console.log("@" + slack.self.name + " could not respond. " + errors);
    }
});

slack.on('error', function(error) {
    return console.error("Error: " + error);
});

slack.login();
var port = process.env.PORT || 8080;
app.listen(port, function() {
    console.info("listening on ", port);
});