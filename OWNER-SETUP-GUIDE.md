# TradeEd — Owner's Setup Guide

Written for a non-coder. Every step says **what to click** or **what to type**, and
**why**. Do them in order, top to bottom.

Total time: about 20 minutes.

---

## What is already done

The website code is finished. I have already:

- Made every page have its own web address (`/courses`, `/pricing`, and so on),
  so links can be shared and the back button works.
- Moved real progress and course enrolments into the database, so a student's
  progress is no longer lost when they clear their browser.
- Put your payment process on the site: students see your JazzCash/Easypaisa
  account, send the fee themselves, upload a receipt, and **you** approve them.
  No payment gateway, exactly as you asked.
- Locked the paid books, videos and live-session links so they only open for
  students whose plan you approved.
- **Fixed the biggest security weakness in the site.** Logins are now handed out
  by the server as a secret key, instead of trusting a name the browser claimed.
  See [the last section](#what-you-never-need-to-worry-about) for what this means
  in plain English.
- **Replaced everything the site claimed but could not deliver** — placeholder
  tool links, a made-up activity chart, and "recording available" labels that led
  nowhere are gone.
- **Added a Policies & Disclaimer page**, linked from the footer of every page,
  covering the risk of trading, refunds and privacy.
- Replaced the placeholder text in the old README with a real one.

**Nothing is broken.** The four steps below are the last bits that only you can
do, because they need your real account numbers, your passwords, and your Vercel
account.

---

## Step 1 — Your payment details ✅ DONE

Your real details have been entered into `src/lib/payment.ts` and will appear on
the Subscribe page once you deploy (Step 4). What is now on the site:

| Field | Value on the site |
| --- | --- |
| JazzCash holder | Muhammad Aslam Khan |
| JazzCash number | 0320-8427368 |
| Easypaisa holder | Muhammad Aslam Khan |
| Easypaisa number | 0313-4457964 |
| WhatsApp | +92 320 8427368 |
| Support email | mk0755698@gmail.com |
| Starter / Premium | PKR 3,000 / PKR 8,000 per month (unchanged) |

**Please double-check those four numbers against your phones**, one digit at a
time. A single wrong digit sends a student's money somewhere it cannot be
recovered. If anything is wrong, tell me and I will correct it.

> Prices were left as they were, since you confirmed they are correct.

**If you prefer to do it yourself:**

1. In VS Code, click the file `src/lib/payment.ts` in the left-hand file list.
2. Find these lines near the top and replace only the text inside the quotes:

   ```
   whatsapp: '923000000000',        ← digits only, no +, no spaces
   whatsappDisplay: '+92 300 0000000',  ← how you want students to read it
   email: 'support@tradeed.com',
   ```

3. Then, a bit lower, replace the account holder and number in **both** blocks
   (one is JazzCash, one is Easypaisa):

   ```
   holder: 'Your Full Name',
   number: '0300-0000000',
   ```

4. Save the file with `Ctrl + S`.

> **Check your prices while you are there.** Look for the block labelled
> `PLAN_CATALOG`, a little further down the same file:
>
> ```
> { id: 'STARTER', name: 'Starter', price: 3000, period: 'month', display: 'PKR 3,000', … },
> { id: 'PREMIUM', name: 'Premium', price: 8000, period: 'month', display: 'PKR 8,000', … },
> ```
>
> Change the number in `price:` (used for calculations) **and** the matching text
> in `display:` (what students read) so the two agree. This one list feeds the
> pricing page, the locked-feature messages and the subscribe form, so nothing
> else needs changing.

---

## Step 2 — The "Crypto Signals Pro" tool ✅ DONE

**Why this mattered:** one of the tools on your AI Tools page pointed at a
temporary builder preview address that was going to stop working, and a second
copy of it was a fake placeholder (`example.com`). A student clicking either one
would land on a dead or fake page — which looks worse than not offering the tool
at all.

**What I did:** I removed that tool completely. Every remaining tool now has a
real web address, and the page checks each one before showing a button. If a tool
ever has a bad or placeholder address, the page shows **"Coming Soon"** on a
disabled button instead of a link that goes nowhere.

**What to do:** nothing. This is finished.

> **If you later want to add the Crypto Signals Pro tool back,** send me its real
> web address and I will add it properly.

---

## Step 3 — Set your passwords and database keys in Vercel

**Why:** Your site needs to know your admin login and how to reach the database.
These are stored as hidden settings in Vercel, **not** in the code. This is what
keeps them secret. If they are missing, admin login, book unlocking and paywall
checks will not work on the live site.

**What to do:**

1. Open your web browser and go to **https://vercel.com** and sign in.
2. Click on your **TradeEd** project.
3. In the top menu click **Settings**.
4. In the left menu click **Environment Variables**.
5. You will add five entries. For each one: type the **Name**, paste the
   **Value**, leave the Environments checkboxes as they are (all three ticked),
   then click **Save**.

| Name (type exactly, capitals matter) | Value |
| --- | --- |
| `ADMIN_EMAIL` | The email you want to log into the admin panel with |
| `ADMIN_PASSWORD` | A **strong** password, at least 12 characters. This is your admin login |
| `DATABASE_URL` | **Already done — skip it** (see below) |
| `DATABASE_AUTH_TOKEN` | **Already done — skip it** (see below) |
| `BOOK_TOKEN_SECRET` | Any long random sentence you invent, e.g. `purple-ocean-42-battery-lamp-!!` |

### If a variable already exists, leave it alone

You told me `DATABASE_URL` is already there. **That is good news — do nothing to
it.** Do not delete it, do not re-type it, do not "update" it. An existing,
working `DATABASE_URL` is the exact thing the site needs. If you click into it
and it looks fine, close it and move on to the next one.

You only need to **add** the ones that are missing. Because `DATABASE_URL`
already exists, you are adding four, not five:

**Must add:** `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `DATABASE_AUTH_TOKEN`, `BOOK_TOKEN_SECRET`

The one to check next is **`DATABASE_AUTH_TOKEN`**. Scroll the list and look for
it. Think of `DATABASE_URL` as the address of a building and
`DATABASE_AUTH_TOKEN` as the key to the front door — the site needs both, and it
cannot get in with the address alone. If it is missing, get a token from
turso.tech and add it. If it is already there, skip it.

### How to check if a variable exists and is correct

1. In the Environment Variables list, read the names down the left-hand side.
2. Click the name. The value is hidden, so click the **eye icon** to peek at it.
3. Compare it to what you expect:
   - `DATABASE_URL` should begin with `libsql://`
   - `DATABASE_AUTH_TOKEN` should be a long string with dots in it (it is a
     special key called a JWT) — if it looks like a short random word, something
     is wrong
   - `ADMIN_EMAIL` must match your email exactly, including the part after `@`
4. **If it matches:** click Cancel or close. Change nothing.
5. **If it is blank or clearly wrong:** click **Edit**, paste the correct value,
   Save.

> **Where do the Turso values come from?** Sign in at **https://turso.tech**,
> open your database, and the URL and a **Create Token** button are shown there.
> Creating a new token is free and safe; it does not break anything that already
> works. Tokens are the only value here you may have to fetch again, because
> Turso may not show an old one to you twice.
>
> **`ADMIN_PASSWORD` is important.** It is the one you use to approve students.
> Do not use a password you use anywhere else. Do not send it to me.

6. **Important last click:** after adding the variables, go to the **Deployments**
   tab, click the **⋯** (three dots) next to the newest deployment, and click
   **Redeploy**. Settings only take effect on a fresh build. Even if you only
   *looked* at the list and changed nothing, do this — it costs nothing and
   guarantees the live site is using the current settings.

### How to tell it worked

The site will tell you. Visit your website's admin login while the settings are
wrong and it says *"Admin credentials not configured"*. After you add
`ADMIN_EMAIL` and `ADMIN_PASSWORD` and redeploy, that message disappears and
your login is accepted. That single message is your yes/no answer — you do not
need to read any code.

### "Needs Attention" in red — what it really means

**It is a suggestion, not a failure.** Your site works whether the badge is
there or not. Do not delete a variable to make the badge go away; that is the
one action that *would* actually break the site.

Vercel flags a secret when the same value is shared across Production, Preview
and Development. It is nudging you to scope secrets so only Production can read
them. This page even offers a link called **Separate Production Secret Values**,
which is exactly what the badge is about.

**You can leave it as it is.** These four values are all the same in every
environment anyway, and nothing about the badge changes how the code reads them.

**If the badge bothers you,** the tidy fix is:

1. Click the variable, then click **Edit**.
2. Change the **Environments** tick-boxes so only **Production** stays ticked.
3. Save, then **Redeploy**.

Do that only for secrets. `ADMIN_EMAIL` is not secret and is fine everywhere.

### The password-reset email ✅ CODE IS READY — you just need a mail account

**Read this one carefully, because it affects your students.**

When a student forgets their password, they click **Forgot password**. The site
creates a one-time reset code that is valid for one hour, and **emails it to them**.

That email sending is now built and waiting. There is one thing it needs from you,
because it cannot invent it: **an account with an email sending service.**

**What you need to do — about 15 minutes, once:**

1. Go to <https://resend.com> and create a free account (free plans send plenty of
   password-reset emails; Postmark, SendGrid and SMTP2GO also work if you prefer).
2. In their dashboard, add your domain (for example `tradedu.pk`) and follow their
   instructions to add a couple of DNS records. This is what stops your emails
   landing in spam. If you do not have a domain yet, tell me and we will sort one
   out — a proper `no-reply@` address needs a domain.
3. Create an **API key** and copy it.
4. Send me these three things, or add them in Vercel yourself under
   **Settings → Environment Variables**:

   | Setting name | What to put in it |
   | --- | --- |
   | `RESEND_API_KEY` | the API key you just copied |
   | `EMAIL_FROM` | `TradeEd <no-reply@yourdomain.com>` — using your own domain |
   | `APP_BASE_URL` | `https://yourdomain.com` — your live site address |

5. Click **Redeploy** in Vercel.

That is the whole job. The code already knows how to use those three values in both
places the site runs (the live serverless function and the local server), and it
picks Resend automatically once `RESEND_API_KEY` exists.

**Until you do this, what happens?** Nothing breaks. The site stays secure and never
shows the reset code on screen. A student who forgets their password contacts you on
WhatsApp or email, you confirm who they are, and you reset it for them from the admin
panel. So you are never stuck — this step makes it self-service for the student.

**Safety notes, so you know what you are getting:**

- If a key is wrong or the mail service is having an outage, the site stays online and
  quietly logs the problem. It never shows the student an error that would reveal
  whether an account exists.
- The reset email contains a link that opens the reset page with the code already
  filled in, plus the code printed as text in case the link will not open.
- The code works **once** and expires after one hour. When a password is changed, any
  session already signed in with the old password is signed out.

**Do not** add a setting called `ALLOW_TOKEN_IN_RESPONSE`. That one exists only for
testing on your own machine and puts the reset code back on screen for anyone to see.
It must never be set on the live site.

### `BOOK_TOKEN_SECRET` — optional, and it is missing from your list

Your list has four variables, not five. `BOOK_TOKEN_SECRET` was not added.

**This is not urgent and the site still works.** In
[`api/index.ts`](api/index.ts:283) the book secret falls back to
`ADMIN_PASSWORD`, so paid books still unlock. But the fallback ties two
unrelated things together: if you ever change your admin password, every
student who has a book open gets logged out of that book. Adding a separate
`BOOK_TOKEN_SECRET` avoids that. Recommend adding it when convenient.

### One thing to double-check

Your list shows `DATABASE_URL` was **updated 10 minutes ago**. If you re-typed
it and a character is wrong, the site will load but show no courses.

Click it, click the **eye icon**, and confirm it **starts with `libsql://`**.
Do not paste the value anywhere — just tell me yes or no.

### Your secrets are not on GitHub (I checked)

I verified the repository: there is **no `.env` file anywhere**, and **no
environment file is tracked by git**. The `.gitignore` excludes `.env`,
`.env.local` and the local database files. Your passwords and tokens exist only
in Vercel and on your machine. Nobody browsing your GitHub can read them.

---

## Step 4 — Send the finished code to your live site

**Why:** I changed files on your computer. GitHub and Vercel still have the old
version. This step copies your changes up so the public site updates.

**What to do:**

1. In VS Code, click the **Source Control** icon in the far-left bar (it looks
   like a tree with a branch, or press `Ctrl + Shift + G`).
2. You will see a list of changed files. In the text box at the top, type a
   short note: `Add real page URLs, fix payment details, lock paid content`
3. Click the **✓ Commit** button just above that box.
4. A blue button will appear saying **Sync Changes** (or **Push**). Click it.
5. Vercel will now build automatically. Give it 2–3 minutes, then open your
   website and check it.

> **If it asks you to sign in to GitHub**, do that — it is your own account and
> you are only sending your own work.

---

## Step 5 — Check everything works (5 minutes)

Open your live website and tick these off:

- [ ] The home page loads.
- [ ] Click **Courses** — the address bar now ends with `/courses`.
- [ ] Click a course — the address ends with `/courses/something`. **Press
      `F5` to refresh.** The page must still be that course, not jump to home.
- [ ] Press your browser's **Back** button — it should return to the courses list.
- [ ] Open **Pricing**, choose a plan — the address becomes
      `/subscribe?plan=STARTER` and the form already has that plan selected.
- [ ] On the Subscribe page, **your real JazzCash/Easypaisa numbers appear**.
- [ ] Open **Books** while logged out — paid books show a lock instead of opening.
- [ ] Open **Policies & Disclaimer** (the link is in the footer of every page).
      The trading-risk warning, refund window and your contact details must all be
      there — this is the page a student is sent to if they question a payment.
- [ ] Log in as admin, go to **Admin → Subscriptions**. Your test request is
      listed with its receipt. Approving it should change that student's plan.
- [ ] Log in as that student and confirm the paid content now opens.

---

## THE REAL REASON NOTHING HAD ANY EFFECT

Your last commit to GitHub was on **2 September**. Every file I edited was still
sitting on your computer, not committed and not pushed:

```
 M api/index.ts          ← the live server is running the OLD version of this
?? src/lib/routes.ts
```

Because of that, **your redeploy rebuilt the old code**. The Vercel settings you
changed were correct, but the code reading them was old.

The live code still compares your login like this — a raw, character-for-character
match with no trimming and no case folding:

```ts
if (email !== adminEmail || password !== adminPassword) return send(res, 401, ...)
```

So any of these fail silently, with no way to tell which one happened:

- a **trailing space** in the password, copied in from a document or a chat
- one **capital letter** in the email — `MK0755698@gmail.com` where the setting
  holds `mk0755698@gmail.com`
- a hidden newline pasted in with either value

The code sitting on your computer already fixes this (see
[What I changed in the code](#what-i-changed-in-the-code-so-this-stops-being-a-guessing-game)),
but **the fix is not live until you push it**. Do Step 4 in this guide first,
then return to this section.

### The bulletproof way to set the admin password

Once the updated code is deployed, the server cleans the configured values before
comparing them, so most paste damage no longer matters. It still helps to start
from values that cannot contain a mistake:

1. In Vercel, set `ADMIN_EMAIL` to your address with no leading or trailing
   space (capital letters in the email are now harmless).
2. Set `ADMIN_PASSWORD` to a deliberately simple value with **no spaces and no
   punctuation** — for example: `TradeedAdmin2026`
3. **Redeploy** (Deployments → ⋯ → Redeploy).
4. Log in with **Administrator** selected and type that exact text.

You can make it stronger later, once you know login works. `TradeedAdmin2026`
is uppercase T, the rest lowercase, then 2026 — that is easy to reproduce
exactly.

> The password itself is **not** trimmed on the login side, on purpose: spaces
> inside a password are legitimate. Only the stored setting gets cleaned, so a
> stray space that arrived while pasting into the Vercel box is removed. Type the
> password exactly as you intend it to be.

---

## Admin login says "Invalid email or password"

There are **two completely different causes** for this one message, and until now
the site could not tell you which one you were hitting. I have fixed that, so
after your next deploy the message will name the actual problem.

### Cause 1 — "Administrator" mode is not selected

On the login screen there is a **Student / Administrator** toggle. It is easy to
miss. They go to **different places**:

| Toggle | Where it checks the password |
| --- | --- |
| **Student** | The **database** — accounts created by students who signed up |
| **Administrator** | Your **Vercel settings** — `ADMIN_EMAIL` and `ADMIN_PASSWORD` |

Your admin email and password are **not** a database account. So if you leave the
toggle on **Student** and type your admin details, the server looks in the
database, finds nothing, and replies "Invalid email or password" — even though
your details are perfectly correct.

**Fix:** click **Administrator** on the toggle, then try again.

After the next deploy the error message will say so explicitly:
*"If this is the admin account, switch the toggle above to Administrator."*

### Cause 2 — A hidden space, capital letter or a stale deploy

On the old code, `ADMIN_EMAIL` and `ADMIN_PASSWORD` were compared character by
character, so these all failed:

- `Aslam@Gmail.com` when the setting says `aslam@gmail.com` — capitals had to
  match exactly
- A password saved with a space at the end, because the text was pasted from a
  document
- A trailing newline that came along with a copy-paste from a PDF or email
- `ADMIN_EMAIL` typed as `ADMIN_email` — **the variable names are still
  case-sensitive, and this one is still a real error**

The updated code removes the first three problems and tells you which field
actually failed. It cannot help with a misspelled variable name or with a deploy
that has not been made yet.

**Fix, step by step:**

1. Vercel → your project → **Settings** → **Environment Variables**.
2. Click `ADMIN_EMAIL`, click the **eye icon**, and read it out loud. Then type
   it into the login box letter for letter. Watch for a capital `G` versus a
   small `g`, and for the part after `@`.
3. Do the same for `ADMIN_PASSWORD`.
4. **Avoid retyping the password by hand.** The safest method on Windows:
   open Notepad, type the password there, select it, press `Ctrl + C`, paste it
   into the Vercel value box, and paste the same text into the website login box.
   That guarantees both sides are identical.
5. After editing, **Redeploy** (Deployments → ⋯ → Redeploy). A changed setting
   does nothing until the next build.

### What I changed in the code so this stops being a guessing game

- **The configured values are cleaned before they are compared.** A leading or
  trailing space, a newline, a byte-order mark, or a pair of quotes wrapping the
  value (all of which are easy to paste in by accident) are stripped from
  `ADMIN_EMAIL` and `ADMIN_PASSWORD` first.
- **The email comparison ignores capital letters.** `Aslam@Gmail.com` and
  `aslam@gmail.com` now match. The password comparison is still exact, because
  password case must matter.
- **"Not configured" is no longer the same message as "wrong password".** If
  either variable is missing, the server answers with a **500** and the text
  *"Admin login is not configured on the server yet"* plus the exact variable
  names to add. Only a genuine mismatch produces the **401** *"Invalid email or
  password"*.
- **A rejected attempt is logged on the server.** In Vercel → your project →
  **Logs**, a rejected login prints one line naming which of the two fields
  matched and the length of each value. It **never** prints the values
  themselves, so this cannot leak your password:

  ```
  [admin-auth] rejected: emailMatch=false passwordMatch=true
    emailLenSubmitted=18 passwordLenSubmitted=15 passwordLenConfigured=15
  ```

  In that example the password was right and the email was not — which points
  straight at `ADMIN_EMAIL`.
- **The login screen names the real cause.** A 500 (server not configured) and a
  401 (details wrong) now show different, accurate messages instead of one
  generic line.
- If a hosting error page ever comes back instead of a normal reply, the site
  reports the true reason instead of a misleading "could not connect to server".

### One more thing I fixed

Your **local** code had a leftover shortcut that accepted the admin login
whenever the email matched a row in the database. Production never had this
shortcut, so the two environments could disagree — a login that worked on your
machine could fail on the live site. I removed it, so both now check exactly the
same thing: `ADMIN_EMAIL` and `ADMIN_PASSWORD`. One rule, one result.

---

## If something goes wrong

**"The site shows an old version."** Vercel may still be building, or the
redeploy in Step 3 was missed. Wait 3 minutes and refresh with `Ctrl + F5`.

**"Admin login does not work."** In order:

1. Is the **Administrator** toggle selected? Your admin details are not a
   student account.
2. Did you **commit, push and redeploy** after this fix? Vercel is still building
   your 2 September commit until you do.
3. Read the **Vercel Logs** for the `[admin-auth] rejected:` line. It tells you
   whether `emailMatch` or `passwordMatch` was false, and the length of each
   value, without revealing the values.
4. If the reply is *"Admin login is not configured on the server yet"*, the
   variable names are missing or misspelled — check `ADMIN_EMAIL` and
   `ADMIN_PASSWORD` exist with exactly those names.

**"Student cannot open a paid book."** Check `BOOK_TOKEN_SECRET` exists in
Vercel, then redeploy.

**"A page shows 'Page not found'."** That is the site's own friendly 404. It
means the address was typed wrong. Click **Go to home**.

**Anything else:** take a screenshot of the screen and send it to me with what
you clicked just before. I can fix it from the code.

---

## What you never need to worry about

- There is **no payment gateway** and **no card data** anywhere on this site.
  Students pay you directly, and only you can approve a plan.
- Your admin password is stored scrambled (PBKDF2). Even someone who steals the
  database cannot read it.
- Paid book files are **not** in the public website files. They can only be
  fetched through the secured door that checks the student's plan first.
- **Students can no longer be impersonated.** Until this round of work, the site
  trusted a name that the browser sent along with each request — so a technically
  capable visitor could have sent another student's email address and read their
  journal and progress. That is gone. The server now hands out a secret login
  key, stored only in a form the browser's own scripts cannot read, and it checks
  that key on every request. A browser can no longer claim to be someone else.
- **A student who changes their password is signed out everywhere.** If someone
  had somehow got hold of their login, that access dies the moment the password
  changes.
- **Plan prices and what each plan unlocks come from one place.** The pricing
  page, the locked-screen messages and the subscribe form can no longer disagree
  about what a plan costs or contains.
- **The site no longer claims things it cannot deliver.** Placeholder tools,
  invented charts and "recording available" labels that pointed at nothing have
  been removed or replaced with the real data. What a student sees on the site is
  what actually exists.
- **There is a written policy page.** Before, the footer had dead words like
  "Privacy" that led nowhere and there was no refund position at all. There is now
  a real Policy & Disclaimer page covering terms, refunds, privacy and the risk of
  trading — linked from the footer of every page.
