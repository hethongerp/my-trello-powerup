window.TrelloPowerUp.initialize({

  // Khi bật Power-Up
  'on-enable': function(t, options){
    console.log('Power-Up đã được bật trên board', t.board());
    return t.set('board', 'private', 'powerup-enabled', true);
  },

  // Badge cho từng checklist item
  'card-detail-badges': function(t) {
    return t.card('checklists').then(card => {
      const badges = [];
      if (!card.checklists || !card.checklists.length) return badges;

      card.checklists.forEach(cl => {
        if(!cl.checkItems) return;
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

  // Section hiển thị trong card-back
  'card-back-section': function(t) {
    return {
      title: 'Chi tiết Checklist',
      icon: 'https://my-trello-powerup.vercel.app/icon.png',
      content: {
        type: 'iframe',
        url: t.signUrl('https://my-trello-powerup.vercel.app/button.html'),
        height: 400
      }
    };
  },

  // Section attachment
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

  // Nút trên card
  'card-buttons': function(t) {
    return [{
      icon: 'https://my-trello-powerup.vercel.app/icon.png',
      text: 'Checklist Details',
      callback: t => t.popup({
        title: 'Chi tiết Checklist',
        url: t.signUrl('https://my-trello-powerup.vercel.app/button.html'),
        height: 400
      })
    }];
  },

  // Nút trên board
  'board-buttons': function(t) {
    return [{
      icon: 'https://my-trello-powerup.vercel.app/icon.png',
      text: 'Board Checklist',
      callback: t => t.popup({
        title: 'Tổng quan Checklist',
        url: t.signUrl('https://my-trello-powerup.vercel.app/board.html'),
        height: 500
      })
    }];
  }

});
