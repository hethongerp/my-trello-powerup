const t = window.TrelloPowerUp.iframe();

// Bước authorize
t.authorize({
  type: 'popup',
  name: 'Checklist Detail Power-Up',
  scope: { read: true, write: true },
  expiration: 'never',
  success: () => console.log('Authorized')
});

// Lấy thông tin item từ URL
const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get('itemId');
const itemName = urlParams.get('itemName');

document.getElementById('item-info').textContent = itemName || 'Checklist Item';

// Xử lý lưu note và upload file
document.getElementById('save-btn').addEventListener('click', async () => {
  const note = document.getElementById('note').value;
  const attachmentInput = document.getElementById('attachment');
  const file = attachmentInput.files[0];

  const data = await t.get('card', 'shared', 'checklist-data') || {};
  data[itemId] = data[itemId] || {};
  data[itemId].itemName = itemName;
  data[itemId].note = note;
  await t.set('card', 'shared', 'checklist-data', data);

  if (file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);

    const cardId = await t.card('id').then(c => c.id);
    const token = await t.get('member', 'private', 'token'); // token vừa được authorize
    const key = 'a1c195d7df98af678d63113440ce2f49';

    fetch(`https://api.trello.com/1/cards/${cardId}/attachments?key=${key}&token=${token}`, {
      method: 'POST',
      body: formData
    }).then(res => res.json())
      .then(() => t.closePopup())
      .catch(err => {
        console.error('Upload failed', err);
        t.closePopup();
      });
  } else {
    t.closePopup();
  }
});
