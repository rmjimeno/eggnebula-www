# Newsletter sign-ups to Google Sheets

The "Subscribe" form posts to a small Google Apps Script. The script adds a row
(time, name, email) to a Google Sheet and ignores repeat emails. Free, no server.

## Setup (about 5 minutes)

1. **Create the Sheet.** Go to <https://sheets.new> and name it, e.g. "Egg Nebula subscribers".
   Leave it empty. The script creates a `Subscribers` tab and the header row.
2. **Open the script editor.** In the Sheet: **Extensions > Apps Script**.
3. **Paste the code.** Delete the sample code, paste in everything from
   [`Code.gs`](./Code.gs), and press the save icon.
4. **Deploy.** Click **Deploy > New deployment**, then the gear icon > **Web app**:
   - **Execute as:** Me
   - **Who has access:** Anyone
   Click **Deploy**. Google asks you to authorize it: choose your account,
   **Advanced > Go to (project name) (unsafe)** > **Allow**. This warning is
   normal for your own scripts; it only lets the script edit this one Sheet.
5. **Copy the Web app URL** (it ends in `/exec`).
6. **Paste it into the site.** In `js/main.js`, set:

   ```js
   const NEWSLETTER_ENDPOINT = "https://script.google.com/macros/s/XXXX/exec";
   ```

7. **Test.** Submit the form on the site (or the local preview) and check the Sheet.

## Good to know

- **Changing the script later:** after editing `Code.gs`, use **Deploy > Manage
  deployments > pencil icon > Version: New version > Deploy**. The URL stays
  the same. Saving alone does not update the live version.
- **Getting emails in your inbox too:** in the Sheet, **Tools > Notification
  settings > "Any changes are made"** emails you when someone subscribes.
- **Keep the Sheet private.** Don't share it with "anyone with the link": it
  holds people's email addresses. Only the web app URL is public, and it can
  only add rows.
- **Spam:** the form has a hidden field that bots fill in and the script then
  ignores; invalid emails are rejected too.
- **Privacy:** you're collecting personal data, so say what it's used for near
  the form (e.g. "We'll only email you when there's something new").
