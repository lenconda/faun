# Contribution Guide

We are grateful for your selfless contribution to the project. The following content is a serial of guidelines for contributing to `Polyatomic`.

Please spend several minutes reading these guidelines before you create an issue or pull request.

Before you starting your contribution work, you are supposed to read the following advice:

- Read the [README](README.md) first
- Understand what changes you want to make
- Look through the issue list and check if there's an issue to solve the same problem
- **Publish** or/and **redistribute** this project should under [WTFPL](LICENSE) license

## Code of Conduct

We have proposed a [Code of Conduct](CODE_OF_CONDUCT.md) to *regulate* the behavior of each participant. We are sincerely hope each participant would be able to firmly entrenched to this conduct. Therefore, please take some time to read the full content of it.

## Branches

We are currently maintaining three branches: `master` for publishing and deploying the stable features, `dev` for testing new features and `docs` for update the docs.

Normally, when developing a new feature, you should checkout a new branch from `dev`, named as `feature/${FEATURE_NAME}`, the `FEATURE_NAME` is supposed to summarize the new feature. The feature branches will ultimately be merged into `dev` branch. When fixing a bug, you should checkout a new branch from `master` or `dev`, named as `hotfix/${FIX_NAME}` or `fix/${FIX_NAME}`. Once you make a [Pull Request](https://github.com/lenconda/polyatomic/pulls) from GitHub to apply to merge the fix branch and if there are issues related to this, you should mention them in your pull message.

## Issues

As mentioned above, before you starting your work, please check [Issues](https://github.com/lenconda/polyatomic/issues) first. The issue list shows known bugs, problems and coming features that are under development.

## Fork & Pull Requests

You should fork this repository if you want to make some contribution into this project.

You are supposed to make a [Pull Request](https://help.github.com/articles/about-pull-requests/), once you are done all of your work, submit the pull request. Whatever, do not forget mentioning the issue ID if there are ones that are related to your commits.
