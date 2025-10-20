window.TrelloPowerUp.initialize({
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
              url: './popup.html',
              height: 300,
              args: { itemId: item.id, itemName: item.name }
            })
          });
        });
      });
      return badges;
    });
  },
  'card-back-section': function(t) {
    return {
      title: 'Chi tiết Checklist',
      icon: 'https://my-trello-powerup.vercel.app/icon.png', // Thêm icon nếu có
      content: { type: 'iframe', url: t.signUrl('https://my-trello-powerup.vercel.app/button.html'),height: 400 }
    };
  },
  'attachment-sections': function(t) {
    return t.get('card', 'shared', 'checklist-data').then(data => {
      const sections = [];
      if (data) {
        Object.keys(data).forEach(itemId => {
          if (data[itemId].attachments) {
            sections.push({
              title: `File của ${data[itemId].itemName || 'Checklist Item'}`,
              icon: 'https://my-trello-powerup.vercel.app/icon.png',
              content: {
                type: 'iframe',
                url: t.signUrl('./popup.html', { itemId, itemName: data[itemId].itemName }),
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
