#!/bin/bash
export GEM_HOME=$PWD/gems
mkdir -p $GEM_HOME
gem install sass
$GEM_HOME/bin/sass $PWD/sass/main.scss $PWD/public/css --trace
