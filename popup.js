document.addEventListener('DOMContentLoaded', async () => {
  const t = window.TrelloPowerUp.iframe();

  const select = document.getElementById('checklist-select');
  const noteInput = document.getElementById('note');
  const fileInput = document.getElementById('file');
  const saveBtn = document.getElementById('save-btn');

  // Load tất cả checklist items từ card
  async function loadChecklistItems() {
    const card = await t.card('checklists');
    select.innerHTML = '<option value="">-- Chọn --</option>';

    if (card.checklists) {
      card.checklists.forEach(cl => {
        cl.checkItems.forEach(item => {
          const option = document.createElement('option');
          option.value = item.id;
          option.textContent = item.name;
          select.appendChild(option);
        });
      });
    }
  }

  await loadChecklistItems();

  // Khi click nút Lưu
  saveBtn.addEventListener('click', async () => {
    const itemId = select.value;
    if (!itemId) {
      alert('Vui lòng chọn 1 item!');
      return;
    }

    // Lưu ghi chú vào shared storage của card
    const data = await t.get('card', 'shared', 'checklist-data') || {};
    if (!data[itemId]) data[itemId] = { attachments: [], notes: '' };
    data[itemId].notes = noteInput.value;

    // Lưu file (chỉ lưu tên file ở đây, có thể upload thực tế lên server)
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      data[itemId].attachments.push(file.name);
    }

    await t.set('card', 'shared', 'checklist-data', data);

    // Tick checklist item hoàn thành
    await t.checklistItem(itemId, { state: 'complete' });

    alert('Đã lưu thành công!');
    t.closePopup();
  });
});
