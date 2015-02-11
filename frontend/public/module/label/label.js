angular.module('app')

.directive('coLabel', function($interpolate, k8s) {
  'use strict';

  var linkTemplate = $interpolate('/search?kind={{kind}}&q={{query}}');

  return {
    templateUrl: '/static/module/label/label.html',
    restrict: 'E',
    replace: true,
    link: function(scope, el, attrs) {
      var ref, linkEl, labelObj;

      labelObj = {};
      labelObj[attrs.key] = attrs.value;
      ref = linkTemplate({
        kind: attrs.kind,
        query: k8s.labels.linkEncode(labelObj),
      });

      linkEl = el.find('.co-m-label__link');
      linkEl.attr('href', ref);

      el.addClass('co-m-label--' + attrs.kind);
      if (attrs.selector) {
        el.addClass('co-m-label--selector');
        linkEl.prepend('<i class="co-m-label__icon fa fa-search"></i>');
        linkEl.addClass('co-m-modal-link');
      }

      el.find('.co-m-label__key')
        .text(attrs.key);

      el.find('.co-m-label__value')
        .text(attrs.value);
    }
  };
})

.directive('coLabelList', function() {
  'use strict';
  return {
    templateUrl: '/static/module/label/label-list.html',
    restrict: 'E',
    replace: true,
    scope: {
      // kind id
      kind: '@',
      selector: '@',
      labels: '='
    }
  };
});
