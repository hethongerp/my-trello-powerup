const t = window.TrelloPowerUp.iframe();
const itemsContainer = document.getElementById('items');
let selectedItemId = null;

// Lấy danh sách checklist item trực tiếp từ card
t.card('checklists[id,name,checkItems[id,name,state]]').then(card => {
  const itemsContainer = document.getElementById('items');
  if (!card.checklists || !card.checklists.length) {
    itemsContainer.textContent = 'Card này chưa có checklist.';
    return;
  }

  card.checklists.forEach(cl => {
    if (!cl.checkItems) return;
    cl.checkItems.forEach(item => {
      const div = document.createElement('div');
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'selectedItem';
      radio.value = item.id;

      radio.addEventListener('change', () => {
        selectedItemId = item.id;
        loadExistingData(item.id);
      });

      div.appendChild(radio);
      div.appendChild(document.createTextNode(` ${cl.name} - ${item.name}`));
      itemsContainer.appendChild(div);
    });
  });
});


// Load dữ liệu cũ (ghi chú + file) nếu có
function loadExistingData(itemId) {
  t.get('card', 'shared', 'checklist-data').then(data => {
    if (data && data[itemId]) {
      document.getElementById('note').value = data[itemId].note || '';
      const attachDiv = document.getElementById('existing-attachments');
      if (attachDiv) attachDiv.remove();

      if (data[itemId].attachments?.length) {
        const div = document.createElement('div');
        div.id = 'existing-attachments';
        div.className = 'attachment';
        div.textContent = 'Đã đính kèm: ' + data[itemId].attachments.join(', ');
        document.body.insertBefore(div, document.getElementById('file'));
      }
    } else {
      document.getElementById('note').value = '';
      const attachDiv = document.getElementById('existing-attachments');
      if (attachDiv) attachDiv.remove();
    }
  });
}

// Lưu dữ liệu + tick item
document.getElementById('save').addEventListener('click', async () => {
  if (!selectedItemId) return alert('Chọn 1 checklist item!');

  const note = document.getElementById('note').value;
  const fileInput = document.getElementById('file');
  const fileName = fileInput.files[0]?.name || null;

  let data = await t.get('card', 'shared', 'checklist-data');
  data = data || {};
  data[selectedItemId] = data[selectedItemId] || { attachments: [] };
  data[selectedItemId].note = note;
  if (fileName) data[selectedItemId].attachments.push(fileName);

  await t.set('card', 'shared', 'checklist-data', data);

  // tick item
  const card = await t.card('checklists');
  for (const cl of card.checklists) {
    const item = cl.checkItems.find(i => i.id === selectedItemId);
    if (item && item.state !== 'complete') {
      await t.setCheckItemState(item.id, 'complete');
    }
  }

  t.closePopup();
});
