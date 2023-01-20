import 'reflect-metadata';
import logger from './logger';
import { createKoaServer } from 'routing-controllers';
import { CodeController } from './controller/code';
import { StatController } from './controller/stat';
import { QuestionController } from './controller/question';
import ws from 'ws'
import * as map from 'lib0/map'
// @ts-ignore
// eslint-disable-next-line no-extend-native
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const app = createKoaServer({
  cors: true,
  controllers: [CodeController, StatController, QuestionController],
});

app.on('error', (err: any) => {
  console.error('server error', err);
});

process.on('unhandledRejection', (err) => {
  console.log('unhandledRejection', err);
});

process.on('uncaughtException', (err) => {
  console.log('uncaughtException', err);
});

const server = app.listen(39005, () => {
  logger.info('应用启动成功!');
});

const wsReadyStateConnecting = 0
const wsReadyStateOpen = 1
const wsReadyStateClosing = 2 // eslint-disable-line
const wsReadyStateClosed = 3 // eslint-disable-line

const pingTimeout = 30000

// @ts-ignore
const wss = new ws.Server({ server })

/**
 * Map froms topic-name to set of subscribed clients.
 * @type {Map<string, Set<any>>}
 */
const topics = new Map()

/**
 * @param {any} conn
 * @param {object} message
 */
// @ts-ignore
const send = (conn, message) => {
  if (conn.readyState !== wsReadyStateConnecting && conn.readyState !== wsReadyStateOpen) {
    conn.close()
  }
  try {
    conn.send(JSON.stringify(message))
  } catch (e) {
    conn.close()
  }
}

/**
 * Setup a new client
 * @param {any} conn
 */
// @ts-ignore
const onconnection = conn => {
  /**
   * @type {Set<string>}
   */
  const subscribedTopics = new Set()
  let closed = false
  // Check if connection is still alive
  let pongReceived = true
  const pingInterval = setInterval(() => {
    if (!pongReceived) {
      conn.close()
      clearInterval(pingInterval)
    } else {
      pongReceived = false
      try {
        conn.ping()
      } catch (e) {
        conn.close()
      }
    }
  }, pingTimeout)
  conn.on('pong', () => {
    pongReceived = true
  })
  conn.on('close', () => {
    subscribedTopics.forEach(topicName => {
      const subs = topics.get(topicName) || new Set()
      subs.delete(conn)
      if (subs.size === 0) {
        topics.delete(topicName)
      }
    })
    subscribedTopics.clear()
    closed = true
  })
  // @ts-ignore
  conn.on('message', /** @param {object} message */ message => {
    if (typeof message === 'string') {
      message = JSON.parse(message)
    }
    if (message && message.type && !closed) {
      switch (message.type) {
        case 'subscribe':
          // @ts-ignore
          /** @type {Array<string>} */ (message.topics || []).forEach(topicName => {
            if (typeof topicName === 'string') {
              // add conn to topic
              const topic = map.setIfUndefined(topics, topicName, () => new Set())
              topic.add(conn)
              // add topic to conn
              subscribedTopics.add(topicName)
            }
          })
          break
        case 'unsubscribe':
          // @ts-ignore
          /** @type {Array<string>} */ (message.topics || []).forEach(topicName => {
            const subs = topics.get(topicName)
            if (subs) {
              subs.delete(conn)
            }
          })
          break
        case 'publish':
          if (message.topic) {
            const receivers = topics.get(message.topic)
            if (receivers) {
              // @ts-ignore
              receivers.forEach(receiver =>
                  send(receiver, message)
              )
            }
          }
          break
        case 'ping':
          send(conn, { type: 'pong' })
      }
    }
  })
}
wss.on('connection', onconnection)
// @ts-ignore
app.on('upgrade', (request, socket, head) => {
  // You may check auth of request here..
  /**
   * @param {any} ws
   */
  // @ts-ignore
  const handleAuth = ws => {
    wss.emit('connection', ws, request)
  }
  wss.handleUpgrade(request, socket, head, handleAuth)
})
