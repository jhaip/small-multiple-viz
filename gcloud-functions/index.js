const Datastore = require('@google-cloud/datastore');
const datastore = Datastore();

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event The Cloud Functions event.
 * @param {!Function} The callback function.
 */
exports.subscribe = function subscribe(event, callback) {
  // The Cloud Pub/Sub Message object.
  const pubsubMessage = event.data;

  // We're just going to log the message to prove that
  // it worked.
  console.log(Buffer.from(pubsubMessage.data, 'base64').toString());

  console.log(pubsubMessage);

  var obj = {
    gc_pub_sub_id: pubsubMessage.id,
    device_id: pubsubMessage.attributes.device_id,
    event: pubsubMessage.attributes.event,
    data: Buffer.from(pubsubMessage.data, 'base64').toString(),
    published_at: new Date(pubsubMessage.attributes.published_at)
  }
  var key = datastore.key('ParticleEvent');

  console.log('about to datastore.save');
  console.log(obj);

  datastore.save({
    key: key,
    data: obj
  }, function(err) {
    if(err) {
      console.log('There was an error storing the event', err);
    }
    console.log('Particle event stored in Datastore!');
  });


  // Don't forget to call the callback.
  callback();
};
