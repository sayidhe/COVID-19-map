#!/bin/bash

# generate csv
node data-generator.js

# run gulp
npm i
gulp production