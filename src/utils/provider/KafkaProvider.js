import kafka from 'kafka-observable'

let opts = {brokers: process.env.KAFKA_BROKER,
            groupId: process.env.KAFKA_GROUPID};

let kf = kafka(opts);

module.exports = kf;