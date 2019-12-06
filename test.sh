#!/bin/bash

retVal=0
DIR="/Users/gangadharpathipaka/Public/node"
if [ -d "$DIR" ]; then
    echo "${DIR} Exists..."
else
    echo "Dir Not found...."
    retVal=1
fi
temp=0
DIR="/Users/gangadharpathipaka/Public/node1"
if [ -d "$DIR" ]; then
    echo "${DIR} Exists..."
else
    echo "Dir Not found...."
    temp=1
fi
if [ $temp -gt 0 ]; then
    retVal=$temp
fi
echo $retVal

start=`date +%s`
echo $start
sleep 5s
end=`date +%s`
echo $end
echo "Time taken - $((end-start)) "
