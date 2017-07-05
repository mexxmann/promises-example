#!/usr/bin/env bash
# Copyright (c) Investopedia, LLC
#
# Sample sync script
#
# Author: Ryan Kadwell <ryan.kadwell@investopedia.com>
#

host="www.local.lab.investopedia.com"

rsync -azvi \
    --no-perms --no-owner --no-group \
    --delete-after \
    --exclude='.eslintignore' \
    --exclude='.eslintrc' \
    --exclude='.git' \
    --exclude='.gitignore' \
    --exclude='.gitlab-ci.yml' \
    --exclude='.idea' \
    --exclude='.me' \
    --exclude='build.sh' \
    --exclude='config/environment.js' \
    --exclude='config/personal.js' \
    --exclude='config/pm2.yml' \
    --exclude='cookbooks' \
    --exclude='coverage' \
    --exclude='docs' \
    --exclude='Guardfile' \
    --exclude='inv_market_support_service*.tar.gz' \
    --exclude='node_modules' \
    --exclude='README.md' \
    "." \
    "root@${host}:/ask/inv_market_support_service"

ssh "root@${host}" "runuser -l nodejs -c '/ask/software/nodejs-6.6.0/bin/pm2 restart inv_market_support_service'"
ssh "root@${host}" "find /ask/inv_market_support_service ! -user nodejs -exec chown nodejs:nodejs {} \;"
