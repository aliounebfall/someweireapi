import kafka from '../utils/provider/KafkaProvider';

const tag = 'NFT_MINT_SUBSCRIBER';

const kf = kafka;

export function getNFTMintSubscriber(){
    let topic = process.env.KAFKA_TOPIC_ARTIFACT_MINT;
    let subscriber = kf
                        .fromTopic(topic)
                        .let(kafka.JSONMessage());

    return subscriber;
}