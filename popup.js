// popup.js
document.addEventListener('DOMContentLoaded', async () => {
  const t = TrelloPowerUp.iframe();

  const selectEl = document.getElementById('checklist-select');
  const noteEl = document.getElementById('note');
  const fileEl = document.getElementById('file');
  const saveBtn = document.getElementById('save-btn');

  try {
    // Lấy danh sách checklist items từ card
    const card = await t.card('checklists[id,name,checkItems[id,name,state,pos]]');
    const checklists = card.checklists || [];

    checklists.forEach(cl => {
      cl.checkItems.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${cl.name} → ${item.name} [${item.state}]`;
        selectEl.appendChild(option);
      });
    });
  } catch (err) {
    console.error('Lỗi khi load checklist items:', err);
  }

  saveBtn.addEventListener('click', async () => {
    const itemId = selectEl.value;
    const note = noteEl.value;
    const file = fileEl.files[0];

    if (!itemId) {
      alert('Vui lòng chọn 1 checklist item.');
      return;
    }

    try {
      // Tick hoàn thành item đã chọn
      await t.checklistItemToggle(itemId);

      // Lưu dữ liệu vào shared card
      const sharedData = await t.get('card', 'shared', 'checklist-data') || {};
      sharedData[itemId] = sharedData[itemId] || {};
      sharedData[itemId].itemName = selectEl.selectedOptions[0].textContent;
      sharedData[itemId].note = note;

      // Nếu có file, lưu tên file (thực tế upload file sẽ cần API khác)
      if (file) {
        sharedData[itemId].attachments = sharedData[itemId].attachments || [];
        sharedData[itemId].attachments.push(file.name);
      }

      await t.set('card', 'shared', 'checklist-data', sharedData);

      t.closePopup();
      alert('Đã lưu và tick hoàn thành!');
    } catch (err) {
      console.error('Lỗi khi lưu data:', err);
      alert('Có lỗi xảy ra, xem console để biết chi tiết.');
    }
  });
});
