'use strict';

// [START gae_node_request_example]
const express = require('express');
const bodyParser = require('body-parser');

const picker = require('./random-picker')

const app = express();

// Parse form data
app.use(bodyParser.urlencoded({extended: false}));

// By default, the Content-Type header of the Task request is set to "application/octet-stream"
// see https://cloud.google.com/tasks/docs/reference/rest/v2beta3/projects.locations.queues.tasks#AppEngineHttpRequest
const rawParser = bodyParser.raw({type: 'application/octet-stream'});

app.get('/', (req, res) => {
    res.status(200).send('Hello, world!').end();
});

// slash command with response: pick a random user among a group
app.post('/pick', async (req, res) => {
    const userGroupRegex = /<!subteam\^([A-Z0-9]+)\|?.*>/;
    const groupId = req.body.text.match(userGroupRegex)[1];
    const picked = await picker.randomPicker(groupId);
    res.status(200).send({
        "response_type": "in_channel",
        "text":`Your turn <@${picked}>!`
    }).end();
});

// hook: pick and send message to slack (schedule handler)
app.post('/sendMessage', rawParser, async (req, res) => {
    const picked = Buffer.from(req.body).toString('utf-8')
    await picker.randomPickerSendMessage(picked);
    res.status(200).send('Message posted!').end();
});

// slash command with response: pick asynchronously (send to queue)
app.post('/schedule', async (req, res) => {
    const userGroupRegex = /<!subteam\^([A-Z0-9]+)\|?.*>/;
    const groupId = req.body.text.match(userGroupRegex)[1];
    const picked = await picker.randomPicker(groupId);
    const delayRegex = /in (\d+)s/;
    const delay = parseInt(req.body.text.match(delayRegex)[1]);
    await picker.randomPickerSchedule(picked, delay);
    res.status(200).send(`Message scheduled (in ${delay}s)!`).end();
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]

module.exports = app;
