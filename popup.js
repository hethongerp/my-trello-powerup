const t = window.TrelloPowerUp.iframe();
const args = t.arg('itemId', 'itemName');

document.getElementById('title').innerText = '✏️ ' + args.itemName;

async function loadData() {
  const data = await t.get('card', 'shared', 'checklist-data') || {};
  const itemData = data[args.itemId] || { note: '', attachments: [] };
  document.getElementById('note').value = itemData.note || '';

  const attachmentsEl = document.getElementById('attachments');
  attachmentsEl.innerHTML = '';
  if (itemData.attachments) {
    itemData.attachments.forEach(url => {
      if (url.endsWith('.pdf')) {
        const link = document.createElement('a');
        link.href = url;
        link.innerText = 'Xem PDF';
        link.target = '_blank';
        attachmentsEl.appendChild(link);
      } else {
        const img = document.createElement('img');
        img.src = url;
        attachmentsEl.appendChild(img);
      }
    });
  }
}

document.getElementById('save').onclick = async () => {
  try {
    const note = document.getElementById('note').value;
    const files = document.getElementById('file-upload').files;
    const data = await t.get('card', 'shared', 'checklist-data') || {};
    const itemData = data[args.itemId] || { note: '', attachments: [], itemName: args.itemName };

    // Upload files (simplified, Trello may need API key/token)
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = function(e) {
        itemData.attachments.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }

    itemData.note = note;
    data[args.itemId] = itemData;
    await t.set('card', 'shared', 'checklist-data', data);
    t.notifyParent('update');
    t.closePopup();
  } catch (error) {
    console.error('Error saving data:', error);
    alert('Lỗi khi lưu, vui lòng thử lại!');
  }
};

loadData();
