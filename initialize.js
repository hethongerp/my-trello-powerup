window.TrelloPowerUp.initialize({

  // 🔹 Khi bật Power-Up
  'on-enable': function(t){
    console.log('Power-Up enabled on this board');
    return t.set('board','private','initialized', true);
  },

  // 🔹 Card badges
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

  // 🔹 Card back section
  'card-back-section': function(t){
    return {
      title: 'Chi tiết Checklist',
      icon: 'https://my-trello-powerup.vercel.app/icon.png', // bắt buộc icon hợp lệ
      content: {
        type: 'iframe',
        url: t.signUrl('https://my-trello-powerup.vercel.app/button.html'),
        height: 400
      }
    };
  },

  // 🔹 Attachment sections
  'attachment-sections': function(t) {
    return t.get('card', 'shared', 'checklist-data').then(data => {
      const sections = [];
      if(data){
        Object.keys(data).forEach(itemId => {
          if(data[itemId].attachments){
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

  // 🔹 Card buttons
  'card-buttons': function(t){
    return [{
      text: 'Open Checklist Popup',
      callback: t => t.popup({
        title: 'Checklist',
        url: t.signUrl('https://my-trello-powerup.vercel.app/popup.html'),
        height: 300
      })
    }];
  },

  // 🔹 Board buttons
  'board-buttons': function(t){
    return [{
      text: 'Board Checklist Info',
      callback: t => t.popup({
        title: 'Board Info',
        url: t.signUrl('https://my-trello-powerup.vercel.app/popup.html'),
        height: 200
      })
    }];
  }

});
