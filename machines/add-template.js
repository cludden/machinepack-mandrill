module.exports = {

  identity: 'add-template',
  friendlyName: 'Add template',
  description: 'Add a new email template to a Mandrill account.',
  cacheable: false,

  inputs: {
    apiKey: {
      example: '1dTOFDXzJdU5cXiMNd6jRq',
      required: true
    },
    name: {
      example: 'reset-your-password',
      required: true
    },
    from_email: {
      example: 'harold@foo.enterprise'
    },
    from_name: {
      example: 'Harold Greaseworthy'
    },
    subject: {
      example: 'Click the link in this email to reset your password'
    },
    code: {
      description: 'HTML body of the message',
      example: '<div>Click <a href="*|RESET_LINK|*">here</a> to reset your password.</div>'
    },
    text: {
      example: 'Click on the following link to reset your password: \n *|RESET_LINK|*'
    },
    publish: {
      example: true
    },
    labels: {
      example: ['password']
    }
  },

  defaultExit: 'success',
  catchallExit: 'error',

  exits: {
    success: {
      example: {
        name: 'machinepack-mandrill-test',
        code: '<div>Click <a href="*|RESET_LINK|*">here</a> to reset your password.</div>',
        publish_code: null,
        created_at: '2014-05-28 21:59:49.70010',
        updated_at: '2014-05-28 21:59:49.70012',
        slug: 'machinepack-mandrill-test',
        publish_name: 'machinepack-mandrill-test',
        labels: [],
        text: 'Click on the following link to reset your password: \n *|RESET_LINK|*',
        publish_text: null,
        subject: null,
        publish_subject: null,
        from_email: null,
        publish_from_email: null,
        from_name: null,
      }
    },
    error: {
      example: {
        status: 'error',
        code: 6,
        name: 'Invalid_Template',
        message: 'A template with name "machinepack-mandrill-test" already exists'
      }
    }
  },

  fn: function(inputs, exits) {

    var request = require('request');

    // Base url for API requests.
    var BASE_URL = 'https://mandrillapp.com/api/1.0';

    request.post({
      url: BASE_URL + '/templates/add.json',
      form: {
        key: inputs.apiKey,
        name: inputs.name,
        from_email: inputs.from_email,
        from_name: inputs.from_name,
        subject: inputs.subject,
        code: inputs.code || undefined,
        text: inputs.text || undefined,
        publish: inputs.publish,
        labels: inputs.labels
      },
      json: true
    }, function(err, response, httpBody) {
      if (err) {
        return exits(err);
      } else if (response.status >= 300 || response.status < 200) {
        return exits.error(httpBody);
      } else if (typeof httpBody !== 'object' || httpBody.status === 'error') {
        return exits.error(httpBody);
      } else {
        return exits.success(httpBody);
      }
    });
  }
};