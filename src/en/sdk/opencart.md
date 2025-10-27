# How to Accept Crypto Payments on OpenCart with the DV.net Payment Gateway Extension

Offering cryptocurrency payments can significantly enhance your OpenCart store, attracting a wider audience and providing modern payment flexibility. DV.net offers a robust crypto payment processing solution, and its OpenCart extension simplifies the integration process.
This guide provides a clear, step-by-step walkthrough for installing and configuring the DV.net payment gateway extension on your OpenCart website.

## Prerequisites:

- An active OpenCart website.
- Admin access to your OpenCart dashboard.
- An active DV.net account.

## Step 1: Get the DV.net OpenCart Extension

First, you need to download the extension files. You'll obtain these from the official DV.net GitHub repository.

- Navigate to the official DV.net OpenCart extension repository: https://github.com/dv-net/dv-opencart.
- Go to the Releases page
- Download the `dv-opencart-vX.X.X.ocmod.zip`

## Step 2: Install the Extension on Your OpenCart Site

OpenCart uses an Extension Installer to handle uploads.

- Log in to your OpenCart admin dashboard (e.g., yourdomain.com/admin).
- Navigate to Extensions > Installer from the left-hand menu.
- Click the Upload button.
- Select the .zip file you downloaded in Step 1
- Wait for the upload and installation process to complete. You should see a success message.
- Important: After installation, go to Extensions > Modifications and click the blue Refresh button in the top-right corner to ensure the system recognizes the changes.
- It's also a good idea to clear your theme cache. Go to Dashboard, click the blue Settings cog icon in the top-right, and then click the Refresh buttons for Theme Cache and SASS Cache.

## Step 3: Obtain Your DV.net API Credentials

To connect your store to DV.net, you need your API Key, API Secret, and API URL.

- Log in to your DV.net account dashboard.
- Navigate to the API Keys section (referencing obtaining-api-key-and-secret.md from the documentation files).
- Click "Create New Key".
- Give the key a relevant name (e.g., "OpenCart Store").
- The system will display your API Key and API Secret.
- Critical: Copy both the API Key and API Secret immediately and store them securely (e.g., in a password manager). The secret will not be shown again.
- Note down your API URL, which is the base URL for your DV.net instance (e.g., https://api.your-dv-instance.com).

## Step 4: Configure the DV.net Gateway in OpenCart

Now, configure the payment method within your OpenCart admin panel.

- In your OpenCart dashboard, go to Extensions > Extensions.
- From the dropdown menu labeled "Choose the extension type", select Payments.
- Scroll down the list until you find "DV.net Gateway". Click the green Install (+) button if it's not already installed, and then click the blue Edit (pencil) button.
- This opens the DV.net configuration page. Fill in the following details (based on admin/controller/extension/payment/dv_gateway.php and associated language/template files):
- API URL: Paste the API URL from Step 3.
- API Key: Paste the API Key from Step 3.
- API Secret: Paste the API Secret from Step 3.

## Step 5: Test Your Integration!

- Your DV.net OpenCart integration should now be complete! It's vital to perform a test transaction.
- Visit your OpenCart store's front end.
- Add a product to your cart.
- Proceed through the checkout process.
- When selecting a payment method, choose "DV.net Gateway" (or the title configured, though it's often fixed in OpenCart extensions).
- Confirm the order. You should be redirected to the DV.net payment page.
- Strongly Recommended: Complete a small, real transaction. After successful payment on DV.net, go back to your OpenCart admin panel > Sales > Orders. Verify that the test order's status has automatically updated from your 'Pending' status to your 'Paid' status (e.g., 'Processing' or 'Complete').
If the order status updates correctly without manual intervention, your setup is successful! Customers can now pay using cryptocurrency via DV.net on your OpenCart store.