'use strict';

var App = require('../app');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var _ = require('underscore');
var localforage = require('localforage');

var navigationItem = App.request('addNavigationItem', {
  name: 'Collab',
  icon: 'users',
  url: '/collab'
});

function init () {
  var groupsList = [
    {
      name: 'CS3240 Project',
      slug: 'cs3240-project',
      members: [
        {name: 'Yang Shun'},
        {name: 'Darren' },
        {name: 'Poo Siang'},
        {name: 'Joan'}
      ]
    },
    {
      name: 'CS4243 Project',
      slug: 'cs4243-project',
      members: [
        {name: 'Yang Shun'},
        {name: 'Jenna'},
        {name: 'Minh Tu'},
        {name: 'Hieu'}
      ]
    },
    {
      name: 'CS4249 Assignment',
      slug: 'cs4249-assignment',
      members: [
        {name: 'Yang Shun'},
        {name: 'Hieu'}
      ]
    }
  ];
  localforage.setItem('groups:list', groupsList);
  return groupsList;
}

var controller = {
  showGroups: function () {
    var CollabGroupsView = require('./views/CollabGroupsView');
    navigationItem.select();
    localforage.getItem('groups:list').then(function (groupsList) {
      if (!groupsList) {
        groupsList = init();
      }
      App.mainRegion.show(new CollabGroupsView(groupsList));  
    });
  },
  showGroup: function (slug) {
    var CollabGroupView = require('./views/CollabGroupView');
    navigationItem.select();
    localforage.getItem('groups:list').then(function (groupsList) {
      if (!groupsList) {
        groupsList = init();
      }
      var group = _.findWhere(groupsList, {slug: slug});
      var groupModel = new Backbone.Model({
        group: group,
      });
      App.mainRegion.show(new CollabGroupView({model: groupModel}));  
    });
  }
};

App.addInitializer(function () {
  new Marionette.AppRouter({
    controller: controller,
    appRoutes: {
      'collab': 'showGroups',
      'collab(/:slug)': 'showGroup',
    }
  });
});