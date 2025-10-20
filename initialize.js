window.TrelloPowerUp.initialize({

  // Nút trong card để mở popup chi tiết checklist
  'card-buttons': function(t) {
    return [{
      text: 'Chi tiết Checklist',
      icon: 'https://cdn-icons-png.flaticon.com/512/61/61456.png', // icon tùy chỉnh
      callback: function(t) {
        return t.popup({
          title: 'Chi tiết Checklist',
          url: t.signUrl('https://my-trello-powerup.vercel.app/popup.html'),
          height: 400
        });
      }
    }];
  },

  // Badge hiển thị tên các mục checklist trên card
  'card-detail-badges': function(t) {
    return t.card('checklists').then(card => {
      const badges = [];
      if (!card.checklists) return badges;

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

  // Section hiển thị attachment nếu đã lưu trên checklist
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

  // Card back section hiển thị nút mở chi tiết checklist
  'card-back-section': function(t) {
    return {
      title: 'Chi tiết Checklist',
      icon: 'https://cdn-icons-png.flaticon.com/512/61/61456.png',
      content: {
        type: 'iframe',
        url: t.signUrl('https://my-trello-powerup.vercel.app/button.html'),
        height: 400
      }
    };
  },

  // Khi bật Power-Up
  'on-enable': function(t) {
    console.log('Power-Up đã được bật trên board:', t.board());
    return Promise.resolve();
  }
});
