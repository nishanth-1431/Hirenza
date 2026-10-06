export FILTER_BRANCH_SQUELCH_WARNING=1
git filter-branch -f --env-filter '
    export GIT_AUTHOR_NAME="Nishanth-1431"
    export GIT_AUTHOR_EMAIL="242646383+nishanth-1431@users.noreply.github.com"
    export GIT_COMMITTER_NAME="Nishanth-1431"
    export GIT_COMMITTER_EMAIL="242646383+nishanth-1431@users.noreply.github.com"
' HEAD
git push -f origin main
