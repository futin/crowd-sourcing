#  Crowd Sourcing

> a backend implementation of a crowd-sourcing app

## Technology stack

    - NodeJs
    - GraphQL
    - MongoDB
    - Passport Google Auth
    - Docker

## Install

Please run the "install" command first:

```sh
$ npm install
```

This will install all of the required dependencies, as stated in `package.json`file.

To start the server, run:

```sh
$ npm run start-dev
```

which will start `nodemon` server in DEV mode.

## How to use

There are couple of ways to configure this project. Setup can be done [locally](#Local-setup) or via [docker images](#Docker-setup).


### Local setup


The purpose of this step is to setup the development for those who are not comfortable working with Docker. Otherwise skip this section and go directly to [Docker setup](#Docker-setup).


#### Install mongodb replicas


Since [Transactions](https://docs.mongodb.com/manual/core/transactions/) are bing used in this project, it is required to setup local [mongodb replicas](https://docs.mongodb.com/manual/replication/).

And in order to use Transactions/Replication logic, it is required to have at least 4.0 mongodb version installed globally. Install guide can be found [here](https://docs.mongodb.com/manual/installation/). 

Then, run this script:

```sh
npm run add-mongo-replica-cluster
```

Basically, this script will create new directory, which will hold the server instances locally. 

It is configured to listed on ports 27017, 27018 and 27019, and replica set name is "rs0".

Script will spawn these instances in the background and call the [rs.initiate()](https://docs.mongodb.com/manual/reference/method/rs.initiate/), which will set the id and members required to access the replica set(s).

Afterwards, you can run the server with next script:

```sh
npm run start-local
```

This script will start the server and will connect to mongodb replica set cluster automatically.

**Notes**

- Make sure to use only NODE_ENV=local in local environment setup, because other environments are configured for docker images
- Before starting the server for the first time, let mongodb configure replica set properly (it requires between 10-15 seconds)

#### Mongodb scripts

There are multiple scripts created for the starter purpose. The goal was to speed up the testing, and to have a 
better understanding of how the model instances actually look like in the database.

**Recommendation:**

Use this script:

```sh
USERNAME_INSERT=custom_user_name npm run insert-all-db
```

This script is doing logical insertion in the mongodb. Script for creation of nomination instance should be created last.

Make sure to include `custom_user_name` with your valid username, which will insert user and auth user with provided username!

Username is then compiled by removing email domain from an actual email address.

There are other scripts that can be called:

```sh
USERNAME_INSERT=custom_user_name npm run insert-users-db
npm run insert-categories-db
npm run insert-nomination-db
npm run drop-db
```

**Notes**

- Be careful with "drop-db" script. It will drop all collections for the current environment.
- Always re-run the server once the collections are dropped. This will ensure that indexes are setup correctly.


### Docker setup


Ok, the fun part! Setting up docker was quite a challenge, I'll try to make the process of setup easier as much as possible in this step.

We'll go through the setup in stages, where each stage explains part of the Docker setup.


#### Install Docker

Make sure to have docker Dameon installed globally. It depends on your OS, so please check the instructions on how to install it [here](https://docs.docker.com/install/).

#### Cleanup

If you have used [Local](#Local-setup) before, we need to perform certain cleanup tasks.

First, check if there are any running mongodb instances:

```sh
ps -ef | grep mongod
```

This snippet will basically fetch all mongod running servers. If there are any, kill them all!

```sh
killall mongod
```

If you just need to start fresh, first make sure that there are no docker containers running.

```sh
docker ps
```

In order to remove running containers, you can use:

```sh
docker rm -f $(docker ps -a -q)
```

This will forcefully remove all docker containers (both running and non-running).

For removing stale images, run:

```sh
docker rmi $(docker images -q)
```

This will remove all docker images the are stored locally on your machine.

Now that we have a clean/fresh repository, jump to [Docker-compose startup](#Docker-compose-startup) if you are not interested in next section ([Docker architecture](#Docker-architecture)).

#### Docker architecture

This project uses multiple docker-compose files in order to separate the concerns, and to split the spawning of database/server instances.

First one can be found in `docker/mongo-db` directory, and explanation of each service can be found in [Mongo db](#Mongo-db) section.

Latter resides in root directory, and it's explanation is mixed in [Server](#Server) and [Nginx](#Nginx) sections.

Since every docker-compose file binds it's services to a default bridged network, I had to create new custom network which every service will be bound to (check [networks](#networks) section).

This way, even though services belong in different docker-compose files, they act as if they were in the same file.

#### Docker compose startup

Before we dive in, if you are not familiar with docker-compose logic, please check the [official documentation](https://docs.docker.com/compose/).

Basically, docker-compose lets you combine multiple Docker containers under the same network, so they can easily communicate with each other.

Docker compose also allows you to spawn multiple instances of the same service, which is explained in more details in [Server](#Server) stage.

##### Docker-compose operations

Some of the operations you will use to setup the containers:

```sh
docker-compose up
```

This is the first script that is always being run. It spawns the services defined in the docker-compose.yaml file.

It should be always run from a directory where the docker-compose.yaml file resides. Otherwise... it won't work...

Documentation can be found [here](https://docs.docker.com/compose/reference/up/).

```sh
docker-compose down
```

This operation is called when it is required to kill and remove all the containers created by the docker-compose.yaml file.

Documentation can be found [here](https://docs.docker.com/compose/reference/down/).


```sh
docker-compose restart
```

This operation is called when it is required to restart all the containers created by the docker-compose.yaml file.

Documentation can be found [here](https://docs.docker.com/compose/reference/restart/).


```sh
docker-compose build
```

This operation is called when it is required to re-build the images (usually when there is some change that should be applied to new services).

However, this will not start the containers automatically. In order to do that, use:

```sh
docker-compose up --build
```

The awesome thing about docker-compose is that you can also do partial building/starting/re-starting docker containers. Simply use the service name with any of the previously described operations:

```sh
docker-compose up --build {serviceName}
```

One more very important operation which you will use a lot is:

```sh
docker exec -it {containerId | containerName} bash
```

If you need to enter the running container and check the logs, or run some scripts (example can be found in [Server](#Server)), you use this operation.

That's it. There are plenty more operations that docker/docker-compose provide, which is not intention of this documentation.


##### Mongo db

First, go directly to mongodb directory that has the docker-compose.yaml file:

```sh
cd docker/mongo-db
```

If you look into the docker-compose.yaml file, you will find multiple services. Lets start with the most simple ones.

###### mongo
 
Services mongo-rs0-2 and mongo-rs0-3 are built upon "mongo". They are exposed on port "27017" and can be only accessed within their network.

The reason behind this is to permit any direct entries from the external source. The only services that can enter these instances should be are one created within the same network!

Other containers can easily access them connecting to "mongodb://mongo-rs0-{id}:27017". This is why both of them have unique names (container_name).

All mongo containers have `volumes`, which is basically binding the data created within a mongo container with host machine, so server can access it.

More info on volumes can be found [here](https://docs.docker.com/storage/volumes/).

###### mongo-start

The service name of this image is "mongo-rs0-1" since it is basically on the same level as previously described instances.

The only difference is that this container is built with the custom Docker file that load the configuration file.

###### mongo-rs-setup

This container starts at the same time as other services, except it's responsability is to:

    1. load the setup.sh script
    2. setup.sh script wait for certain amount of time (sleeping) for mongodb replicas to setup
    3. once mongodb replicas are set, configure them with rs.initiate() and rs.conf();
    4. exit
    
Once done, this container can be terminated, since it's job is done.

###### mongo-admin

This is the mongo administrator app which is used to directly communicate with mongodb instances. It server is run on port "1234", and can be accessed by host machine thorough port defined in docker-compose.yaml file (currently port "9000")

Since it belong to the same network as other mongodb instances, it can access them easily.

###### networks

This is a custom network used to combine multiple docker-compose.yaml files. Without it, each docker-compose gets assigned to default network, and services from other docker-compose files can only access them through public ports.

For example, since we are not publicly exposing any mongodb instance/container, our server would not be able to make a connection which would crash the server.


That's it. Now, in order to start the mongodb instances, simply run:

```sh
docker-compose up -d
```

And in couple of seconds all instances should be set. Use "-d" options to run the services in the background.

In order to verify that the mongodb instances have been setup correctly, run `mongo` to start the mongo shell.

Then run `rs.status()` which should give you detailed information about each mongodb instance, and if replica is primary or secondary.

More info on replicas can be found [here](https://docs.mongodb.com/manual/replication/).

Additionally, you can run `docker ps` to see all the running docker containers, with details such as `id` and `containerName` which can be used to access the container and inspect it.

##### Server

To create server containers, run `docker-compose up` from the root directory. This will start all defined services in the compose file.

Instead of running all services, I recommend running only the one which you will actually use. 

So, you can run:

```sh
docker-compose up -d server-dev
```

This will start the server container in the background. Since multiple ports are assigned (as stated in docker-compose.yaml) for `server-dev` service:

```text
    ports:
      - "3001-3005:3001"
``` 

You can scale up to 5 server instances, like this:

```sh
docker-compose up -d --scale server-dev=5
```

Of course, this would mean that you would have to manually hit each server with corresponding port. For local testing, spawning a single server is enough.

The only requirement before starting the `server-dev` container is to have [mongodb containers](#Mongo-db) already running.


##### Nginx

Nginx is used as a reverse-proxy and load balancer primarily on this project. Please run the root docker-compose file:

```sh
docker-compose up -d --build --scale server-dev=3
```

This will start spawn 3 development server containers, and nginx as well once the servers are up.

Nginx configuration can be found in `docker/nginx` directory, and it's nginx.conf file includes both `sites-enabled` and `conf` directories.

In `sites-enabled` you can find `dev` and `prod` files, each used for custom setup of proxy environments.

This is a place where we can setup redirections, url-rewrites etc. The logic is this:

    - Use service name with combination with exposed port to forward all the upcoming requests to
      a given server_name that listtens on a certain port (currently dev.crowd-sourcing.com:80)
    - This will then be resolved by Docker’s embedded DNS server
    - DNS server will use a round robin implementation to resolve the DNS requests
    - DNS requests are resolved based on the service name and distributed to the Docker containers.
      
Because the NGINX service will handle the requests and forward them to a server-dev service, we don’t need to map the 
port 3001 from the server-dev services to a host machine port. This is where we can use "expose" instead of "ports".

All that is left to do is setup local DNS file -> `/etc/hosts`. Without it, nginx will fail to lookup any servers because the request should come from a specific domain.

Once you access `hosts` file, add these two lines of code:

```text
127.0.0.1       dev.crowd-sourcing.com
127.0.0.1       crowd-sourcing.com
```

This is basically additional domain mapping. Once you enter `dev.crowd-sourcing.com`in the browser, the browser will look into `hosts` file and try to resolve the domain name locally.

Since this domain name is set, it will look for the IP address (127.0.0.1) and try to fetch the resource. 

Our nginx server should be up and running, and when it receives the request from `dev.crowd-sourcing.com`, it will know what to do and whom to forward it to!

And that's basically it. 

#### Cleanup - end

Alright, so we got mongodb up and running, multiple server containers ready and nginx load-balancing and handling all http requests.

Once we are done with testing, it is always a good practise to clean-up after ourselves.

Start with removing all containers (running and exited)

```sh
docker rm -f $(docker ps -a -q)
```

This command will delete all containers. The command `docker ps -a -q` will return all existing container IDs and pass them to the rm command which will delete them.

If you want to remove only stopped containers, call previous line without `-f` option.

Documentation can be found [here](https://docs.docker.com/engine/reference/commandline/rm/)

Then, remove all images:

```sh
docker rmi -f $(docker images -q)
```

This command will delete all images. The command `docker images -q` will return all existing images IDs and pass them to the rm command which will delete them.

Documentation can be found [here](https://docs.docker.com/engine/reference/commandline/rmi)

Now make sure that you got what you wanted, by running:

```sh
docker ps
docker images
```

These should be empty now. Additionally, you can remove volumes created by mongodb services and prune obsolete images:

```sh
docker volume rm $(docker volume ls -q)
docker image prune
```

First command will remove all volumes that are left after removing the corresponding containers. It will not remove the one that are being used.
Latter will remove stale/unused images

That's it, now everything is clean and we can start all over again!

### Install any GraphiQL GUI

This is not required, but since every API request is authenticated, it is necessary to provide Authorization Header 
for every GraphQL API call. And this is not possible with basic browser graphiql GUI, since there is no option
to add request header.


## The idea


The idea behind this app: 

Each [User](#User) gets certain points (usually 10) and can assign it to **other** users.

This is achieved by creating [Nominations](#Nomination).

Each Nomination holds a reference to other users ([Nominees](#Nominee)).

When nominating, a user can choose [Category](#Category) and number of points that he/she wished to assign to other user.

Points for nomination reset every month, so that every user can nominate any other user again.


## Models 

> Brief overview of the models, what are the important notes and what is the correlation between them.


### AuthUser


This is a fairly simple model. It has only a single property - `username`. The main idea behind this model is to
handle additional authorization that happens after Google API has verified user authentication. This process is explained in more details in [Authorization](#Authorization).


### User


User model is the center of this app, since everything can be related to a certain user (Nominations, Nominees, AuthUsers).

Important notes:

    1. It is automatically created upon successful authorization
    2. It comes with 2 roles: admin and user
         - admin: can perform CRUD operations on AuthUser model, remove other users etc
         - user: can update it's own profile, create nominations, fetch other nominations etc
    3. User can issue nominations, or be a Nominee - nominated by some other user.
    4. Each month user receives new set of points to assign. Points are appended to already existing points.
    5. When Nomination is being created, User's pointsToAssign are being reduced by each nominee point.
    

### Category


Category represents a list of names which are assigned to every [Nominee](#Nominee) while [Nomination](#Nomination) is being created.


### Nomination


Nominated can be issued by a [User](#User).

Important notes:

    1. While submitting the Nomination, user can select 1-10 other nominees to nominate.
    2. For each nominee, user that is nominating must select:
        2.1. Number of points (1-N), where N is total number of points that each user gets every month.
        2.2. Category, which explains why this nominee was choosen.
    3. Every Nominaiton gets a timestamp upon creation.
    4. Every Nomination, once created, has a reference to its nominees.

Creation restrictions:
    
    1. Total number of given points must not exceed User's pointsToAssign.
    2. Provided points must be a positive integer.
    3. The same user can't be nominated twice on the same Nomination.
    4. User can't nominate him-self.
    5. User is allowed to make a single Nomination per month. 
    6. User is allowed to update Nomination for the current month.
    

### Nominee


Nominee is basically a user with additional information about number of points assigned and category.

It also has a reference to its [Nomination](#Nomination), which creates a circular reference between these two models.

Nominee is the only model that can't be created manually, since it relies on its parent Nomination.

Nominee(s) get created automatically after successful Nomination creation, where the referencing also happens.


## Authorization


This app is authorized on couple of levels. Lets go over each one of them.


### Passport Google API


Currently, the only way to pass the authentication process is by logging in via Google API.

In order to initiate to Google Login sequence, hit `http://host:port/auth/google`. This will pop-up the default Google Mail UI.

Once the account has been selected and password provided, our server handles the callback response. Our server relies completely on the Google API service to provide valid user credentials.


### Email validation


Once the [previous step](#Passport-Google-API) has passed successfully, server starts validation the email address.

    1. Email address has to be of certain domain (provided by the environment configuration)
    2. Other part of email (a.k.a. username) is being validated by the AuthUser model
    
If any of these steps fail, server automatically logs-out user with corresponding error message.

If the `domain` is incorrect, that means that unauthenticated user is trying to access the app.
If the `username` is invalid, it means that user has valid authentication but it is not authorized to proceed.

Latter usually means contacting the `admin` and requesting permission to access the app.


### JWT Access token


Even though the user is authorized to use the app, the access token has to be issued before any further action.

App uses Passport JWT token for authorization, and it can be acquired **ONLY** by the authorized user.  

In order to acquire access token, make next http request: `http://host:port/auth/token`.

In the response, caller can obtain access token and use it to make authorized API calls towards GraphQL routes.

### Authorized http request

Every route that starts with `/api/*` is being secure. In order to make auth request, please provide:

`Authorization: Bearer {jwt_token}`

within the request header. That's it!


## GraphQL Queries

> upcoming... For start, look at ./lib/graphql/queries.txt

## Notes on Code Style

> upcoming
