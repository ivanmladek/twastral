<template>
  <q-dialog v-model="showKeyInitialization" persistent>
    <q-card class="q-pb-xl q-pt-md q-pl-sm q-pr-sm">
      <q-card-section class="intro">
        <h1 class="text-h6">welcome to twastral</h1>
        <BaseMarkdown>
          twastral is a decentralized, censorship resistant social platform
          powered by the [Nostr](https://github.com/fiatjaf/nostr) protocol. All
          your messages get posted to  Nostr, therefore protecting
          you against cancellation.
        </BaseMarkdown>

        <div id="app">
          <div class="q-btn">
To signup just push the button below to generate an identity, which downloads a small file, which serves as both your username and password.           </div>
          <q-btn-group spread unelevated
            ><q-btn size="lg" @click="downloadFile()"  label="Generate and download your identity" color="green"/>
          </q-btn-group
          >
        </div>
      </q-card-section>
      DON'T LOOSE THE FILE. THERE IS NO RESET PASSWORD!
      <div id="app">
          <div class="q-btn">
If you have an identity file already generate you can upload it here         </div>
          <q-btn-group spread unelevated
            ><q-btn color="red" size="lg"   label="Upload your identity file" />
          </q-btn-group
          >
        </div>
      <div v-if="isBeck32Key(key)">
        {{ hexKey }}
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'
import helpersMixin from '../utils/mixin'
import { validateWords } from 'nostr-tools/nip06'
import { generatePrivateKey } from 'nostr-tools'
import { decode } from 'bech32-buffer'
import BaseMarkdown from 'components/BaseMarkdown.vue'
import exportFromJSON from 'export-from-json'

export default defineComponent({
  name: 'TheKeyInitializationDialog',
  mixins: [helpersMixin],

  components: {
    BaseMarkdown,
  },

  setup() {
    return {
      focusKeyInput() {
        this.$refs.keyInput.focus()
      },
    }
  },

  data() {
    return {
      credendtials: {
          id: 0,
          name: 'Gautam',
          private_key: generatePrivateKey(),
          public_key: 'Stocks',
        },
      watchOnly: false,
      key: null,
      CONSUMER_KEY: null,
      twitter_raw: null,
      hasExtension: false,
    }
  },

  computed: {
    icon() {
      return document.getElementById('icon').href
    },

    showKeyInitialization() {
      if (['profile', 'event', 'hashtag', 'feed'].includes(this.$route.name))
        return false
      return true
    },

    isKeyKey() {
      if (this.isKey(this.hexKey)) return true
      return false
    },

    isKeyValid() {
      if (this.isKeyKey) return true
      if (validateWords(this.key?.toLowerCase())) return true
      return false
    },

    hexKey() {
      // npub1xtscya34g58tk0z605fvr788k263gsu6cy9x0mhnm87echrgufzsevkk5s
      // nsec1xtscya34g58tk0z605fvr788k263gsu6cy9x0mhnm87echrgufzs46ahj9
      // 32e1827635450ebb3c5a7d12c1f8e7b2b514439ac10a67eef3d9fd9c5c68e245
      if (this.isBeck32Key(this.key)) {
        let { data } = decode(this.key.toLowerCase())
        return this.toHexString(data)
      }
      return this.key?.toLowerCase()
    },

    isBech32Pub() {
      if (this.isBeck32Key(this.key)) {
        let { prefix } = decode(this.key.toLowerCase())
        return prefix === 'npub'
      }
      return false
    },

    isBech32Sec() {
      if (this.isBeck32Key(this.key)) {
        let { prefix } = decode(this.key.toLowerCase())
        return prefix === 'nsec'
      }
      return false
    },
  },

  async created() {
    if (!this.$store.state.keys.pub) {
      // keys not set up, offer the option to try to get a pubkey from window.nostr
      setTimeout(() => {
        if (window.nostr) {
          this.hasExtension = true
        }
      }, 1000)
    }
  },

  methods: {
    downloadFile() {
      const data = this.credendtials
      const fileName = 'nostr_credentials.json'
      const exportType = exportFromJSON.types.json

      if (data) exportFromJSON({ data, fileName, exportType })
    },

    async getFromExtension() {
      try {
        this.key = await window.nostr.getPublicKey()
        this.watchOnly = true
        this.focusKeyInput()
      } catch (err) {
        this.$q.notify({
          message: `Failed to get a public key from a Nostr extension: ${err}`,
          color: 'warning',
        })
      }
    },

    generate() {
      this.key = generatePrivateKey()
      this.watchOnly = false
      this.focusKeyInput()
    },

    proceed() {
      let key = this.hexKey

      var keys = {}
      if (validateWords(key)) {
        keys.mnemonic = key
      } else if (this.isKey(key)) {
        if (this.watchOnly) keys.pub = key
        else keys.priv = key
      } else {
        console.warn('Proceed called with invalid key', key)
      }
      keys.CONSUMER_KEY = this.CONSUMER_KEY
      keys.twitter_raw = this.twitter_raw
      this.$store.dispatch('initKeys', keys)
      this.$store.dispatch('launch')
      this.initializeKeys = false
      this.$router.push({
        name: 'settings',
        params: { showKeys: true },
      })
    },

    isKey(key) {
      if (key?.toLowerCase()?.match(/^[0-9a-f]{64}$/)) return true
      return false
    },

    isBeck32Key(key) {
      if (typeof key !== 'string') return false
      try {
        let { prefix, data } = decode(key.toLowerCase())
        if (!['npub', 'nsec'].includes(prefix)) return false
        if (prefix === 'npub') this.watchOnly = true
        if (prefix === 'nsec') this.watchOnly = false
        if (!this.isKey(this.toHexString(data))) return false
      } catch (error) {
        return false
      }
      return true
    },

    toHexString(buffer) {
      return buffer.reduce((s, byte) => {
        let hex = byte.toString(16)
        if (hex.length === 1) hex = '0' + hex
        return s + hex
      }, '')
    },
  },
})
</script>

<style></style>
