module.exports = {

  friendlyName: 'Send email (template)',
  description: 'Send a templated email to the specified recipient.',
  cacheable: false,

  inputs: {
    apiKey: {
      friendlyName: 'Mandrill API Key',
      example: '1dTOFDXzJdU5cXiMNd6jRq',
      description: 'A valid Mandrill API key.',
      extendedDescription: 'To look up your API key, log in to your Mandrill account and visit the settings page (https://mandrillapp.com/settings/).',
      required: true
    },
    to: {
      friendlyName: 'To',
      description: 'An array of recipients to send the email to.',
      //example: [{email: 'email@email.com', name: 'Optional Name'}], // not sure how to implement an optional object attribute
      typeclass: 'array',
      required: true
    },
    subject: {
      friendlyName: 'Subject',
      description: 'Subject line for the email.',
      example: 'Welcome, Jane!'
    },
    templateName: {
      friendlyName: 'Template',
      description: "The template's name",
      example: 'myTemplate',
      required: true
    },
    content: {
      friendlyName: 'Global Merge Values',
      description: 'Global merge variables to use for all recipients. You can override these per recipient.',
      typeclass: 'array'
    },
    templateContent: {
      friendlyName: 'Data',
      description: "An array of data you want to inject into the template.",
      example: [{'name': 'of attribute', 'content': 'of attribute'}]
    },
    message: {
      friendlyName: 'Message',
      description: 'Optional full text content to be sent',
      example: 'Jane,\nThanks for joining our community.  If you have any questions, please don\'t hesitate to send them our way.  Feel free to reply to this email directly.\n\nSincerely,\nThe Management'
    },
    fromEmail: {
      friendlyName: 'From (email)',
      description: 'Email address of the sender.',
      example: 'harold@example.enterprise'
    },
    fromName: {
      friendlyName: 'From (name)',
      description: 'Full name of the sender.',
      example: 'Harold Greaseworthy'
    },
    mergeVars: {
      friendlyName: "Merge Tags",
      description: "Content to be placed within template merge tags.",
      example: [{'name': 'FNAME', 'content': 'First Name'}]
    }
  },

  defaultExit: 'success',

  exits: {
    success: {
      void: true
    },
    error: {}
  },

  fn: function(inputs, exits) {

    var request = require('request');

    // Base url for API requests.
    var BASE_URL = 'https://mandrillapp.com/api/1.0';

    request.post({
      url: BASE_URL + '/messages/send-template.json',

      // See https://mandrillapp.com/api/docs/messages.JSON.html#method=send-template for complete reference
      form: {
        key: inputs.apiKey,
        template_name: inputs.templateName,
        template_content: inputs.templateContent,
        message: {
          to: inputs.to,
          text: inputs.message || '',
          subject: inputs.subject,
          from_email: inputs.fromEmail,
          from_name: inputs.fromName,
          merge_vars: [{
            rcpt: inputs.toEmail,
            vars: inputs.mergeVars
          }],
          global_merge_vars: inputs.content,
          auto_html: true
        }
      },
      json: true
    }, function(err, response, httpBody) {
      if (err) {
        return exits.error(err);
      } else if (response.status >= 300 || response.status < 200) {
        return exits.error(httpBody);
      } else if (typeof httpBody !== 'object' || httpBody.status === 'error') {
        return exits.error(httpBody);
      } else {
        return exits.success();
      }
    });
  }
};
