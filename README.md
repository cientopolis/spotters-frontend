# Spotters

Spotters is a Citizen Science Application Framework.
This repository holds the frontend part of the framework, used to generate the application that final users will see and interact with.
The [spotters-backend](https://github.com/cientopolis/spotters-backend) repository holds the API/backend of the framework.

## Prerequisites

To run the application generated you will need:
* A running instance of the [spotters-backend](https://github.com/cientopolis/spotters-backend)
* [Auth0 Account](https://auth0.com/)
* [Google Maps API Key](https://developers.google.com/maps/documentation/javascript/get-api-key?hl=ES#key)

## Installation

First, the CLI tool from [Ionic Framework](https://ionicframework.com/) is needed to run this project:

```
npm install -g ionic@latest
```

Then clone or download this repository and from a terminal navigate to its directory and run:

```
npm install
cp src/app/app.constants.sample.ts src/app/app.constants.ts
```

Complete app.constants.ts with your own keys and the url of your spotters-backend instance:

```
nano src/app/app.constants.ts
```

Finally, you can run the application in development mode running:

```
ionic serve
```

It is also possible to copy the www folder generated in the previous step to your webserver (Nginx, Apache, etc.) and access it directly through a virtualhost or your preferred method.
