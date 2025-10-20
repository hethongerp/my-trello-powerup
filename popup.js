document.addEventListener('DOMContentLoaded', async () => {
  const t = window.TrelloPowerUp.iframe();

  // Lấy card hiện tại cùng checklist
  const card = await t.card('id,checklists');
  const select = document.getElementById('checklist-item-select');

  const checklists = card.checklists || [];
  checklists.forEach(cl => {
    cl.checkItems.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = item.name;
      select.appendChild(option);
    });
  });

  // Xử lý nút lưu
  document.getElementById('save-btn').addEventListener('click', async () => {
    const selectedItemId = select.value;
    const note = document.getElementById('note').value;
    const fileInput = document.getElementById('file').files[0];

    if (!selectedItemId) return alert('Chọn 1 item');

    // Lưu ghi chú vào shared data của card
    const data = await t.get('card', 'shared', 'checklist-data') || {};
    data[selectedItemId] = data[selectedItemId] || {};
    data[selectedItemId].note = note;

    // Nếu có file, lưu metadata (hoặc upload API Trello)
    if (fileInput) {
      data[selectedItemId].fileName = fileInput.name;
      // Tải file lên Trello attachment nếu muốn
      // const formData = new FormData();
      // formData.append('file', fileInput);
      // await t.put(`/cards/${card.id}/attachments`, formData);
    }

    await t.set('card', 'shared', 'checklist-data', data);

    // Tick hoàn thành item
    await t.put(`/cards/${card.id}/checkItem/${selectedItemId}`, { state: 'complete' });

    t.closePopup();
  });
});
