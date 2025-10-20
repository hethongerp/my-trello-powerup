const t = window.TrelloPowerUp.iframe();

const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get('itemId');
const itemName = urlParams.get('itemName');

document.getElementById('item-info').textContent = itemName || 'Checklist Item';

document.getElementById('save-btn').addEventListener('click', async () => {
  const note = document.getElementById('note').value;
  const attachmentInput = document.getElementById('attachment');
  const file = attachmentInput.files[0];

  // Lưu ghi chú vào card shared data
  const data = await t.get('card', 'shared', 'checklist-data') || {};
  data[itemId] = data[itemId] || {};
  data[itemId].itemName = itemName;
  data[itemId].note = note;

  await t.set('card', 'shared', 'checklist-data', data);

  // Nếu có file, upload vào Trello
  if (file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);

    const cardId = await t.card('id').then(c => c.id);
    const token = await t.get('member', 'private', 'token'); // token được lưu khi authorize
    const key = 'a1c195d7df98af678d63113440ce2f49'; // Thay bằng API key của bạn

    fetch(`https://api.trello.com/1/cards/${cardId}/attachments?key=${key}&token=${token}`, {
      method: 'POST',
      body: formData
    }).then(res => res.json())
      .then(attachment => {
        console.log('Uploaded attachment', attachment);
        t.closePopup();
      })
      .catch(err => {
        console.error('Upload failed', err);
        t.closePopup();
      });
  } else {
    t.closePopup();
  }
});
