# Testing Local Dev on Other Devices via Tailscale

`web:start` exposes the local dev server to your tailnet automatically (see [ADR-0031](../../adr/0031-tailscale-serve-for-cross-device-local-dev.md)), so you can reach it from a phone or another laptop without touching the mkcert/hosts-file setup at all. This is entirely additive: `https://localhost.www.craftsmans-ledger.dev:8080` keeps working exactly as before for same-machine development.

## Prerequisites

- Tailscale installed and signed in on your dev machine, and already part of your tailnet.
- The other device (phone, laptop) also signed in to the same tailnet.
- A Tailscale ACL that restricts which devices can reach this dev machine's served app, since it's exposed to the whole tailnet by default otherwise. Configure this in your [Tailscale admin console](https://login.tailscale.com/admin/acls/file).

## Using it

Nothing extra to run: `pnpm moon run web:start` also runs `root:setup-tailnet`, which configures `tailscale serve` to proxy `https://<your-machine>.<your-tailnet>.ts.net:8080` to the local dev server. On this project's dev machine, that's `https://desktop-oscar.wolf-triggerfish.ts.net:8080`.

## Stopping it

The `tailscale serve` mapping isn't torn down automatically when you stop `ng serve`, since the dev machine's Tailscale identity is shared with other, unrelated services. When you're done testing on other devices, remove it manually:

```bash
pnpm moon run root:teardown-tailnet
```
