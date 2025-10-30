const { Client, TopicCreateTransaction, TopicMessageSubmitTransaction } = require('@hashgraph/sdk');

function getClient() {
  const network = process.env.HEDERA_NETWORK || 'testnet';
  const client = Client.forName(network);
  client.setOperator(process.env.HEDERA_ACCOUNT_ID, process.env.HEDERA_PRIVATE_KEY);
  return client;
}

async function createTopic() {
  const client = getClient();
  const tx = await new TopicCreateTransaction().execute(client);
  const receipt = await tx.getReceipt(client);
  return receipt.topicId.toString();
}

async function submitMessage(topicId, message) {
  const client = getClient();
  const tx = await new TopicMessageSubmitTransaction({ topicId, message }).execute(client);
  const receipt = await tx.getReceipt(client);
  return { status: receipt.status.toString(), consensusTimestamp: receipt.consensusTimestamp.toString() };
}

module.exports = { getClient, createTopic, submitMessage };
