var autoReconnect = true;
var autoMark = true;
var Slack = require('slack-client');
var slack = new Slack('xoxb-9882501029-iLuuVgHNPjZ4fJKdxLfROFaP', autoReconnect, autoMark);
var sayings = require('./sayings');
slack.on('message', function(message) {
    var channel, channelError, channelName, errors, response, text, textError, ts, type, typeError, user, userName;
    channel = slack.getChannelGroupOrDMByID(message.channel);
    user = slack.getUserByID(message.user);
    response = '';
    type = message.type, ts = message.ts, text = message.text;
    channelName = (channel != null ? channel.is_channel : void 0) ? '#' : '';
    channelName = channelName + (channel ? channel.name : 'UNKNOWN_CHANNEL');
    userName = (user != null ? user.name : void 0) != null ? "@" + user.name : "UNKNOWN_USER";
    if (type === 'message' && (text != null) && (channel != null)) {
        try {
            Object.keys(sayings).forEach(function(key) {
                if (text.indexOf(key) > -1) {
                    channel.send(sayings[key]);
                    throw new Error('break');
                }
            });
        } catch(e) {}

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