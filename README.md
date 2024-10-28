# Email Client Project

This project is a single-page email client built using Django, JavaScript, HTML, and CSS. It enables users to register, log in, compose, send, read, and organize emails into an Inbox, Sent mailbox, and Archive. Emails are stored in a database, with the app functioning as a web-based client, but emails are not sent to real servers.

## Table of Contents
- [Getting Started](#getting-started)
- [Features](#features)
- [API Routes](#api-routes)
- [Project Structure](#project-structure)
- [Specifications](#specifications)
- [License](#license)

---

### Getting Started
1. Download the distribution code from [this link](https://cdn.cs50.net/web/2020/spring/projects/3/mail.zip).
2. Unzip the file and navigate to the `mail` directory in your terminal.
3. Run the following commands to set up the database:
   ```bash
   python manage.py makemigrations mail
   python manage.py migrate
   ```
4. Start the server:
   ```bash
   python manage.py runserver
   ```
5. Open the web application in your browser, and use the “Register” link to create a new account. You may use any email address and password for this project.

---

### Features
- **Compose and Send Email**: Users can compose and send emails to other registered users.
- **Mailbox Navigation**: Users can switch between Inbox, Sent, and Archived mailboxes.
- **Email Viewing**: Emails are displayed in a user-friendly layout, with unread emails highlighted.
- **Archiving and Unarchiving**: Users can move emails to and from the Archive.
- **Single-Page Interface**: The interface updates dynamically using JavaScript, with no need for page reloads.

---

### API Routes
This project uses the following API routes for email operations:

- **`GET /emails/<mailbox>`**: Retrieve all emails in the specified mailbox (Inbox, Sent, or Archive).
- **`GET /emails/<email_id>`**: Retrieve details of a specific email by `email_id`.
- **`POST /emails`**: Send a new email. Requires `recipients`, `subject`, and `body` in JSON format.
- **`PUT /emails/<email_id>`**: Update an email's `read` or `archived` status.

---

### Project Structure
- **`mail` directory**: Contains the Django app with configuration and logic for the email client.
- **`templates`**: HTML files for the user interface.
- **`static`**: JavaScript and CSS files, including `inbox.js`, where most of the dynamic behavior is defined.
- **`urls.py`**: Defines URL routes for the application.
- **`views.py`**: Handles the backend logic and data processing.

---

### Specifications
To complete the project, fulfill these requirements:

1. **Send Mail**: Submit the email composition form to send an email using a POST request to `/emails`.
2. **Mailbox**: Load the specified mailbox (Inbox, Sent, or Archive) when the user selects it.
   - Render each email with its sender, subject, and timestamp.
   - Display unread emails with a white background.
3. **View Email**: Clicking on an email should display its details and mark it as read.
4. **Archive and Unarchive**: Users can archive emails from the Inbox and unarchive from the Archive.
5. **Reply**: Users can reply to an email, pre-filling the recipient, subject, and body in the composition form.

---

### License
This project is provided for learning and development purposes.
