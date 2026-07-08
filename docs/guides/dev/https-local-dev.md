# HTTPS for Local Dev

`web` (and, eventually, the API and management client) serves exclusively over HTTPS in local development; see [ADR-0030](../../adr/0030-web-dev-server-https-only.md). Getting this working locally is a one-time, per-machine setup.

## 1. Install mkcert

[mkcert](https://github.com/FiloSottile/mkcert) issues locally trusted TLS certificates, so browsers trust them without the warnings a self-signed certificate would trigger.

- macOS: `brew install mkcert`
- Windows: `choco install mkcert` or `winget install FiloSottile.mkcert`
- Linux: see mkcert's [installation instructions](https://github.com/FiloSottile/mkcert#installation)

## 2. Trust mkcert's local CA

```bash
mkcert -install
```

This installs mkcert's certificate authority into your system and browser trust stores, so certificates it issues are trusted without warnings. **Restart your browser** afterward, since it won't pick up the new trust store otherwise.

This is a one-time step per machine, not per project, and isn't automated by any moon task, since it needs elevated privileges to touch the system trust store.

## 3. Add local hostnames to your hosts file

Local dev uses hostnames under `craftsmans-ledger.dev`, prefixed with `localhost.` (see [ADR-0029](../../adr/0029-local-dev-hostname-convention.md) for why). Add the following entries:

```text
127.0.0.1 localhost.www.craftsmans-ledger.dev
127.0.0.1 localhost.api.craftsmans-ledger.dev
127.0.0.1 localhost.admin.craftsmans-ledger.dev
```

- macOS/Linux: `/etc/hosts` (edit with `sudo`)
- Windows: `C:\Windows\System32\drivers\etc\hosts` (edit as Administrator)

`localhost` and `127.0.0.1` themselves need no entry: they already resolve natively, and are included in the generated certificate as a fallback.

This is also a manual, one-time step per machine, since it needs elevated privileges to edit the hosts file.

## Done

With the CA trusted and the hostnames resolving, `pnpm moon run web:start` generates its own certificate automatically (via the cached `root:setup-https` task) and serves over HTTPS, with no further setup needed.
