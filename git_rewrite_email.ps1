$env:GIT_AUTHOR_NAME="Nishanth P"
$env:GIT_AUTHOR_EMAIL="242646383+nishanth-1431@users.noreply.github.com"
$env:GIT_COMMITTER_NAME="Nishanth P"
$env:GIT_COMMITTER_EMAIL="242646383+nishanth-1431@users.noreply.github.com"

git filter-branch -f --env-filter '
    export GIT_AUTHOR_NAME="Nishanth P"
    export GIT_AUTHOR_EMAIL="242646383+nishanth-1431@users.noreply.github.com"
    export GIT_COMMITTER_NAME="Nishanth P"
    export GIT_COMMITTER_EMAIL="242646383+nishanth-1431@users.noreply.github.com"
' HEAD

git push -f origin main
