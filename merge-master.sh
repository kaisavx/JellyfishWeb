#!/bin/bash
# 获取当前分支
current_branch=`git rev-parse --abbrev-ref HEAD` &&
echo "当前： $current_branch"
git push --set-upstream origin $current_branch &&
git pull &&
echo "Merge branch '${current_branch}' into 'master'" &&
git merge ${current_branch} develop --no-ff -m "Merge branch '${current_branch}' into 'develop'" &&
git push &&
echo "OK" &&
git checkout ${current_branch}
