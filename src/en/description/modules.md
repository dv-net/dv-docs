# Application modules

## Basic modules

The application consists of three modules:
- `dv-merchant` - the module includes a web server, front-end for displaying the payment form and control panel, code
  interactions with third-party exchanges, as well as all the business logic for creating projects, wallets for clients, sending
  webhooks to the store and rules for sending the received cryptocurrency
- `dv-processing` - the module stores the phrase mnemonic and signs transactions on behalf of `dv-merchant`.
- `dv-updater` - the module is responsible for automatic updating. Managed from `dv-merchant`.

## Additional packages

The ecosystem provides additional packages and tools that can be used to install and configure auxiliary services (PostgreSQL, Redis, etc.). 
Their composition and installation methods may vary depending on the operating system and the specific application build.


## Application Placement and User Permissions

All application modules are installed in the `/home/dv` directory.
A system user `dv:dv` is automatically created and used to run application services and manage configuration files.

Services such as PostgreSQL and Redis are installed using standard operating system tools or automation tools supplied with the application. 
They use regular system accounts and standard ports (unless otherwise specified in the configuration).
Service autostart is handled via `systemd`.
