var locationTheme = '../scripts/configuracion/';
var appName = 'app';
angular.module('app', ['ngMaterial', 'ngRoute',
    'ngAnimate',
    'ui.bootstrap',
    'ui.select',
    'customDirectives',
    'ui.sortable',
    'ui.router',
    'ngTouch',
    'toastr',
    'smart-table',
    'ui.slimscroll',
    'angular-progress-button-styles',
    'app.theme',
    'utility',
    'angularFileUpload',
    'switcher',
    "isteven-multi-select",
    "only.money",
    'angularjs-dropdown-multiselect',
    "ui.tree",
    "enums"]);

function DialogRolesController($scope, $mdDialog, RolesService) {
    $scope.roles = ['Requestor', 'Countersigning officer', 'Provider', 'Administrator'];
    $scope.selected = RolesService.getRole();

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.select = function (role) {
        RolesService.setRole(role);
        $mdDialog.hide(role);
    };
}

angular.module('app')
    .factory('ViewsService', function () {
        var _views = [
            { label: 'Dashboard TPM', icon: 'fa-bar-chart', separator: false, page: 'Dashboard.aspx' },
            { label: 'Mantenimiento', icon: 'fa-wrench', separator: false, page: 'Inicio.aspx' },
            // { label: 'Contracts', icon: 'fa-file-text', separator: false },
            //  { label: 'Reports', icon: 'fa-bar-chart', separator: false },
            //  { label: 'Settings', icon: 'fa-cog', separator: true }
        ],
            _current = 'Dashboard';

        function _getViews() {
            return _views;
        }

        function _getCurrent() {
            return _current;
        }

        function _setCurrent(current) {
            _current = current
        }

        return {
            getViews: _getViews,
            getCurrent: _getCurrent,
            setCurrent: _setCurrent
        };
    });

angular.module('app')
    .factory('RolesService', function () {
        var _role = 'Requestor';
        function _getRole() {
            return _role;
        }

        function _setRole(role) {
            _role = role;
        }

        return {
            getRole: _getRole,
            setRole: _setRole
        };
    });

angular.module('app').controller('DashboardController', function () {
    var ctrl = this;
});


angular.module('app')
    .controller('appController', function ($scope, $mdSidenav, $document, $mdDialog,
        RolesService, ViewsService) {
        var ctrl = this;

        ctrl.onDocumentClick = null;
        ctrl.logOutMenuVisible = false;
        ctrl.views = ViewsService.getViews();
        ctrl.currentView = ViewsService.getCurrent();
        ctrl.role = RolesService.getRole();
        ctrl.usuarioLoggeado = false;

        function _showLogOutMenu() {
            ctrl.logOutMenuVisible = true;

            ctrl.onDocumentClick = $document.bind('click', function () {
                _hideLogOutMenu();
                $scope.$apply();
            });
        }

        function _hideLogOutMenu() {
            ctrl.logOutMenuVisible = false;
            ctrl.onDocumentClick = null;
        }

        ctrl.toggleMainMenu = function () {
            $mdSidenav('menu-left').toggle();
        };

        ctrl.toggleLogOutMenu = function (event) {
            event.stopImmediatePropagation();

            if (ctrl.logOutMenuVisible) {
                _hideLogOutMenu();
            } else {
                _showLogOutMenu();


            }
        };

        ctrl.logIn = function () {
            window.location.assign('Login.aspx');
        }

        ctrl.goDashBoard = function () {
            window.location.assign('Dashboard.aspx');
        }

        ctrl.goMantenimiento = function () {
            window.location.assign('Inicio.aspx');
        }

        ctrl.getUsuario = function () {
            return Usuario;
        } 
        ctrl.changeRole = function (event) {
            $mdDialog.show({
                controller: DialogRolesController,
                templateUrl: 'dialogRole.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true
            })
                .then(function (role) {
                    ctrl.role = role;
                });
        };

        ctrl.changeView = function (page, view) {
            window.location.assign(page);
            ViewsService.setCurrent(view);
            ctrl.currentView = view;
            ctrl.toggleMainMenu();
        }
    });