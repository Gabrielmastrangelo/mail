// Cmd + Shift + r to clear cache


document.addEventListener('DOMContentLoaded', function() {

  // Create div to display email
  const email_view = document.createElement('div');
  email_view.id = "email-view";
  email_view.classList.add('card');
  document.querySelector(".container").appendChild(email_view); // Add new element to main div

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // Send email on compose page
  document.querySelector('#compose-form').addEventListener('submit', (event) => send_email(event)); 
    
  // By default, load the inbox
  load_mailbox('inbox');
});

function showAlert(message, type="danger") {
  // Create a div element for the alert
  const alertDiv = document.createElement('div');
  
  // Add Bootstrap classes for alert and the alert type (e.g., success, danger)
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.role = 'alert';

    // Set the inner HTML for the alert, including the close button
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  `;
  // Add an event listener to the close button to remove the alertDiv
  alertDiv.querySelector('.close').addEventListener('click', () => {
    alertDiv.remove();
  });

  document.querySelector('#compose-view').prepend(alertDiv);
}

function reply_email(email) {
  // Reply to email
  // Create the subject for the reply email with 'Re: ' prefix
  const replySubject = email.subject.startsWith('Re: ') ? email.subject : 'Re: ' + email.subject;

  // Save the email body on a variable to add to function to pre fill compose email fields
  const replyBody = `\n\n"On ${email.timestamp} ${email.sender} wrote:"\n${email.body}\n`;
  
  compose_email(event=null, recipients=email.sender, subject=replySubject, body=replyBody); // Open the compose email page

  const bodyField = document.querySelector('#compose-body');
  bodyField.focus();
  bodyField.setSelectionRange(0, 0); //Set the cursor position (e.g., position 5)
}
function send_email(event) {
  // Deactivate the standard reload event after submission
  event.preventDefault();

  // Collect the data from form
  const recipients = document.querySelector("#compose-recipients");
  const subject = document.querySelector("#compose-subject");
  const body = document.querySelector("#compose-body");

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients.value,
        subject: subject.value, 
        body: body.value 
    })
  })
  .then(response => {
    if (response.status === 400) {
      return response.json().then(err => {
        throw {message: "Bad request", details: err.error};
      });
    } else if (!response.ok) {
      // Honestly this part I need to test to see if it works!!!!!!!!!!!!!!!!!!!!!
      return response.json().then(err => {
        throw {message: "Server Error", details: err};
      });
    }
    load_mailbox('sent'); 
  })   
  .catch(error => {
    console.log(error);
    showAlert(error.details);
  });
  
}

function compose_email(event=null, recipients='', subject='', body='') {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = recipients;
  document.querySelector('#compose-subject').value = subject;
  document.querySelector('#compose-body').value = body;
}

function changeArchiveStatus(email) {
  // Swap the boolean value for archive
  fetch(`/emails/${email.id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: !email.archived
    })
  })
  .then( () => load_mailbox('inbox')); 
}

function open_email(event) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  const emailDiv =  document.querySelector('#email-view');
  emailDiv.style.display = 'block';

  // Get the email id from div
  emailElementId = event.currentTarget.id;
  emailId = emailElementId.slice(1);

  // Mark email as read
  fetch(`/emails/${emailId}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })

  // Get current user from h2 element
  user = document.querySelector('h2').innerHTML;

  // Get email data from server
  fetch(`/emails/${emailId}`)
  .then(response => response.json())
  .then(email => {
    emailDiv.innerHTML = `
      <div class="card-header">
          <h5>Subject: ${email.subject}</h5>
      </div>
      <div class="card-body">
          <p class="card-text"><strong>Sender:</strong> ${email.sender}</p>
          <p class="card-text"><strong>Recipients:</strong> ${email.recipients}</p>
          <p class="card-text"><strong>Timestamp:</strong> ${email.timestamp}</p>
          <hr>
          <p class="card-text">${email.body}</p>
          <div class="mt-3">
          </div>
      </div>
    `;
    // Create and set reply button
    const replyButton = document.createElement('button');
    replyButton.classList.add('btn', 'btn-primary', 'me-2');
    replyButton.id = "reply-button";
    replyButton.innerHTML = 'Reply';
    replyButton.onclick = () => reply_email(email);

    const buttonContainer = emailDiv.querySelector(".mt-3")
    buttonContainer.appendChild(replyButton);
    if (user !== email.sender) {
      // Create and set up archive button, only for emails that we received.
      const archiveButton = document.createElement('button');
      archiveButton.classList.add('btn', 'btn-secondary');
      archiveButton.id = 'archive-button';
      archiveButton.innerHTML = email.archived ? "Unarchive" : "Archive";
      archiveButton.onclick = () => changeArchiveStatus(email); 
      buttonContainer.appendChild(archiveButton);
    }
  });

}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';

  // Show the mailbox name
  const emailsView = document.querySelector('#emails-view')
  emailsView.innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Get emails from server
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // Print emails
    console.log(emails);
    emails.forEach(email => {
      const emailDiv = document.createElement('div');
      const isRead = email.read ? "background-color: #e0e0e0;": '';
      emailDiv.innerHTML = `
        <div class="d-flex justify-content-between">
          <div><strong>From:</strong>${email.sender}</div>
          <div><small class="text-muted">${email.timestamp}</small></div>
        </div>
        <div><strong>Subject:</strong>${email.subject}</div>`;
      emailDiv.classList.add("email-box", "border", "rounded", "p-3", "mb-3");
      emailDiv.id = 'e' + email.id;
      emailDiv.style.cssText = `${isRead}; cursor: pointer;`;
      emailDiv.addEventListener('click', (event) => open_email(event));
      emailsView.appendChild(emailDiv);
    });

  });
}

