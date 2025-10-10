# Application modules

## Basic modules

The application consists of three modules:
- `dv-merchant` - the module includes a web server, front-end for displaying the payment form and control panel, code
  interactions with third-party exchanges, as well as all the business logic for creating projects, wallets for clients, sending
  webhooks to the store and rules for sending the received cryptocurrency
- `dv-processing` - the module stores the phrase mnemonic and signs transactions on behalf of `dv-merchant`.
- `dv-updater` - the module is responsible for automatic updating. Managed from `dv-merchant`.

## Additional packages

In the ecosystem there are also `dv-env` packages for different operating systems, which include `postgres` and
`redis` collected in a special way and configured automatically.


## Application placement and user rights

All modules are installed in the `/home/dv` directory, and the `dv:dv` user is created in the operating system. For
`postgres` and `redis` installed using the `dv-env` package retain their original users, but they run on non-standard 
ports: `postgres`: `5433`, `redis`: `6380`. Autostart of services is provided through `systemd`
