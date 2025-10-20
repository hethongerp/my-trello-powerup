// popup.js
const t = window.TrelloPowerUp.iframe();

// DOM elements
const select = document.getElementById('checklist-item-select');
const noteInput = document.getElementById('note-input');
const fileInput = document.getElementById('file-input');
const saveButton = document.getElementById('save-button');

// Load checklist items
t.card('checklists').then(card => {
  if (!card.checklists) return;

  card.checklists.forEach(cl => {
    cl.checkItems.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = item.name + (item.state === 'complete' ? ' ✅' : '');
      select.appendChild(option);
    });
  });
});

// Lưu khi bấm nút
saveButton.addEventListener('click', async () => {
  const selectedItemId = select.value;
  if (!selectedItemId) {
    alert('Chọn 1 item!');
    return;
  }

  const note = noteInput.value;

  // Tick checklist item đã chọn
  try {
    await t.checklistItem('idCard', selectedItemId, 'complete');
  } catch (err) {
    console.log('Không thể tick item:', err);
  }

  // Lưu ghi chú và file vào shared storage
  const data = (await t.get('card', 'shared', 'checklist-data')) || {};
  if (!data[selectedItemId]) data[selectedItemId] = {};
  data[selectedItemId].note = note;
  if (fileInput.files.length) {
    // Lưu tên file (thực tế upload sẽ cần server)
    data[selectedItemId].attachments = fileInput.files[0].name;
  }

  await t.set('card', 'shared', 'checklist-data', data);

  // Đóng popup
  t.closePopup();
});
