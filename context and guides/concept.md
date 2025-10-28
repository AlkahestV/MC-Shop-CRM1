A simple and easy to use CRM for a motorcycle shop.

The SaaS project will be deployed through Vercel and the Backend record keeping will be Supabase

What value does it bring to the shop?
1. It allows the shop to keep a comprehensive record of the motorcycles of every customer.
2. It gives the shop data on specific motorcycle/customer needs based on past data from other owners and allows them to see trends


What is the user experience like for shop staff who will be using this CRM?
1. They login to a simple center dashboard that gives them the option to access specific areas of the CRM. For now the only available feature will be the customer management area, (A feature like Inventory will be coming later)
2. When the shop staff go into the customer management area they can press a "create Job" button or a "New Customer" Button, or a "Profiles" Button, 

3. By pressing the New Customer button they open a UI that allows them to add a new customer to the database. They can add First name, last name, middle initial, address, phone number, and email. Then they will proceed to "add unit". Many people own multiple motorcycles so we give them the ability to add as many units under a persons name as possible.

4. In the add unit UI. They can simply enter the motorcycles brand, model, year, and plate number. Adding a new profile is as simple as that. Middle initial is optional but everything else is required and the customer must have at least one motorcycle unit.

5. In the Create Job button the first thing they see is the selection of a customer. In a clean looking box they can type out the name of the customer and a simple dropdown box will appear as they type that will give them all the possible matches and as the staff type out the name more the dropdown box continously narrows down the option. If there are no results the dropdown will instead show "New Customer" and they will then be redirected to the new customer page.

6. Once they have selected a customer. Another field will appear called "unit" and they will be able to select the customers unit from a dropdown list if they have multiple units. But if they don't then as the field appears it will automatically select the single unit the customer has.

7. Now the UI populates even more. They will then be able to fill out a Job field which is what the customer wants done on their motorcycle. The staff can add multiple entries in this field

8. They can enter the date, the duration of the work and any products that were used for the Job. There will also be a remarks field. After filling all this out they can the click the save button.

9. In the profiles button the staff opens the UI to search for a customer. Once they find the customer the UI opens up to show the customers data and history of jobs. There will also be a button to "Edit Profile".

Jobs that are saved cannot be edited or deleted by the staff. Only Admins are able to do this.