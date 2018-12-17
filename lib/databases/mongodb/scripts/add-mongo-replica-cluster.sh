#!/usr/bin/env bash

dbDir="`dirname '$0'`/mongodb-replicas"
logName="mongo.log"

ports=(27017 27018 27019)
rsName="crowd-source"
host="localhost"

initiateRs="rs.initiate({
    _id: '$rsName',
     members: [
       { _id: 0, host: 'localhost:27017' },
       { _id: 1, host: 'localhost:27018' },
       { _id: 2, host: 'localhost:27019' },
    ]})"

# create working folders
mkdir -p "$dbDir/"{r0,r1,r2}

# launch mongod's
for ((i=0; i < ${#ports[@]}; i++))
do
  mongod --dbpath "$dbDir/r$i" --logpath "$dbDir/r$i/$logName" --port ${ports[$i]} --replSet ${rsName} --fork
done

## wait for all the mongods to finish setup
sleep 3

## initiate the set
mongo --eval "$initiateRs"
