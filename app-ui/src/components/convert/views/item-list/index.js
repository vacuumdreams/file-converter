module.exports = {
  name: 'itemList',
  template: 'item-list.html',
  variables: {
    list: {
      type: 'array',
    },
    headers: {
      type: 'array',
    },
    onRemove: {
      type: 'function',
    },
    onAbort: {
      type: 'function',
    },
  },
}
