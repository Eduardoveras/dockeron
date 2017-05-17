export default [
  {
    path: '/',
    name: 'home-page',
    component: require('components/HomePageView'),
    children: [
      {
        path: '',
        name: 'default',
        component: require('components/ContainersView/ContainersView')
      },
      {
        path: 'containers',
        name: 'containers-view',
        component: require('components/ContainersView/ContainersView')
      },
      {
        path: '/containers/:containerId',
        name: 'single-container-view',
        component: require('components/ContainersView/SingleContainerView')
      },
      {
        path: 'images',
        name: 'images-view',
        component: require('components/ImagesView/ImagesView')
      },
      {
        path: '/images/:imageId',
        name: 'single-image-view',
        component: require('components/ImagesView/SingleImageView')
      },
      {
        path: 'volumes',
        name: 'volumes-view',
        component: require('components/VolumesView/VolumesView')
      },
      {
        path: '/volumes/:volumeName',
        name: 'single-volume-view',
        component: require('components/VolumesView/SingleVolumeView')
      },
      {
        path: 'networks',
        name: 'networks-view',
        component: require('components/NetworksView/NetworksView')
      },
      {
        path: '/networks/:networkId',
        name: 'single-network-view',
        component: require('components/NetworksView/SingleNetworkView')
      },
      {
        path: 'plugins',
        name: 'plugins-view',
        component: require('components/PluginsView/PluginsView')
      },
      {
        path: '/docker-hub',
        name: 'docker-hub-view',
        component: require('components/DockerHubView/DockerHubView')
      }
    ]
  },
  {
    path: '*',
    redirect: '/'
  }
]
