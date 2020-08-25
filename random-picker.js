const {CloudTasksClient} = require('@google-cloud/tasks');
const { WebClient } = require('@slack/web-api');


// Create a new instance of the WebClient class with the token read from your environment variable
const web = new WebClient(process.env.SLACK_TOKEN);

// Instantiates a client.
const client = new CloudTasksClient();

const project = process.env.PROJECT_NAME;
const queue = process.env.QUEUE_NAME;
const location = process.env.LOCATION;

// Construct the fully qualified queue name.
const parent = client.queuePath(project, location, queue);

const getRandomInt = max => {
    return Math.floor(Math.random() * Math.floor(max));
}

const listUsersInGroup = async groupId => {
    try {
        return await web.usergroups.users.list({
            usergroup: groupId,
        });
    } catch (error) {
        console.log(error);
    }
}

const pick = async groupId => {
    const users = await listUsersInGroup(groupId);
    const randomIndex = getRandomInt(users.users.length);
    return users.users[randomIndex];
}

exports.randomPicker = async groupId => {
    return await pick(groupId);
};

exports.randomPickerSendMessage = async picked => {
    try {
        // Use the `chat.postMessage` method to send a message from this app
        await web.chat.postMessage({
            channel: '#support-guy-picker',
            text: `Your turn <@${picked}>!`,
        });
    } catch (error) {
        console.log(error);
    }
}

exports.randomPickerSchedule = async (picked, delayInSeconds) => {
    const task = {
        appEngineHttpRequest: {
            httpMethod: 'POST',
            relativeUri: '/sendMessage',
            body: Buffer.from(picked).toString('base64'),
        },
        // The time when the task is scheduled to be attempted.
        scheduleTime: {
            seconds: delayInSeconds + Date.now() / 1000,
        },
    };

    console.log('Sending task:');
    console.log(task);
    // Send create task request.
    const request = {parent, task};
    const [response] = await client.createTask(request);
    const name = response.name;
    console.log(`Created task ${name}`);
}
