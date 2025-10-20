const t = window.TrelloPowerUp.iframe();

// Hiển thị thông tin checklist item
const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get('itemId');
const itemName = urlParams.get('itemName');

document.getElementById('item-info').textContent = itemName || 'Checklist Item';

// Lưu ghi chú và file
document.getElementById('save-btn').addEventListener('click', () => {
  const note = document.getElementById('note').value;
  const attachmentInput = document.getElementById('attachment');
  const attachment = attachmentInput.files[0];

  t.get('card', 'shared', 'checklist-data').then(data => {
    data = data || {};
    data[itemId] = data[itemId] || {};
    data[itemId].itemName = itemName;
    data[itemId].note = note;
    if (attachment) data[itemId].attachments = attachment.name; // Chỉ lưu tên file demo
    return t.set('card', 'shared', 'checklist-data', data);
  }).then(() => {
    t.closePopup();
  });
});
