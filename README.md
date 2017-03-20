# File converter

A basic implementation of scheduling file conversions and tracking live status notifications with Node and Angular.
The back-end and front-end code has been implemented in a config based architecture for modularity and to support the plug-and-play nature of components, and maintaining a structure closely related to the nature of our intents rather then binding code directly to frameworks.

#### Libs

Responsible for potencially assembling the apis and apps based on the exported code from their location.

#### Converter

Responsible for converting files. Currently it has only mocks for processing hmtl and pdf conversion. The mocks are stream-based, handled by the fileprocess service, which uses a timeout provided in the config, and emits process events on every processed percentage (calculated from the total timeout). 

#### Scheduler

Responsible for scheduling process requests as a queue. It uses a queue service to do that, which has a max number of asynchronously processable tasks (provided in the config). For requests it uses the fetch library, which has access to response streams, and based on the response events, it emits status updates through sockets.

#### UI

Responseible for providing a client, which provides access to trigger requests to queue conversion processes, and provides progress and status notifications.
The architecture has been influenced heavily by uni-directional data flow patterns and smart and dumb ui component paradigms.

### Usage

All services can be started with one of the cli commands below:

`npm run start`: only runs the builds and starts the services

`npm run start:dev`: adds sourcemaps to compiles, and it uses browser-sync

### Todos

- add uglify to js
- fix reloading when re-compiling the js bundle
- add automated tests
