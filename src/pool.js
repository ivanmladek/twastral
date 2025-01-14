// import {Dialog} from 'quasar'
import {Dialog} from 'quasar'
// import {pool} from './relay.worker'
import * as relayWorker from './relay.worker'
// import {relayPool} from 'nostr-tools'

// export const pool = relayPool()

// relayWorker.pool.setPolicy('randomChoice', 3)
// relayWorker.pool.onNotice((notice, relay) => {
//   Notify.create({
//     message: `Relay ${relay.url} says: ${notice}`,
//     color: 'info'
//   })
// })

// const tempPool = pool
// delete pool
export const pool = relayWorker.pool

// this will try to sign either with window.nostr or using a manual prompt
export async function signAsynchronously(event) {
  if (window.nostr) {
    let signatureOrEvent = await window.nostr.signEvent(event)
    switch (typeof signatureOrEvent) {
      case 'string':
        return signatureOrEvent
      case 'object':
        return signatureOrEvent.sig
      default:
        throw new Error('Failed to sign with Nostr extension.')
    }
  } else {
    return new Promise((resolve, reject) => {
      Dialog.create({
        class: 'px-6 py-1 overflow-hidden',
        title: 'Sign this event manually',
        message: `<pre class="font-mono">${JSON.stringify(
          event,
          null,
          2
        )}</pre>`,
        html: true,
        prompt: {
          model: '',
          type: 'text',
          isValid: val => !!val.toLowerCase().match(/^[a-z0-9]{128}$/),
          attrs: {autocomplete: 'off'},
          label: 'Paste the signature here (as hex)'
        }
      })
        .onOk(resolve)
        .onCancel(() => reject('Canceled.'))
        .onDismiss(() => reject('Canceled.'))
    })
  }
}
