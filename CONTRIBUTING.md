# Contribution Guide

We are grateful for your selfless contribution to the project. We hope that contributing to this project would be as simple and transparent as possible, regardless whatever it is (including but not limited to):

- Reporting bugs
- Fixing bugs
- Submitting Pull Requests
- Suggestions for new feature(s)
- Becoming a maintainer (for this project)

The following content is a serial of guidelines for contributing to `Faun`. Before starting your work, you are supposed to read the following advice:

- Understand what changes you want to make
- Look through the issue list and check if there's an issue to solve the same problem
- **Publish** or/and **redistribute** this project should under [WTFPL](LICENSE) license

## Our Code of Conduct

We have proposed a [Code of Conduct](CODE_OF_CONDUCT.md) to *regulate* the behavior of each participant. We sincerely hope each participant would be able to firmly entrenched to this conduct. Therefore, please take some time to read the full content of it.

## We are Using Git Flow

We are currently working under [GitHub Flow](https://guides.github.com/introduction/flow/index.html), which is the best practices recommended by GitHub through Pull Requests. Our three permanent branches are as below:

- `master`: keeps consistent with the latest stable code only
- `dev`: stores code that under developing, testing, and next feature
- `docs`: keeps up with `dev`, but ahead of `dev` in documentation.

New branches could be checked out from these branches, and also allowed to be merged into the three branches:

- `master`
  - `fix-${FIX_NAMESPACE}` or `hotfix-${HOTFIX_NAMESPACE}`: fix some bugs
  - `dev` (Already checked out)
- `dev`
  - `feature-${FEATURE_NAMESPACE}`: add some new features
  - `refactor-${REFACTOR_NAMESPACE}`: refactor or delete some code in current branch
  - `docs` (Already checked out)
- `docs`
  - `feature-doc-${DOC_NAMESPACE}`: Add new docs for a new feature
  - `refactor-doc-${DOC_NAMESPACE}`: Refactor or delete docs
  - `fix-doc-${DOC_NAMESPACE}`: Fix typo or syntax

> [NOTE] `master`, `dev` and `docs` are not allowed to force push, neither participants nor maintainers.

The follow tips help you get familiar to make a Pull Request:

- Adding a feature
  - Checkout from `dev` to a new branch, or fork this repo from `dev` to your own repo
  - If you added some code that should be tested, please add corresponding test scripts and make sure all tests would pass
  - If you modified APIs and/or functionalities, add corresponding docs JUST IN CURRENT BRANCH (cause it is unnecessary to checkout a new branch from `docs`)
  - Lint your code before committing
- Refactoring code
  - The same as *Adding a feature*

## Report Bugs and Suggestions Using Issues

We are using [Issues](https://github.com/lenconda/destruction/issues) to track bugs and suggestions. As mentioned above, before starting your work, please check [Issues](https://github.com/lenconda/destruction/issues) first. Known bugs, problems and coming, under-developing features would possibly shown in issues.

## Bug Reports Should be Readable

An acceptable format of a report should be:

```
Version: # get the version from package.json
System:
  Node Version:
  System:
  System Version (Kernel Version):
  Browser User-Agent:
Description:
  Expected:
  Result:
```

## Commit Message Should be Readable

An acceptable format of a commit message should be:

```
<type>(<scope>): <subject><mentioning>
```

These types of commit messages are acceptable:

- `feat`: new feature
- `refactor`: refactoring code
- `remove`: removing code
- `test`: adding, removing, modifying test scripts
- `deps`: dependencies related operations
- `fix`: fix bugs
- `chore`: modifying tools

These scopes of commit messages are acceptable:

- `doc`: related to docs
- `function`: related to functions or methods
- `api`: related to APIs
- `deploy`: related to deployments

Do not forget mentioning issues that related to your work, such as `closes #1`.
