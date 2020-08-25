## Before you begin

1. Select or create a Cloud project with an App Engine app and enable billing, create a queue
2. [Install Cloud SDK](https://cloud.google.com/sdk/docs) and configure  `gcloud`
3. Configure the Slack app
    
    3.1 Create the app => `random-picker`
    
    3.2 Request mandatory scopes: `chat:write`, `commands`, `usergroups:read`, `users:read`
    
    3.3 Install the app
    
    3.4 Create Slash commands (name and URL) => `/randompicker`, `/randompickerlater`

## Running your app

1. Export env vars :
- `export SLACK_TOKEN=XXX` where XXX is `Bot User OAuth Access Token` found in Slack app OAuth & Permissions page
- `export PROJECT_NAME=XXX` where XXX is the cloud project name
- `export QUEUE_NAME=XXX` where XXX is the queue name
- `export LOCATION=XXX` where XXX is the location (e.g. `europe-west1`)

2. Install your app dependencies using the npm command:

`npm install`

3. Run the app:

`npm start`

## Deploying the app to App Engine

1. Replace env vars in `app.yaml`

2. In your terminal window, deploy the app to App Engine using the gcloud tool: 

```
# on the command-line
gcloud app deploy
```

## Using the Slash command

1. Type the command into your Slack channel:

`/randompicker @engineering`: pick someone randomly in @engineering group

`/randompickerlater @engineering in 5s`: pick someone randomly 5s later

2. Watch the logs to be sure the executions have completed

## TODO

- La commande `randompickerlater` n'est pas vraiment utile en tant que telle,
le but était de créer une commande pour planifier une tâche cron qui appellerait le picker.
 GCP ne semble pas proposer d'option (Cloud Scheduler ?) pour planifier des tâches cron de manière programmatique (c'est pour ça que j'utilise ici des Cloud Tasks). A creuser...
- ignore users option
- random with rotation (like Spotify)
- secure endpoints (OAuth?)
- control checks (e.g. endpoint parameters)
- call payfit API to ignore users in vacation => but no API!