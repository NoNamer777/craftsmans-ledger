# Craftsman's Ledger

## Overview

This repository contains the code for the Craftsman's Ledger app. This app is tailored for the game Medieval Dynasty and allows players to calculate the profit per Item that can be crafted in the game.

The Items shown can be sorted based on:

- Which Item generates the most amount of profit in general. 
- Which Item generates the most amount of profit in general for least amount of the time spent to craft the Items.
- Which Item generates the most amount of profit for the least amount of weight.

---

## Getting started

### Prerequisites

To be able to work in this repository you'll need the following:

- Have [Git](https://git-scm.com/downloads) installed.
- Have Node.Js v22 installed
  - We recommend having [mise](https://mise.jdx.dev/) installed and set up to automatically install the required version of Node.
- Have [mkcert](https://github.com/FiloSottile/mkcert) installed and configured.

### Installation

1. Clone the repository using Git:
   ```bash
   git clone https://github.com/nonamer777/craftsmans-ledger.git
   ```

2. Navigate into the project:
   ```bash
   cd craftmans-ledger
   ```

3. Install required tools (Optional)  
   If you've manually installed the required tools (a Java JDK and Node.Js) you may skip this step. If you're using Mise you can install these required tools now by running the following command:

   ```bash
   mise install
   ```

4. Install dependencies
   ```bash
   npm ci
   ```

5. Generate a local certificate and key  
   In order to enable developing with SSL enabled you need to generate a self-signed certificate and key and update the hosts file on your machine to let your browsers know the custom URLs.

   1. If you've not done so already, you should install the mkcert root CA by running the following command: 
      ```bash
      mkcert -install
      ```
   
      You need to restart your browsers in order for them to use this new root CA.

   2. Generate the certificate and key:
      ```bash
      mkcert --cert-file certificate.pem -key-file certificate-key.pem localhost.www.craftsmans-ledger.net localhost.api.craftsmans-ledger.net localhost.admin.craftsmans-ledger.net localhost
      ```

   3. Add the URLs to the hosts file on your machine.

      1. Open the hosts file in a program with elevated permissions (administrator/sudo). You can find the hosts file at the following paths for your OS:

         | OS      | Path                                    |
         |---------|-----------------------------------------|
         | Windows | `C:\Windows\System32\Drivers\etc\hosts` |
         | MacOS   | `/etc/hosts`                            |

      2. Add the following contents to the file:

         ```text
         # URls for apps used by Craftsman's Ledger
         127.0.0.1  localhost.www.craftsmans-ledger.net     # Address of the main web app.
         127.0.0.1  localhost.api.craftsmans-ledger.net     # Address of the API backend.
         127.0.0.1  localhost.admin.craftsmans-ledger.net   # Address of the admin-portal web app.
         ```

      3. Save and close the file.
      
   4. Make sure the self-signed certificate is trusted by your OS
      
      <details open>
         <summary>For Windows</summary>

         1. To add certificate.pem to the Trusted Root Certification Authorities store on Windows you need to start `Microsoft Management Console`. This can be done by pressing `<Windows Key> + R` or searching for the `Run` desktop app. Then run `mmc`.
         2. Then go to `File > Add/Remove Snap-in…` and select `Certificates` for the current user.
         3. Once that has been added, you should be able to navigate to: `Console Root\Certificates - Current User\Trusted Root Certification Authorities\Certificates`.
         4. Right-click on `Certificates` under `Trusted Root Certification Authorities` and select `All Tasks > Import…`. 
         5. Locate your `certificate.pem` file and import it. Once imported, you should be able to find it listed as a trusted certificate.
         6. Close Microsoft Management Console (you do not need to save the console).
         7. **Restart** your browser(s).
      </details>
      <details>
         <summary>For MacOS</summary>
            
         1. Double-click the `certificate.pem` file, you'll be prompted to add the certificate to the login keychain app.
         2. Once added to the keychain, you can then select the created certificate from the `Keychain Access` window. It can be difficult to find when there are multiple certificates.
         3. Select the created certificate and right-click to select `Get Info` from the context menu. Then expand the `Trust` triangle. You should then be able to select to `Always Trust` the certificate for `SSL`. 
         4. Close the panel and confirm the changes with password or fingerprint. 
         5. Now you should not see HTTPS warnings when serving the applications with HTTPS. Applications already opened in the Chrome browser should be reloaded.
      </details>

### Running a project

To serve an application find the command to run below in the table along with the address on which the applications will be served:

| Project      | Command                   | Address                                            |
|--------------|---------------------------|----------------------------------------------------|
| web-app      | npx nx serve web-app      | https://localhost.www.craftsmans-ledger.net:7000   |
| admin-portal | npx nx serve admin-portal | https://localhost.admin.craftsmans-ledger.net:7100 |
| api          | npx nx serve api          | https://localhost.api.craftsmans-ledger.net:7200   |
