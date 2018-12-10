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

Each [user](#User) gets certain points (usually 10) and can assign it to **other** users.

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
    3. Admin - can perform CRUD operations on AuthUser model, remove other users etc
    4. User - can update it's own profile, create nominations, fetch other nominations etc
    5. User can issue nominations, or be a Nominee - user nominated by some other user.
    

### Category


Category represents a list of names which are assigned to every [Nominee](#Nominee) while [Nomination](#Nomination) is being created.


### Nomination


Nominated can be issued by a [User](#User).

Important notes:

    1. While submitting the Nomination, user can select 1-10 other nominees to nominate.
    2. For each nominee, user that is nominating must select:
        2.1. Number of points (1-N), where N is total number of points that each user gets every month
        2.2. Category, which explains why this nominee was choosen.
    3. Every Nominaiton gets a timestamp upon creation.
    4. Every Nomination, once created, has a reference to its nominees
    

### Nominee


Nominee is basically a user with additional information about number of points assigned and category.

It also has a reference to its [Nomination](#Nomination), which creates a circular reference between these two models.

Nominee is the only model that can't be created manually, since it relies on its parent Nomination.

Nominee(s) get created automatically after successful Nomination creation, where the referencing also happens.




