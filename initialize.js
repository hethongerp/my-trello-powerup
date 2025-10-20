window.TrelloPowerUp.initialize({
  'card-detail-badges': function(t) {
    return t.card('checklists[id,name,checkItems[id,name,state]]').then(card => {
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

  'card-back-section': function(t) {
    // Hiển thị danh sách checkItems ngay trong card-back
    return t.card('checklists[id,name,checkItems[id,name,state]]').then(card => {
      let html = '<div style="padding:5px;">';
      if (card.checklists && card.checklists.length) {
        card.checklists.forEach(cl => {
          html += `<b>${cl.name}</b><ul>`;
          cl.checkItems.forEach(item => {
            html += `<li>${item.state === 'complete' ? '✅' : '⬜'} 
                      <a href="#" onclick="window.TrelloPowerUp.iframe().popup({
                        title:'Chi tiết: ${item.name}',
                        url:'https://my-trello-powerup.vercel.app/popup.html?itemId=${item.id}&itemName=${encodeURIComponent(item.name)}',
                        height:300
                      })">${item.name}</a></li>`;
          });
          html += '</ul>';
        });
      } else {
        html += 'Card chưa có checklist.';
      }
      html += '</div>';

      return {
        title: 'Chi tiết Checklist',
        icon: 'https://cdn-icons-png.flaticon.com/512/2910/2910768.png', // Cần icon hợp lệ
        content: {
          type: 'iframe',
          url: t.signUrl('data:text/html,' + encodeURIComponent(html)),
          height: 300
        }
      };
    });
  },

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

  'on-enable': function(t, options) {
    console.log('Power-Up đã được bật trên board:', options.board);
  }
});
