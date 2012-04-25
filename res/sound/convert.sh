#!/bin/bash
#
# Usage: convertomp3 fileextention
#
if [ $1 = "" ];then
  echo 'Please give a audio file extention as argument.'
  exit 1
fi

for i in *.$1
do
  if [ -f "$i" ]; then
    rm -f "$i.wav"
    #mkfifo "$i.wav"
    mplayer \
     -quiet \
     -vo null \
     -vc dummy \
     -af volume=0,resample=44100:0:1 \
     -ao pcm:waveheader:file="$i.wav" "$i"
    dest=`echo "$i"|sed -e "s/$1$/mp3/"`
    desto=`echo "$i"|sed -e "s/$1$/ogg/"`
    lame -V0 -h -b 160 --vbr-new "$i.wav" "$dest"
    oggenc "$i.wav" -o "$desto"
    rm -f "$i.wav"
  fi
done

