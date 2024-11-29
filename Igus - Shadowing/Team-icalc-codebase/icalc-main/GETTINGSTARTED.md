# iCalc Getting Started

## Prerequisites

Before you start make sure you set up your LLDAP Account. [more information](https://igusdev.atlassian.net/wiki/spaces/ICALC/pages/4733927644/Setup+LLDAP+Account+for+jenkins+npm+proxies)

| program             | version |
| ------------------- | ------- |
| nvm with node >= 20 | 20.5.1  |
| yarn                | latest  |
| Docker              | latest  |
| Chrome or Edge      | latest  |
| prettier Plugin     | latest  |

On macOS with brew installed you can just run following to install the software:

```shell
brew install nvm
nvm install 20
brew install yarn
brew install --cask docker
brew install --cask microsoft-edge
```

**The recommendet IDEs are Intellij / WebStorm or Visual Studio Code**

Please adjust your IDEs TypeScript Settings so that the `tsconfig.json` file is used and ESLint is enabled.
Also make sure that the `prettier.config.js` is used

## Configure Access to the kopla npm repository

The [igus npm repository](https://npm.igusdev.igus.de) is used in this Project.

The setup of this repository is mandatory.
You **authenticate** against the repository using your **LLDAP account**.
To access it you have to configure yarn accordingly.
You can do so by the following command:

```shell
  npm login --registry=https://npm.igusdev.igus.de/ --always-auth
```

```
Username: <LLDAP User>
Password: <LLDAP Password>
Email: <igus E-Mail>
```

Additionally you need to add the retrieved npm repository token to the [.yarnrc.yaml](.yarnrc.yml) file.
You can get the token by running this:

```shell
cat ~/.npmrc
```

Add following to your `.yarnrc.yaml` file and substitude `<<TOKEN>>` with your Token:

```
npmRegistries:
  "https://npm.igusdev.igus.de/":
    npmAuthToken: <<TOKEN>>
```

Now you can install projects dependencies using yarn and make sure the frontend application starts

```shell
yarn install
yarn start:frontend
```

## Setup local environment variables

To setup local environment variables, please copy [.env.example](apps/data-service/.env.example) to a file named `.env.local` and add the credentials you have received from the PO.

On mac and linux the coping can also be done by running this script from project root:

```bash
cp ./apps/data-service/.env.example ./apps/data-service/.env.local
```

Add the same file for icalc-cli context as well.

```bash
cp ./apps/data-service/.env.example ./apps/icalc-cli/.env.local
```

## Initialize Database

To initialize the database,
please read and execute the setup steps from data-import project [README](apps/data-import/README.md)

## Create Local User

The Application has no sign-up page to create a local user. That`s why we need to create a user directly in the database.

```bash
yarn db:local-user testuser@test.de password
```

Refer to the [README](apps/icalc-cli/README.md) file of the `icalc-cli` for further information on user creation.

## Reset all changes made

Once you have successfully completed all these steps and have both the frontend and backend servers running smoothly, you may revert any changes made to files to avoid merging them with the main branch.```shell

```shell
git reset --hard
```

## CONGRATULATIONS YOU HAVE FINISHED THE SETUP!!! 🎉🎉🎉
