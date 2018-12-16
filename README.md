#  Crowd Sourcing

> a backend implementation of a crowd-sourcing app

## Technology stack

    - NodeJs
    - GraphQL
    - MongoDB
    - Passport Google Auth
    - Docker (upcoming)

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

There are couple of steps required to start with this project.

### Install mongodb

In order to start playing around, it is required for mongodb to run locally.

Install it based on your OS.

### Install any GraphiQL GUI

This is not required, but since every API request is authenticated, it is necessary to provide Authorization Header 
for every GraphQL API call. And this is not possible with basic browser graphiql GUI, since there is no option
to add request header.

### Mongodb scripts

There are multiple scripts created for the starter purpose. The goal was to speed up the testing, and to have a 
better understanding of how the model instances actually look like in the database.

**Recommendation:**

Use this script:

`USERNAME_INSERT=custom_user_name npm run insert-all-db`

This script is doing logical insertion in the mongodb. Script for creation of nomination instance should be created last.

Make sure to include `custom_user_name` with your valid username! 

Username can be compiled by removing email domain from an actual email address. 


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


Once the [previous step](#Passport Google API) has passed successfully, server starts validation the email address.

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
