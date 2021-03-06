<a href="https://elementalsystem.org">
	<img src="https://elementalsystem.org/documentation/images/logo.png" alt="Elemental logo" title="Elemental" align="right" height="60"/>
</a>

# Elemental low-code platform

[![Build Status](https://travis-ci.com/PhilipSkinner/elemental-lowcode.svg?branch=master)](https://travis-ci.com/github/PhilipSkinner/elemental-lowcode)
[![Coverage Status](https://coveralls.io/repos/github/PhilipSkinner/elemental-lowcode/badge.svg?branch=master)](https://coveralls.io/github/PhilipSkinner/elemental-lowcode?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/c2fa09bdad924a0d9b290b282a4427cc)](https://www.codacy.com/manual/PhilipSkinner/elemental-lowcode?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=PhilipSkinner/elemental-lowcode&amp;utm_campaign=Badge_Grade)
[![GitHub issues](https://img.shields.io/github/issues/PhilipSkinner/elemental-lowcode.svg)](https://github.com/PhilipSkinner/elemental-lowcode/issues)
[![GitHub forks](https://img.shields.io/github/forks/PhilipSkinner/elemental-lowcode.svg)](https://github.com/PhilipSkinner/elemental-lowcode/network)
[![GitHub stars](https://img.shields.io/github/stars/PhilipSkinner/elemental-lowcode.svg)](https://github.com/PhilipSkinner/elemental-lowcode/stargazers)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/PhilipSkinner/elemental-lowcode/pulls)

A standards based, open low-code development platform built on nodejs with the ability to fallback to writing raw nodejs code when the provided tools cannot solve your problems.

Currently ships with:

* JSON Schema defined RESTful APIs
* Simple async messaging queues
* Integrations to external systems
* API builder
* Rulesets builder
* Interface/website builder
* OIDC/OAuth2.0 Identity Provider & Identity Management

## Table of Contents

- [Installation](#installation)
	- [Docker](#docker)
	- [From source](#from-source)
	- [Database support](#databases)
- [Documentation](#documentation)
- [Examples](#examples)
- [Hosting](#hosting)
	- [Secrets](#secrets)
- [Contributing](#contributing)
- [Authors](#authors)
- [Support](#support)
- [Links](#links)
- [License](#license)

## Installation

Installation can done using the prebuilt docker image or using the latest code from master.

### Docker

You can pull down the latest docker image from dockerhub:

```
$> sudo docker pull philipskinner/elemental:master
$> sudo docker run -d -p 80:80 --name elemental philipskinner/elemental:master
```

; then open a browser and point it at (http://admin.elementalsystem.org).

The default administration login details are:

* Username: admin
* Password: admin

The docker image uses several pre-defined hostnames for the service, each of which resolves to 127.0.0.1:

* Kernel 			- http://kernel.elementalsystem.org
* Admin 			- http://admin.elementalsystem.org
* API 				- http://api.elementalsystem.org
* Integration 		- http://integration.elementalsystem.org
* Interface 		- http://interface.elementalsystem.org
* Storage API 		- http://storage.elementalsystem.org
* Rules 			- http://rules.elementalsystem.org
* Identity Provider - http://identity.elementalsystem.org
* Messaging/queues 	- http://queues.elementalsystem.org

### From source

Follow these steps to build and run from source:

```
$> git clone https://github.com/PhilipSkinner/elemental-lowcode.git elemental-lowcode
$> cd elemental-lowcode && ./setup.sh
$> ./start.sh
```

You can directly run the kernel by executing the main.js file within the kernel directory:

```
$> cd kernel
$> node main.js
```

The following usage options are available when you do this:

```
Usage: node main.js [OPTIONS]

Options:
	--sources [SOURCE_DIR]		Sets the directory where your Elemental application
                                        source code lives.
```

**Note:** If this is the first time you have run Elemental with a sources directory you will be prompted to enter an initial admin users credentials:

![First time run](https://elementalsystem.org/documentation/images/first-time.png)

; then open the admin interface on [http://localhost:8002](http://localhost:8002). Each example comes with an admin user with the following credentials:

### Database support

Elemental supports persistence of:

* Authentication details
* Data types
* Message queues
* Website session state

; with many storage options. These storage options are:

* In-memory
* Filesystem
* SQL:
	* sqlite
	* postgres
	* mysql
	* mariadb
	* mssql

## Documentation

Documentation is available within Elemental:

![In app documentation](https://elementalsystem.org/documentation/images/documentation-screenshot.png)

; or you can read it on the [Elemental Documentation](https://elementalsystem.org/documentation) website.

## Examples

Examples can be found in the [elemental-examples repository](https://github.com/PhilipSkinner/elemental-examples).

To use the examples clone the repository locally then set Elemental to run from a specific example directory:

```
$> git clone https://github.com/PhilipSkinner/elemental-lowcode.git elemental-lowcode
$> git clone https://github.com/PhilipSkinner/elemental-examples.git elemental-examples
$> cd elemental-lowcode && ./setup.sh
$> cd kernel && node main.js --sources ../../elemental-examples/todo
```

; then open the admin interface on [http://localhost:8002](http://localhost:8002). Each example comes with an admin user with the following credentials:

* Username: admin
* Password: admin

## Hosting

The recommended approach for deploying your application is to build on the dockerhub image. The following is an example dockerfile that builds and configures Elemental with a set of Elemental applications:

```
FROM philipskinner/elemental:master

#set dir
WORKDIR /var/elemental

#copy our files
COPY api /var/elemental/kernel/.sources/api
COPY data /var/elemental/kernel/.sources/data
COPY identity /var/elemental/kernel/.sources/identity
COPY integration /var/elemental/kernel/.sources/integration
COPY queues /var/elemental/kernel/.sources/queues
COPY rules /var/elemental/kernel/.sources/rules
COPY services /var/elemental/kernel/.sources/services
COPY website /var/elemental/kernel/.sources/website

#set environment
COPY nginx.conf /etc/nginx
ENV ELEMENTAL_KERNEL_HOST="http://kernel.mysite.com"
ENV ELEMENTAL_ADMIN_HOST="http://admin.mysite.com"
ENV ELEMENTAL_API_HOST="http://api.mysite.com"
ENV ELEMENTAL_INTEGRATION_HOST="http://integration.mysite.com"
ENV ELEMENTAL_INTERFACE_HOST="http://interface.mysite.com"
ENV ELEMENTAL_STORAGE_HOST="http://storage.mysite.com"
ENV ELEMENTAL_RULES_HOST="http://rules.mysite.com"
ENV ELEMENTAL_IDENTITY_HOST="http://identity.mysite.com"
ENV ELEMENTAL_QUEUE_HOST="http://queues.mysite.com"

#run our app
CMD ["./docker-start.sh"]
```

If you want to run the system outside of a docker container you must set the following environmental variables on your system:

* ELEMENTAL_KERNEL_HOST
* ELEMENTAL_ADMIN_HOST
* ELEMENTAL_API_HOST
* ELEMENTAL_INTEGRATION_HOST
* ELEMENTAL_INTERFACE_HOST
* ELEMENTAL_STORAGE_HOST
* ELEMENTAL_RULES_HOST
* ELEMENTAL_IDENTITY_HOST
* ELEMENTAL_QUEUE_HOST

Each of these needs to be a valid hostname that resolves to the relevant Elemental service.

### Secrets

Elemental has built in support for secrets management. Secrets can be configured within your applications and then the secrets definition can be deployed on a per environment basis - outside of version control of your main application.

Secrets can be scoped for global access or restricted to a specific Elemental subsystem.

To deploy secrets you need to copy a JSON file for each secret into the kernel/.secrets directory. Each JSON file should follow this format:

```
{
    "value": "my-secret-value"
}
```

; where the filename is `secret-name.secret.json` within the kernel/.secrets directory. You can copy these at build time within your dockerfile:

```
COPY my-secrets/*.json /var/elemental/kernel/.secrets/
```

## Contributing

Contributions, code or otherwise, are very welcome!

To contribute a code change:

1. Fork the master branch
2. Carry out your code changes
3. Run the unit tests - `nyc jasmine`
4. Submit a pull request following pull request template

To contribute a none code change raise a ticket on the [original repository](https://github.com/PhilipSkinner/elemental-lowcode).

## Authors

| [![Philip Skinner](https://avatars2.githubusercontent.com/u/879532?s=160&v=4)](https://www.linkedin.com/in/philipskinner/) 	|
|:---------------------------------------------------------------------------------------------------------:	|
|                                            **Philip Skinner**                                            	|

## Support

Raise a ticket on the [repository](https://github.com/PhilipSkinner/elemental-lowcode) describing the issue in as much detail as possible.

Alternatively reach out to me@philip-skinner.co.uk and I'll reply as soon as I can.

## Links

More information about Elemental can be found at:

* [Github Repo](https://github.com/PhilipSkinner/elemental-lowcode)
* [Official Website](https://elementalsystem.org)
* [Dockerhub image](https://hub.docker.com/r/philipskinner/elemental)

The following are standards that Elemental attempts to follow:

* [OpenID Connect](https://openid.net/connect/)
* [JSON Web Token](https://en.wikipedia.org/wiki/JSON_Web_Token)
* [Role-based access control](https://en.wikipedia.org/wiki/Role-based_access_control)
* [JSON Schema](https://json-schema.org/)
* [JSON Path](https://goessner.net/articles/JsonPath/index.html#e2)

Elemental relies upon several other projects, notable ones are:

* [OIDC-Provider](https://github.com/panva/node-oidc-provider)
* [Sequelize](https://sequelize.org/)

## License

Elemental is licensed under the terms of the MIT License and is free to use and free to modify.