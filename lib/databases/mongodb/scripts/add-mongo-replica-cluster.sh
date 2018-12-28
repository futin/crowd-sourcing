#!/usr/bin/env bash

# get the root directory path. 'dirname $0' returns the absolute path from where the scripts was invoked.
# Since it is meant to be invoked via "npm run" script, it will always be root directory.
dbDir="`dirname '$0'`/mongodb-replicas"
logName="mongo.log"

ports=(27017 27018 27019)
rsName="rs0"
host="localhost"

# store the replica set initiation process in variable, as string
initiateRs="rs.initiate({
    _id: '$rsName',
     members: [
       { _id: 0, host: 'localhost:27017' },
       { _id: 1, host: 'localhost:27018' },
       { _id: 2, host: 'localhost:27019' },
    ]})"

# create multiple working directories with "parent" flag
mkdir -p "$dbDir/"{r0,r1,r2}

# launch mongod's
for ((i=0; i < ${#ports[@]}; i++))
do
  mongod --dbpath "$dbDir/r$i" --logpath "$dbDir/r$i/$logName" --port ${ports[$i]} --replSet ${rsName} --fork
done

## wait for all the mongods to finish setup
sleep 3

## initiate the mongo client and run the replica set init configuration
mongo --eval "$initiateRs"
