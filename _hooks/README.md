# Git hooks

The hook scripts defined here can be installed by running
`./install.git.hooks`.  The scripts are installed in `../.git/hooks` as
symlinks.  Each script, if it has a correct name, will be run automatically
after appropriate event is triggered.

If the script name is not recognized, it won't be installed.

If a script is installed, and then deleted from this folder, then the script
that had been installed in `../.git/hooks` won't be functional, as it will
have become an orphan link.

For this reason, all orphan links, whose names do not contain dots, in
`../.git/hooks` will be removed by `./install.git.hooks`.

Note that there are a bunch of sample hook scripts in folder `../.git/hooks`.

# My hooks

These are hooks defined here with file names ending with `.my.hook`.  These
hooks can be invoked with `git-run-my-hook`, which is a function that runs
these hooks in the base directory of this git repository
(`git-this-repository-base`).  This behavior of running the hook script at
the repository base is the same as git hooks.

My hooks are automatically run through my script setups, such as bash alias.
