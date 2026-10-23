# Launch: moving from the preview to www.khanmohammadi.me

The site currently deploys to the GitHub Pages preview at https://ledengary.github.io/website/.

- **Repo:** `ledengary/website`.
- **Deploy:** `.github/workflows/deploy.yml` (`withastro/action`) runs on every push to `main`.
- **Path settings:** the canonical URLs, `sitemap.xml` and `robots.txt` already use https://www.khanmohammadi.me. Only the base path and the domain wiring change at cutover.

**Sources.** The GitHub IPs and steps below are from GitHub's official docs, checked 2026-10-22:
- [Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [Verifying your custom domain for GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)

Re-check both pages on the day you do this.

GitHub's order matters. **Add the custom domain in GitHub before changing DNS.** Pointing DNS first can let someone else claim the domain on GitHub Pages.

---

## 1. Verify the domain on your GitHub account (do this first)

Verification stops anyone else from using khanmohammadi.me on GitHub Pages.

1. On GitHub, open your profile picture, then **Settings**. This is your account settings, not the repo's.
2. In the sidebar under "Code, planning, and automation", click **Pages**.
3. Click **Add a domain**, enter `khanmohammadi.me`, then click **Add domain**.
4. GitHub shows a TXT record to create:
   - **Name:** `_github-pages-challenge-ledengary`. In GoDaddy, enter just this part; GoDaddy appends `.khanmohammadi.me`.
   - **Value:** the code GitHub shows on that page.
5. In GoDaddy, go to **Domain** → **DNS** → **Add New Record**. Choose type **TXT**, then paste the name and value from step 4.
6. Check that the record is live:
   ```sh
   dig _github-pages-challenge-ledengary.khanmohammadi.me +nostats +nocomments +nocmd TXT
   ```
7. Back in GitHub's Pages settings, click **Verify**. If you left the page, use ⋯ → **Continue verifying**. DNS can take up to 24 hours.
8. **Keep this TXT record permanently.** The domain stays verified only while it exists.

## 2. Switch the site to the custom domain (code change)

1. In `astro.config.mjs`, change the one base value:
   ```js
   const base = '/';
   ```
   Every internal link, image, font, script, the `/academic` redirect and the share image follow it automatically. The middleware and `Base.astro` read it from Astro.
2. Create `public/CNAME` containing exactly one line:
   ```
   www.khanmohammadi.me
   ```
3. Run `npm run build` and `npx playwright test`. The tests read the base from `astro.config.mjs`.
4. Commit and push to `main`, then wait for the **Deploy to GitHub Pages** Action to go green.

## 3. Set the custom domain in the repo

1. Open `ledengary/website`, then **Settings** → **Pages**.
2. Under **Custom domain**, enter `www.khanmohammadi.me` and click **Save**.
3. GitHub runs a DNS check. It will fail until step 4 is done; that's expected.

## 4. GoDaddy DNS (khanmohammadi.me)

These are the current records, from a `dig` on 2026-10-22. The nameservers are GoDaddy's: `ns19/ns20.domaincontrol.com`.

| Host | Type | Current value | What it is |
|---|---|---|---|
| `www` | CNAME | `sites.framer.app` | Framer site |
| `@` | A | `52.223.52.2` | not Framer; most likely GoDaddy's domain **forwarding** service |
| `@` | A | `35.71.142.77` | not Framer; most likely GoDaddy's domain **forwarding** service |

There are no MX, TXT or AAAA records on the apex right now. Check again in GoDaddy before editing, in case that has changed.

### Remove

- **`www` CNAME → `sites.framer.app`** (Framer).
- **Any domain forwarding** that points the bare domain to www or Framer. In GoDaddy this lives under **Domain** → **Forwarding**, not in the DNS table. Delete the forward; its two A records above should go with it. If they remain in the DNS table, delete those two A records.
- Any other record whose value mentions `framer`, for example `31.43.160.6` or `31.43.161.6`, or a Framer verification TXT record. In Framer, also remove the custom domain from the project so it stops expecting it.

### Add

| Host | Type | Value | TTL |
|---|---|---|---|
| `www` | CNAME | `ledengary.github.io` | 1 hour |
| `@` | A | `185.199.108.153` | 1 hour |
| `@` | A | `185.199.109.153` | 1 hour |
| `@` | A | `185.199.110.153` | 1 hour |
| `@` | A | `185.199.111.153` | 1 hour |

- **The www value is `ledengary.github.io`, with no repo name.** A trailing dot is fine if GoDaddy adds one.
- **IPv6 (optional, recommended by GitHub alongside the A records):** four `@` AAAA records: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.
- **Wildcards:** don't add a wildcard (`*`) record. GitHub strongly advises against it.

GitHub Pages then redirects `khanmohammadi.me` to `www.khanmohammadi.me`, because the custom domain is the www one.

### ⚠️ Leave everything else alone

**Don't touch any record you don't recognize as Framer or forwarding.** That includes:
- MX (email)
- TXT records: SPF, DKIM, DMARC, Google, Microsoft or other site verifications, and the `_github-pages-challenge-ledengary` one from step 1
- SRV, CAA and `_domainconnect` records
- the NS and SOA records

Removing those can break email or other services.

## 5. Check, then turn on HTTPS

1. Check that the DNS records are live. Expect the www name to return `ledengary.github.io.` and the apex to return the four `185.199.x.153` addresses:
   ```sh
   dig www.khanmohammadi.me +noall +answer
   dig khanmohammadi.me +noall +answer
   ```
2. In the repo, under **Settings** → **Pages**, wait for the DNS check to pass. GitHub then issues a TLS certificate automatically, which can take up to about an hour after DNS is correct.
3. When the option becomes available, tick **Enforce HTTPS**.
4. Check that these all land on `https://www.khanmohammadi.me/`:
   - `https://www.khanmohammadi.me/`
   - `http://khanmohammadi.me/`
   - `https://khanmohammadi.me/`

   Also check `/about/`, `/research/` and `/resume.pdf`.
5. Optional: submit `https://www.khanmohammadi.me/sitemap.xml` in Google Search Console.

## Rollback

- **DNS:** restore the `www` CNAME to `sites.framer.app` and re-enable GoDaddy forwarding.
- **Repo:** clear the custom domain field. The site goes back to serving the preview URL once the base is `/website` again.
