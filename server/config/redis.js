const RedisStore = require('connect-redis').default
const {createClient} = require('redis')

module.exports = async () => {
    const redisClient = createClient({
        password: '*******',
        socket: {
            host: 'redis-11659.c328.europe-west3-1.gce.cloud.redislabs.com',
            port: 11659
        }
    })

    let redisStore = new RedisStore({
        client: redisClient,
        prefix: "dead-fist:",
    })

    return {redisClient, redisStore}
}
