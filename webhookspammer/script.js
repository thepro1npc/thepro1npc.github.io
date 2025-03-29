let webhookIntervals = {};
let webhookUrl = '';
let username = 'Webhook';
let avatar = '';
let message = '';

document.getElementById('webhook-form').addEventListener('submit', function(event) {
    event.preventDefault();
    webhookUrl = document.getElementById('webhook-url').value;
    if (webhookUrl) {
        showPage('post-page');
        updatePreview();
    }
});

document.getElementById('webhook-message').addEventListener('input', function() {
    message = this.value;
    updatePreview();
});

function updatePreview() {
    document.getElementById('preview-message').textContent = `Message: ${message || 'No message'}`;
    document.getElementById('preview-username').textContent = `Username: ${username}`;
    document.getElementById('preview-webhook-url').textContent = `Webhook URL: ${webhookUrl}`;
}

function toggleSpam() {
    const startButton = document.getElementById('start-spam');
    const stopButton = document.getElementById('stop-spam');

    if (startButton.style.display !== 'none') {
        startButton.style.display = 'none';
        stopButton.style.display = 'inline-block';

        function sendWebhook() {
            fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: message, username: username, avatar_url: avatar })
            })
            .then(response => {
                if (response.status === 429) {
                    showNotification('Rate Limited - Retrying...', 'warning');
                    setTimeout(sendWebhook, 1000);
                }
            })
            .catch(error => {
                showNotification('Error occurred', 'error');
                stopSpam();
            });
        }

        webhookIntervals[webhookUrl] = setInterval(sendWebhook, 100);
        showNotification('Webhook spam started.', 'info');
    }
}

function stopSpam() {
    clearInterval(webhookIntervals[webhookUrl]);
    delete webhookIntervals[webhookUrl];
    document.getElementById('start-spam').style.display = 'inline-block';
    document.getElementById('stop-spam').style.display = 'none';
    showNotification('Webhook spam stopped.', 'info');
}

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    setTimeout(() => {
        notification.className = 'notification hide';
    }, 5000);
}
