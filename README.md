# COMICSN

The site is a static HTML, CSS, and vanilla JavaScript catalog (manga, novels, and anime) plus an admin console. A Node.js server stores the catalog, users, and VIP membership in SQLite and serves the pages.

## Run locally

Requires Node.js 22 or newer. No extra packages are installed.

```bash
export ADMIN_PASSWORD='choose-a-password'
npm start
```

Then open:

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin/

Sign in to the admin console with the username `admin` and the password from `ADMIN_PASSWORD`.

You can also put settings in a gitignored `.env` file (see `.env.example`):

```bash
PORT=3000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=choose-a-password
```

If `ADMIN_PASSWORD` is not set on the first start, the server creates the admin account with a random password and writes it to `data/initial-admin-password.txt`. That file is not part of the repository. Do not commit it.

The database file is `data/comicsn.sqlite`. Uploaded covers and videos are stored under `data/assets/`. Deleting the `data/` directory and starting again creates a fresh catalog.

## What is stored on the server

- Manga, novel, and anime records, including chapters and episodes
- Admin edits to that catalog, so a refresh or another browser sees the same data
- Visitor accounts and VIP / membership orders
- The rest of the admin console (banners, orders, logs, and similar records)

Public pages keep their current layout. They still ship with the built-in catalog, and replace a title, cover, or new work only after it is changed in the admin console.

Visitor language, NSFW, and reading-layout preferences stay in the browser.

## Checks

```bash
npm test
```
