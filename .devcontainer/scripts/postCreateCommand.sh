#!/bin/bash
set -o allexport
# source /workspaces/homely/.env
# source /workspaces/homely/app/.env
set +o allexport

cd /workspaces/homely/api
poetry install

cd /workspaces/homely/app
npm install
