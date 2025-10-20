window.TrelloPowerUp.initialize({

  // Khi Power-Up được bật trên board
  'on-enable': function(t) {
    console.log('Power-Up đã được bật trên board:', t.getContext().board);
    return t.set('board', 'shared', 'enabled', true);
  },

  // Badge hiển thị trên card cho từng checklist item
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

  // Phần nút / iframe hiển thị trên mặt sau của card
  'card-back-section': function(t) {
    return {
      title: 'Chi tiết Checklist',
      content: {
        type: 'iframe',
        url: t.signUrl('https://my-trello-powerup.vercel.app/button.html'),
        height: 400
      }
    };
  },

  // Section hiển thị file đính kèm từ checklist item
  'attachment-sections': function(t) {
    return t.get('card', 'shared', 'checklist-data').then(data => {
      const sections = [];
      if (data) {
        Object.keys(data).forEach(itemId => {
          if (data[itemId].attachments && data[itemId].attachments.length) {
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
  }

});
