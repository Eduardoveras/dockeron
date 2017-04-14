<template>
  <div>
    <Button type="success" @click="createContainer">
      Create
    </Button>
    <Button type="error" @click="removeImageModal = true">
      Remove
    </Button>
    <Modal v-model="removeImageModal" title="Do you want to remove this image?"
        @on-ok="removeImage">
    </Modal>
    <Modal v-model="removedImageModal" title="Remove results"
        @on-ok="goBackHome">
      <tree-view :data="removed" :options="{maxDepth: 2}"></tree-view>
    </Modal>
    <div v-if="hasAllButtons" class="additional-buttons">
      <Button type="success" @click="getImageHistory">
        History
      </Button>
      <Modal v-model="imageHistoryModal" title="Image History">
        <tree-view :data="history" :options="{maxDepth: 2}"></tree-view>
      </Modal>
      <Button type="warning" @click="pushImage">
        Push
      </Button>
      <Button type="info" @click="tagImageModal = true">
        Tag
      </Button>
      <Modal v-model="tagImageModal" title="Tag Image" @on-ok="tagImage">
        Repo: <Input v-model="newTags.repo" placeholder="The repository to tag in."></Input>
        Tag: <Input v-model="newTags.tag" placeholder="The name of the new tag."></Input>
      </Modal>
      <!-- <Button type="success" @click="getImage">
        Get
      </Button> -->
    </div>
  </div>
</template>

<script>
  import TreeView from '../TreeView/TreeView'

  import docker from '../../js/docker'
  import notify from '../../js/notify'

  export default {
    components: {
      TreeView
    },
    props: {
      imageId: {
        type: String,
        default: ''
      },
      initialize: {
        type: Boolean,
        default: false
      },
      hasAllButtons: {
        type: Boolean,
        default: false
      },
      // image data
      value: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        removeImageModal: false,
        removedImageModal: false,
        imageHistoryModal: false,
        tagImageModal: false,
        history: {},
        removed: {},
        newTags: {
          repo: '',
          tag: ''
        },
        image: {}
      }
    },
    methods: {
      createContainer () {
        // TODO (fluency03): create a container directly from image
      },
      removeImage () {
        var self = this

        function imageRemoved (removed) {
          self.removed = removed
          self.removedImageModal = true
          notify('Image has been removed!')
          self.$emit('image-removed', removed)
        }

        this.image.remove()
          .then(imageRemoved)
          .catch(notify)
      },
      goBackHome () {
        //
      },
      getImageHistory () {
        var self = this

        function imageHistoryGot (history) {
          self.history = history
          self.imageHistoryModal = true
        }

        this.image.history()
          .then(imageHistoryGot)
          .catch(notify)
      },
      pushImage () {
        // TODO
      },
      tagImage () {
        var self = this

        function imageTagged (info) {
          self.inspectImage()
        }

        this.image.tag(this.newTags)
          .then(imageTagged)
          .catch(notify)
      },
      getImage () {
        // TODO
      },
      inspectImage () {
        var self = this

        function imageRefreshed (data) {
          self.$emit('input', data)
        }

        function refreshErrored (err) {
          notify(err)
          self.$emit('input', err)
        }

        this.image.inspect()
          .then(imageRefreshed)
          .catch(refreshErrored)
      }
    },
    created () {
      this.image = docker.getImage(this.imageId)
      if (this.initialize) {
        this.inspectImage()
      }
    }
  }
</script>

<style scoped>
  .additional-buttons {
    display: inline-block;
  }
</style>