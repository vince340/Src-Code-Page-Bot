const { sendSenderAction } = require('../handles/sendMessage');

module.exports = {
  name: 'react',
  description: 'Mark the message as seen',
  usage: 'markAsSeen',
  author: 'coffee',

  async execute(senderId, args, pageAccessToken) {
    await sendSenderAction(senderId, 'react', pageAccessToken);
  }
};
