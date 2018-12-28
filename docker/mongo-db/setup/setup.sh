#!/bin/bash

echo ******************************************************
echo Starting the replica set
echo ******************************************************

# Give some time to replicas to setup
sleep 10 | echo Sleeping

mongo mongodb://mongo-rs0-1:27017 replica-set.js