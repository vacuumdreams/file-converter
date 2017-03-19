module.exports = {
  name: 'formButton',
  template: 'form-button.html',
  variables: {
    onSubmit: {
      type: 'function',
    },
    onUpdate: {
      type: 'function',
    },
    disabled: {
      type: 'boolean',
    },
    text: {
      type: 'string',
    }, 
  },
}
