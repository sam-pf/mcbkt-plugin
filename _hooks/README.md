> A meta/_meta file---do not edit outside meta/_meta.

# Git hooks

_Most_ git hooks defined in this folder are automatically run by git.  If a
symlink of this folder is created in folder `.git`, then _all_ hooks will be
run automatically.

This is thanks to a new (as of 07-07-2019) global git configuration setting
`core.hooksPath`, whose value is set to the relative path name of this folder
(`_hooks`).

In contrast, it used to be that a script (`install.git.hooks`) was used to
install git hook scripts from this folder to the default git hooks folder
(`../.git/hooks`).  That script is now deprecated.

Note that the folder location where the git hooks are run is the root of the
working tree in many common cases.  But this location changes to .git instead
in some cases as per `githooks` doc (e.g., if the hook name is one the
following: pre-receive, update, post-receive, post-update, push-to-checkout).
It takes merely one action for this folder to be effective in those
situations as well: a symlink of this folder can be created in the folder
.git.

# My hooks

These are hooks defined here with file names ending with `.my.hook`.

These hooks can be invoked with `git--run-my-hook`, which is a function that
runs these hooks in the base directory of this git repository
(`git--this-repository-base`).  This behavior of running the hook script at
the repository base is the same as many git hooks.

Some frequently used bash aliases for git related commands are designed to
invoke `git--run-my-hook` automatically.
