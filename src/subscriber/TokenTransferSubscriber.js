import kafka from '../utils/provider/KafkaProvider';
import * as BlockChainHandler from '../utils/BlockchainHandler'; 

const tag = 'TOKEN_SUBSCRIBER';

const kf = kafka;

export function getTokenTransferSubscriber(tokenAddress){
    let topic = BlockChainHandler.getTopicFromAddress(tokenAddress);
    let subscriber = kf
                        .fromTopic(topic)
                        .let(kafka.JSONMessage());

    return subscriber;
}