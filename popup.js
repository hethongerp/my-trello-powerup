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

    // Upload files qua server
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`https://my-trello-powerup.vercel.app/api/upload?cardId=${t.getContext().card}`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload thất bại');
      const result = await response.json();
      itemData.attachments.push(result.url);
    }

    itemData.note = note;
    data[args.itemId] = itemData;

    await t.set('card', 'shared', 'checklist-data', data);
    t.notifyParent('update'); // refresh UI
    t.closePopup();
  } catch (error) {
    console.error('Lỗi khi lưu:', error);
    alert('Có lỗi khi lưu, vui lòng thử lại!');
  }
};

loadData();
