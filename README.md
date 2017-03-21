# File converter

A basic implementation of scheduling file conversions and tracking live status notifications with Node and Angular.
The back-end and front-end code has been implemented in a config based architecture for modularity and to support the plug-and-play nature of components, and maintaining a structure closely related to the nature of our intents rather then binding code directly to frameworks.

#### Libs

Responsible for assembling the apis and apps based on the exported code from their location, in a reusable way. They act as adaptors between frameworks and code.

#### Converter

Responsible for converting files. Currently it has only mocks for processing hmtl and pdf conversions (it assumes that the transforms are processed as streams). The mocks are stream-based, handled by the fileprocess service, which uses a timeout provided in the config, and emits process events on every processed percentage (calculated from the total timeout). 

#### Scheduler

Responsible for scheduling process requests as a queue. It uses a queue service to do that, which has a max number of asynchronously processable tasks (provided in the config). For requests it uses the fetch library, which has access to response streams, and based on the response events, it emits status updates through sockets.

#### UI

Responseible for providing a client, which provides access to trigger requests to queue conversion processes, and provides progress and status notifications.
The architecture has been influenced heavily by unidirectional data flow patterns and the smart vs dumb ui component paradigm. 
The styling is made in sass, just by generating a standard stylesheet. The structure is influenced mostly by the BEM pattern, only without the fussyness of the double separators. Components are standalone, using arbitrarily defined variables, which can (and usually do) inherit from cores. Every folder has a _base.scss file which is responsible for defining the load order.

### Usage

All services can be started with one of the cli commands below:

`npm install`: install prequisite dependencies

`npm run start`: only runs the builds and starts the services, default address is http://localhost:7000

`npm run start:dev`: adds sourcemaps to compiles, and it uses browser-sync

### Todos

- ~~add uglify to js~~
- fix reloading when changing the js bundle
- add automated tests
- use css-modules
- add rotation to notifications
