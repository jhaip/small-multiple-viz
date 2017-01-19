#!/bin/bash

for ((n=0;n<3;n++))
do
	echo "recording new clip"
	datestr=$(date -d "today" +"%Y-%m-%dT%H-%M-%SZ-%N")
	raspivid -o "video__$datestr.h264" -t 4000 -awb incandescent -w 640 -h 480
	ffmpeg -i "video__$datestr.h264" -ss 00:00:2 -frames:v 1 "out__$datestr.jpg" &
done
