document.addEventListener('DOMContentLoaded', async () => {
  const t = window.TrelloPowerUp.iframe();

  const dropdown = document.getElementById('checklist-dropdown');
  const noteInput = document.getElementById('note');
  const fileInput = document.getElementById('file-input');
  const saveBtn = document.getElementById('save-btn');

  try {
    // Lấy card đầy đủ với checklists và checkItems
    const card = await t.card('checklists');

    if (card.checklists && card.checklists.length) {
      card.checklists.forEach(cl => {
        cl.checkItems.forEach(item => {
          const option = document.createElement('option');
          option.value = item.id;
          option.textContent = item.name;
          dropdown.appendChild(option);
        });
      });
    } else {
      const option = document.createElement('option');
      option.textContent = '-- Không có checklist --';
      dropdown.appendChild(option);
    }
  } catch (err) {
    console.error('Không thể lấy checklist:', err);
  }

  // Xử lý nút lưu
  saveBtn.addEventListener('click', async () => {
    const selectedItemId = dropdown.value;
    const note = noteInput.value;

    if (!selectedItemId || selectedItemId === '-- Chọn --') {
      alert('Chọn 1 item!');
      return;
    }

    try {
      // Lưu ghi chú và file (chỉ lưu metadata file)
      const data = (await t.get('card', 'shared', 'checklist-data')) || {};
      data[selectedItemId] = {
        note,
        attachments: fileInput.files.length ? Array.from(fileInput.files).map(f => f.name) : []
      };
      await t.set('card', 'shared', 'checklist-data', data);

      // Tick hoàn thành checklist item
      await t.checklistItem('checkItem', selectedItemId, true);

      t.closePopup();
    } catch (err) {
      console.error('Lỗi khi lưu:', err);
      alert('Lưu thất bại. Kiểm tra console.');
    }
  });
});
