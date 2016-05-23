#!/bin/bash
export GEM_HOME=$PWD/gems
mkdir -p $GEM_HOME
gem install sass
$GEM_HOME/bin/sass sass/main.scss public/css/main.css
