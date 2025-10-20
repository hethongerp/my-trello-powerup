// popup.js
document.addEventListener('DOMContentLoaded', async () => {
const t = window.TrelloPowerUp.iframe();

const selectEl = document.getElementById('checklist-select');
const noteEl = document.getElementById('note');
const fileEl = document.getElementById('file');
const saveBtn = document.getElementById('save-btn');
const statusEl = document.getElementById('status');

// Lấy card với checklists và checkItems
t.card('checklists[id,name,checkItems[id,name,state]]')
  .then(card => {
    if (!card.checklists) return;

    card.checklists.forEach(cl => {
      cl.checkItems.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${cl.name} → ${item.name} [${item.state}]`;
        selectEl.appendChild(option);
      });
    });
  });

// Xử lý nút Lưu
saveBtn.addEventListener('click', () => {
  const itemId = selectEl.value;
  const note = noteEl.value.trim();
  const file = fileEl.files[0];

  if (!itemId) {
    alert('Chọn 1 item!');
    return;
  }

  // Lưu ghi chú
  if (note) {
    t.get('card', 'shared', 'checklist-data').then(data => {
      data = data || {};
      data[itemId] = data[itemId] || {};
      data[itemId].note = note;

      t.set('card', 'shared', 'checklist-data', data);
    });
  }

  // Đính kèm file (chỉ gửi URL giả, Trello API không cho upload trực tiếp)
  if (file) {
    t.card('id').then(card => {
      const reader = new FileReader();
      reader.onload = function(e) {
        const content = e.target.result;
        t.attach({
          name: file.name,
          mimeType: file.type,
          url: 'data:' + file.type + ';base64,' + btoa(content)
        });
      };
      reader.readAsBinaryString(file);
    });
  }

  // Tick hoàn thành
  t.card('checklists').then(card => {
    card.checklists.forEach(cl => {
      cl.checkItems.forEach(item => {
        if (item.id === itemId && item.state !== 'complete') {
          t.setCheckItemState(itemId, 'complete');
        }
      });
    });
  });

  statusEl.textContent = 'Đã lưu ✅';
});
});
