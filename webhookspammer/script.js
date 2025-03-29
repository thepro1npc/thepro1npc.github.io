let webhookIntervals = {};

document.getElementById('webhook-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const url = document.getElementById('webhook-url').value;
    const username = document.getElementById('webhook-username').value || 'Webhook';
    const avatar = document.getElementById('webhook-avatar').value;
    const message = document.getElementById('webhook-message').value;

    if (url && message) {
        addWebhook(url, username, avatar, message);
        document.getElementById('webhook-url').value = '';
        document.getElementById('webhook-username').value = '';
        document.getElementById('webhook-avatar').value = '';
        document.getElementById('webhook-message').value = '';
    }
});

function addWebhook(url, username, avatar, message) {
    const webhookList = document.getElementById('webhook-list');
    const webhookItem = document.createElement('div');
    webhookItem.className = 'webhook-item';
    webhookItem.innerHTML = `
        <div>
            <h3>Webhook URL:</h3>
            <p>${url}</p>
            <h3>Username:</h3>
            <p>${username}</p>
            <h3>Profile Picture:</h3>
            <p>${avatar}</p>
            <h3>Message:</h3>
            <p>${message}</p>
        </div>
        <div>
            <button class="toggle start-spam" onclick="toggleSpam('${url}', '${username}', '${avatar}', '${message}', this)">Start Spam</button>
            <button class="delete" onclick="deleteWebhook(this)">X</button>
        </div>
    `;
    webhookList.appendChild(webhookItem);
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    setTimeout(() => {
        notification.className = 'notification hide';
    }, 5000);
}

function toggleSpam(url, username, avatar, message, element) {
    if (element.classList.contains('active')) {
        clearInterval(webhookIntervals[url]);
        delete webhookIntervals[url];
        element.classList.remove('active');
        element.textContent = 'Start Spam';
        element.classList.replace('stop-spam', 'start-spam');
        showNotification('Webhook spam stopped.', 'info');
    } else {
        function sendWebhook() {
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: message,
                    username: username,
                    avatar_url: avatar
                }),
            })
            .then(response => {
                if (response.status === 429) {
                    showNotification('Rate Limited - Retrying...', 'warning');
                    setTimeout(sendWebhook, 1000);
                }
            })
            .catch(error => {
                showNotification('Webhook has been deleted or error occurred', 'error');
                clearInterval(webhookIntervals[url]);
                delete webhookIntervals[url];
                element.classList.remove('active');
                element.textContent = 'Start Spam';
                element.classList.replace('stop-spam', 'start-spam');
            });
        }

        webhookIntervals[url] = setInterval(sendWebhook, 100);
        element.classList.add('active');
        element.textContent = 'Stop Spam';
        element.classList.replace('start-spam', 'stop-spam');
        showNotification('Webhook spam started.', 'info');
    }
}

function deleteWebhook(button) {
    const webhookItem = button.closest('.webhook-item');
    if (webhookItem) {
        const url = webhookItem.querySelector('p').textContent;
        clearInterval(webhookIntervals[url]);
        delete webhookIntervals[url];
        webhookItem.remove();
        showNotification('Webhook removed.', 'info');
    }
}

document.getElementById('toggle-theme').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});
