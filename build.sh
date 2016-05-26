#!/bin/bash

####
#   SASS
####

# Define GEM_HOME environment variable to install gems locally
export GEM_HOME=$PWD/gems
mkdir -p $GEM_HOME

# Install sass
gem install sass

# Create target folder for css transpilation
mkdir -p $PWD/public/css

# Transpile sass
$GEM_HOME/bin/sass $PWD/sass/main.scss $PWD/public/css/main.css --trace


####
#   POSTGRES / CAMINTE HACK
####
cp $PWD/assets/vendorEdits/caminte/postgres.js $PWD/node_modules/caminte/lib/adapters/postgres.js
