<template>
  <div>
    <Form :model="defaultSettings" :label-width="80">
      <Form-item label="Command">
        <Tag v-for="cmd in defaultSettings.cmd" :key="cmd" :name="cmd" closable @on-close="deleteCMD">
          {{cmd}}
        </Tag>
        <Poptip>
          <Button icon="ios-plus-empty" type="dashed" size="small">Add CMD</Button>
          <div slot="title">What CMD you want to execute?</div>
          <div slot="content">
            <Tooltip content="CMD cannot be empty string!">
              <Input v-model="newCMD" icon="plus-round" @on-click="addCMD" @on-enter="addCMD"
                  placeholder="eg. uname -a">
              </Input>
            </Tooltip>
          </div>
        </Poptip>
      </Form-item>
      <!-- <Form-item label="Command" required>
        <Input v-model="defaultSettings.cmd[0]" placeholder="Array of String"></Input>
      </Form-item> -->
    </Form>
    <Button class="import-button" type="primary" @click="openFileDialog">
      Import from JSON
    </Button>
    <json-form class="advanced-settings-form" name="Advanced Settings" :label-width="80"
        v-model="advancedSettings">
    </json-form>
  </div>
</template>

<script>
  import JsonForm from '../JsonForm/JsonForm'

  import { ipcRenderer } from 'electron'
  import docker from '../../js/docker'
  import notify from '../../js/notify'
  import jsonFileImportInit from '../../js/jsonFileImportInit'

  export default {
    components: {
      JsonForm
    },
    props: {
      containerId: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        container: {},
        newCMD: '',
        defaultSettings: {
          cmd: []
        },
        importedSettings: {},
        advancedSettings: {}
      }
    },
    watch: {
      value: function (newValue) {
        this.defaultSettings.cmd = newValue
      }
    },
    methods: {
      addCMD () {
        if (!this.newCMD) {
          return
        }
        this.defaultSettings.cmd.push(this.newCMD)
        this.newCMD = ''
      },
      deleteCMD (event, name) {
        var index = this.defaultSettings.cmd.indexOf(name)
        this.defaultSettings.cmd.splice(index, 1)
      },
      submit () {
        var self = this

        function containerExecuted (data) {
          console.log(data)
          notify('Execution successful!!')
          self.$emit('container-exectution-succeed')
        }

        function execErrored (err) {
          notify(err)
          self.$emit('container-execution-errored', err)
        }
        console.log(this.defaultSettings)
        console.log(this.advancedSettings)
        console.log(Object.assign({}, this.defaultSettings,
          this.advancedSettings))

        this.container.exec(Object.assign({}, this.defaultSettings,
          this.advancedSettings))
          .then(containerExecuted)
          .catch(execErrored)

        this.reset()
      },
      reset () {
        this.defaultSettings = {
          cmd: []
        }
        this.advancedSettings = this.importedSettings
      },
      openFileDialog () {
        ipcRenderer.send('open-file-dialog')
      }
    },
    created () {
      var self = this
      this.stringifiedSettings = JSON.stringify(this.importedSettings, null, 4)
      this.container = docker.getContainer(this.containerId)

      function readFileCB (err, data) {
        if (err) {
          notify(err)
        }

        var parsedJSON = JSON.parse(data)
        self.importedSettings = parsedJSON
        self.advancedSettings = self.importedSettings
      }

      jsonFileImportInit(readFileCB)
    }
  }
</script>

<style scoped>
  .switch {
    display: inline-block;
  }
  .import-button {
    display: inline-block;
  }
  .advanced-settings-form {
    margin-top: 10px;
  }
</style>
