// popup.js
document.addEventListener('DOMContentLoaded', async () => {
  const dropdown = document.createElement('select');
  dropdown.id = 'checklist-items';
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = '-- Chọn --';
  dropdown.appendChild(defaultOption);

  const noteInput = document.createElement('textarea');
  noteInput.id = 'note';
  noteInput.placeholder = 'Ghi chú...';

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.id = 'attachment';

  const saveButton = document.createElement('button');
  saveButton.textContent = 'Lưu';

  const container = document.getElementById('checklist-container');
  container.appendChild(dropdown);
  container.appendChild(document.createElement('br'));
  container.appendChild(noteInput);
  container.appendChild(document.createElement('br'));
  container.appendChild(fileInput);
  container.appendChild(document.createElement('br'));
  container.appendChild(saveButton);

  try {
    // Lấy card với checklists
    const t = window.TrelloPowerUp.iframe();
    const card = await t.card('checklists');
    const checklists = card.checklists || [];

    // Nạp các checklist items vào dropdown
    checklists.forEach(cl => {
      cl.checkItems?.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        dropdown.appendChild(option);
      });
    });

    // Xử lý lưu
    saveButton.addEventListener('click', async () => {
      const selectedId = dropdown.value;
      if (!selectedId) {
        alert('Vui lòng chọn 1 item.');
        return;
      }

      // Thêm ghi chú
      const note = noteInput.value;
      if (note) {
        await t.set('card', 'shared', `checklist-note-${selectedId}`, note);
      }

      // Tick item hoàn thành
      for (const cl of checklists) {
        const item = cl.checkItems.find(i => i.id === selectedId);
        if (item && item.state !== 'complete') {
          await t.checklistItem(cl.id, item.id, { state: 'complete' });
        }
      }

      // File đính kèm (tạm lưu file name)
      const file = fileInput.files[0];
      if (file) {
        await t.set('card', 'shared', `checklist-attachment-${selectedId}`, file.name);
      }

      alert('Đã lưu!');
    });
  } catch (err) {
    console.error('Không thể lấy checklist:', err);
    const msg = document.createElement('p');
    msg.textContent = 'Không thể lấy checklist.';
    container.appendChild(msg);
  }
});
