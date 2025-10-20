window.TrelloPowerUp.initialize({
  // Nút trên card để mở popup chi tiết
  'card-buttons': function(t) {
    return [{
      text: 'Chi tiết Checklist',
      callback: t => t.popup({
        title: 'Chi tiết Checklist',
        url: t.signUrl('https://my-trello-powerup.vercel.app/popup.html'),
        height: 400
      })
    }];
  },

  // Hiển thị trực tiếp danh sách checklists ở phần back của card
  'card-back-section': function(t) {
    return t.card('checklists').then(card => {
      let contentHtml = '<div>';
      if (card.checklists && card.checklists.length) {
        card.checklists.forEach(cl => {
          contentHtml += `<h4>${cl.name}</h4><ul>`;
          cl.checkItems.forEach(item => {
            contentHtml += `<li>${item.name} - ${item.state}</li>`;
          });
          contentHtml += '</ul>';
        });
      } else {
        contentHtml += '<p>Không có checklist nào.</p>';
      }
      contentHtml += '</div>';

      return {
        title: 'Chi tiết Checklist',
        icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828817.png', // icon hợp lệ để Trello không báo lỗi
        content: {
          type: 'iframe',
          url: 'data:text/html;charset=utf-8,' + encodeURIComponent(`
            <!DOCTYPE html>
            <html lang="vi">
            <head><meta charset="UTF-8"><title>Checklist</title></head>
            <body>${contentHtml}</body>
            </html>
          `),
          height: 200
        }
      };
    });
  },

  // Hiển thị các file đính kèm của checklist item
  'attachment-sections': function(t) {
    return t.get('card', 'shared', 'checklist-data').then(data => {
      const sections = [];
      if (data) {
        Object.keys(data).forEach(itemId => {
          if (data[itemId].attachments) {
            sections.push({
              title: `File của ${data[itemId].itemName || 'Checklist Item'}`,
              content: {
                type: 'iframe',
                url: t.signUrl('https://my-trello-powerup.vercel.app/popup.html', {
                  itemId,
                  itemName: data[itemId].itemName
                }),
                height: 200
              }
            });
          }
        });
      }
      return sections;
    });
  },

  // Badge trên card
  'card-detail-badges': function(t) {
    return t.card('checklists').then(card => {
      const badges = [];
      if (!card.checklists || !card.checklists.length) return badges;

      card.checklists.forEach(cl => {
        cl.checkItems.forEach(item => {
          badges.push({
            text: `📝 ${item.name}`,
            callback: t => t.popup({
              title: `Chi tiết: ${item.name}`,
              url: t.signUrl('https://my-trello-powerup.vercel.app/popup.html', {
                itemId: item.id,
                itemName: item.name
              }),
              height: 300
            })
          });
        });
      });
      return badges;
    });
  },

  // Khi bật Power-Up trên board
  'on-enable': function(t, options) {
    console.log('Power-Up đã được bật trên board:', options.board.id);
    return Promise.resolve();
  }
});
