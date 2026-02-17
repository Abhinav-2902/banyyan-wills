# Manual Test Guide for Premium Features

This guide explains how to manually test premium features (editing finalized wills, version history) using the development bypass key.

## Prerequisites

- You have a local development environment running.
- You have at least one test user and one will created.

## Step 1: Enable the Dev Bypass

To enable the bypass, you need to set a special environment variable.

1.  Open your `.env` file in the root directory.
2.  Add the following line:

    ```env
    DEV_TEST_BYPASS_KEY="banyyan-dev-test-2024"
    ```

3.  **Restart your Next.js server** (`npm run dev`) for the environment variable to take effect.

## Step 2: Prepare a Finalized Will

To test the premium editing features, you need a will that is already marked as `COMPLETED` or `PAID`.

1.  Log in to the application.
2.  Use the provided script `src/scripts/setup-dev-premium.ts` to set up a test user and will:
    ```bash
    npx tsx src/scripts/setup-dev-premium.ts
    ```
    _(Note: This script requires `dotenv` to work properly. If it fails, check your `.env` file matches your database configuration.)_

## Step 3: Verify Editing Access

1.  Log in as any user.
2.  Navigate to the dashboard and open the finalized will (Status: COMPLETED).
3.  Try to edit a field (e.g., change the Testator Name in Step 1).
4.  **Click Save.**
    - With the bypass key, saving should **succeed**.
    - Without the bypass key (and without Premium subscription), saving should fail.

## Step 4: Verify "My Wills" Access

1.  Navigate to the "My Wills" page (`/dashboard/wills`).
2.  Find the finalized will.
3.  The button should say **EDIT WILL** instead of "VIEW ONLY".
4.  Clicking it should take you to the editor.

## Step 5: Verify Version History

1.  After saving changes to a finalized will (with bypass enabled):
2.  Look for the "History" icon (clock icon) on the Will Card in the dashboard.
3.  Click it to open the Version History dialog.
4.  You should see a new version entry for your changes, with a detailed list of what changed (e.g., "Full Name: Old -> New").
5.  **Verify False Positives:** Ensure that only the fields you actually changed are listed. Unchanged sections (like Address or Executors) should NOT appear if you didn't touch them.

## Step 6: Verify Auto-Save

1.  Open the editor for any will.
2.  Make a change to any field (e.g., change a name).
3.  Look at the top right corner of the header.
4.  You should see **"Saving..."** appear briefly (within 2 seconds), followed by **"Changes Saved"**.
5.  Reload the page to ensure your changes persisted without clicking "Save".

## Troubleshooting

- **Server Restart:** Ensure you restarted the server after adding the env var.
- **Key Mismatch:** Ensure the key in `.env` matches exactly `banyyan-dev-test-2024`.

## Step 6: Verify User Menu

1.  Click on your user avatar in the top right corner.
2.  The dropdown menu should display your name and email.
3.  Next to your name, you should see a badge:
    - **PREMIUM** (Gold/Amber) if you are on the premium tier OR if the bypass key is active.
    - **FREE** (Gray) if you are on the free tier (and bypass is inactive).
