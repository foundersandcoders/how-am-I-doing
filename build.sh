#!/bin/bash
export GEM_HOME=$PWD/gems
mkdir -p $GEM_HOME
gem install sass

touch $PWD/public/css/main.css
$GEM_HOME/bin/sass $PWD/sass/main.scss $PWD/public/css/main.css --trace

FILE=$PWD/public/css/main.css
if [ -f $FILE ];
then
   echo "File $FILE exists."
else
   echo "File $FILE does not exist."
fi
