import kafka from '../utils/provider/KafkaProvider';

const tag = 'NFT_TRANSFER_SUBSCRIBER';

const kf = kafka;

export function getNftTransferSubscriber(){
    let topic = process.env.KAFKA_TOPIC_ARTIFACT_TRANSFER;
    let subscriber = kf
                        .fromTopic(topic)
                        .let(kafka.JSONMessage());

    return subscriber;
}