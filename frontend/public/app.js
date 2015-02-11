// The main app module.
angular.module('app', [
  // angular deps
  'ngRoute',
  'ngAnimate',
  'ngSanitize',
  // other deps
  'ui.bootstrap',
  'underscore',
  'jquery',
  'coreos',
  'ngTagsInput',
  // internal modules
  'templates',
  'k8s',
  'app.ui',
  'app.modules',
])

// Routes
.config(function($routeProvider, $locationProvider, $httpProvider,
      configSvcProvider, apiClientProvider, errorMessageSvcProvider, flagSvcProvider, k8sConfigProvider) {

  $locationProvider.html5Mode(true);
  flagSvcProvider.setGlobalId('SERVER_FLAGS');
  k8sConfigProvider.setBasePath('/api/kubernetes/' + window.SERVER_FLAGS.k8sVersion);

  configSvcProvider.config({
    siteBasePath: '/',
    libPath: '/static/lib/coreos-web'
  });

  apiClientProvider.settings({
    cache: false,
    apis: [{
      name: 'bridge',
      id: 'bridge:v1',
      rootUrl: window.location.origin,
      discoveryEndpoint: window.location.origin + '/api/bridge/v1/discovery/v1/rest'
    }]
  });

  errorMessageSvcProvider.registerFormatter('k8sApi', function(resp) {
    if (resp.data && resp.data.message) {
      return resp.data.message;
    }
    return 'An error occurred. Please try again.';
  });

  $routeProvider
    .when('/', {
      controller: 'ClusterStatusCtrl',
      templateUrl: '/static/page/cluster/status.html',
      title: 'Cluster Status',
      resolve: {
        client: 'ClientLoaderSvc'
      }
    })
    .when('/services', {
      controller: 'ServicesCtrl',
      templateUrl: '/static/page/services/services.html',
      title: 'Services',
    })
    .when('/services/new', {
      controller: 'NewServiceCtrl',
      templateUrl: '/static/page/services/new-service.html',
      title: 'Create New Service',
    })
    .when('/services/:name', {
      controller: 'ServiceCtrl',
      templateUrl: '/static/page/services/service.html',
      title: 'Service',
    })
    .when('/controllers', {
      controller: 'ControllersCtrl',
      templateUrl: '/static/page/controllers/controllers.html',
      title: 'Controllers',
    })
    .when('/replica-controllers/new', {
      controller: 'NewReplicaControllerCtrl',
      templateUrl: '/static/page/controllers/new-replica-controller.html',
      title: 'New Replication Controller',
    })
    .when('/replica-controllers/:name/edit', {
      controller: 'EditReplicaControllerCtrl',
      templateUrl: '/static/page/controllers/edit-replica-controller.html',
      title: 'Edit Replication Controller',
    })
    .when('/replica-controllers/:name', {
      controller: 'ReplicaControllerCtrl',
      templateUrl: '/static/page/controllers/replica-controller.html',
      title: 'Controller',
    })
    .when('/pods', {
      controller: 'PodsCtrl',
      templateUrl: '/static/page/pods/pods.html',
      title: 'Pods',
    })
    .when('/pods/new', {
      controller: 'NewPodCtrl',
      templateUrl: '/static/page/pods/new-pod.html',
      title: 'Create New Pod',
    })
    .when('/pods/:name', {
      controller: 'PodCtrl',
      templateUrl: '/static/page/pods/pod.html',
      title: 'Pod',
    })
    .when('/containers/:podName/:name', {
      controller: 'ContainerCtrl',
      templateUrl: '/static/page/containers/container.html',
      title: 'Container',
    })
    .when('/machines', {
      controller: 'MachinesCtrl',
      templateUrl: '/static/page/machines/machines.html',
      title: 'Machines',
    })
    .when('/machines/:name', {
      controller: 'MachineCtrl',
      templateUrl: '/static/page/machines/machine.html',
      title: 'Machine',
    })
    .when('/search', {
      controller: 'SearchCtrl',
      templateUrl: '/static/page/search/search.html',
      title: 'Search',
    })
    .when('/settings/registries', {
      controller: 'RegistriesCtrl',
      templateUrl: '/static/page/settings/registries.html',
      title: 'Configure Registries',
      resolve: {
        client: 'ClientLoaderSvc'
      }
    })
    .when('/settings/users', {
      controller: 'UsersCtrl',
      templateUrl: '/static/page/settings/users.html',
      title: 'Users & API Keys',
      resolve: {
        client: 'ClientLoaderSvc'
      }
    })
    .when('/welcome', {
      controller: 'WelcomeCtrl',
      templateUrl: '/static/page/welcome/welcome.html',
      title: 'Welcome to your CoreOS Cluster',
    })
    .otherwise({
      templateUrl: '/static/page/error/404.html',
      title: 'Page Not Found (404)'
    });
})

.run(function($rootScope, CONST, flagSvc) {
  // Convenience access for temmplates
  $rootScope.CONST = CONST;
  $rootScope.SERVER_FLAGS = flagSvc.all();
});
