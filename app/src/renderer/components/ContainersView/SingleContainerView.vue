<template>
  <div>
    <container-control-panel class="container-control-panel" v-model="containerData"
        :container-id="containerId" :container-name="containerData.Name"
        :initialize="true" :has-all-buttons="true">
    </container-control-panel>
    <Tag class="container-state-tag" :color="stateToColor[status]">{{status}}</Tag>
    <br>
    <tree-view :data="containerData" :options="{rootObjectKey: containerId}"></tree-view>
  </div>
</template>

<script>
  import ContainerControlPanel from './ContainerControlPanel'
  import TreeView from '../TreeView/TreeView'

  import containerStateToColor from '../../js/containerStateToColor'

  export default {
    components: {
      ContainerControlPanel,
      TreeView
    },
    data () {
      return {
        containerId: '',
        containerData: {},
        stateToColor: containerStateToColor,
        status: 'exited'
      }
    },
    watch: {
      containerData: function (newContainerData) {
        try {
          this.status = newContainerData.State.Status
        } catch (e) {
          console.log(e)
          this.status = 'exited'
        }
      }
    },
    methods: {
      loadContainerId () {
        this.containerId = this.$route.params.containerId
      }
    },
    created () {
      this.loadContainerId()
    }
  }
</script>

<style scoped>
  .container-control-panel {
    margin-left: 20px;
  }

  .container-state-tag {
    position: absolute;
    right: 3px;
  }
</style>
