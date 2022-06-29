(function () {
    'use strict';

    angular.module(appName)
        .controller('inicioController', inicioController);

    inicioController.$inject = ['$scope', '$http', '$rootScope'];

    function inicioController($scope, $http, $rootScope) {
        var service = $Ex;
        service.Http = $http;
        var vm = this;
        vm.viewDetail = false;
        vm.titulo = Ex.GetResourceValue("Titulo") || '';
        vm.isValid = true;
        vm.principal = [];
        vm.resultado = [];
        vm.linea = [];
        vm.usuario = {};
        vm.usuario.Loggeado = LoggeadoInfo;
        vm.esCrearModificar = esCrearModificarInfo;
        vm.hasLogin = hasLogin;
        vm.hasLinea = tieneLinea;
        vm.hasDepto = tieneDepto;
        console.log(esCrearModificarInfo);
        vm.rojo = 0;
        vm.amarillo = 0;
        vm.verde = 0;
        vm.lineaAll = LineaInfo;
        vm.depto = DeptoInfo;


        var date = new Date();
        var dd = date.getDate();
        var mm = date.getMonth();
        var aaaa = date.getFullYear();
        vm.diaHoy = new Date(aaaa, mm, dd);



        $scope.numeroAleatorio = function (min, max) {
            return Math.round(Math.random() * (max - min) + min);
        }


        $scope.llenarLinea = function (item) {
            // vm.linea = _.find(vm.lineaAll, { Depto: item });
            try {
                Ex.load(true);
                debugger;
                var datos = { Depto: item };
                service.Execute('GetLinea', datos, function (response) {
                    if (response.d) {
                        vm.linea = response.d.Linea;
                    }
                    Ex.load(false);
                })
            }
            catch (ex) {
                Ex.mensajes(ex.message, 4);
                Ex.load(false);
            }
        }

        var tipoApoyoSeleccionada = {};
        $scope.openModalNotas = function (item) {

            try {
                Ex.load(true);
                $scope.chklsxEq = {};
                $scope.chklsxEq_ = {};
                var datos = { CodDepto: item.CodDepartamento, CodEquipo: item.CodEquipo };

                service.Execute('GetCheckListxEqEnc', datos, function (response) {
                    if (response.d) {
                        if (response.d.Resultado.length > 0) {
                            $scope.chklsxEq = response.d.Resultado[0];
                            $scope.chklsxEq_ = angular.copy($scope.chklsxEq);


                            vm.tipoApoyoEvidencia = [];
                            vm.tipoApoyoEvidencia_ = [];
                            var datos = { IdChkEquipo: $scope.chklsxEq.IdChkEquipo };
                            service.Execute('GetCheckListxEqDet', datos, function (response) {
                                if (response.d) {
                                    if (response.d.Resultado.length > 0) {
                                        vm.tipoApoyoEvidencia = response.d.Resultado;
                                        vm.tipoApoyoEvidencia_ = angular.copy(vm.tipoApoyoEvidencia);
                                    }
                                }
                            })


                        }
                    }
                })



            }
            catch (ex) {
                Ex.mensajes(ex.message, 4);
                Ex.load(false);
            }

            Ex.load(false);
            $scope.modalNotas.open();
        };


        $scope.guardar = function () {
            try {
                Ex.load(true);
                var datos = [];
                datos.IdChkEquipo = $scope.chklsxEq.IdChkEquipo;
                datos.CodEquipo = $scope.chklsxEq.CodEquipo;
                datos.tipoApoyoEvidencia = vm.tipoApoyoEvidencia;
                service.Execute('Guardar', datos, function (response) {
                       debugger
                    if (response.d.Error === '') {
                        Ex.mensajes('Se guardó con exito!', 1);
                        $scope.modalNotas.close();
                        vm.consultar();
                    }
                    else {
                        Ex.mensajes(response.d.Error, 1);
                    }
                    Ex.load(false);
                })
            }
            catch (ex) {
                Ex.mensajes(ex.message, 4);
                Ex.load(false);
            }
        }


        var consultar = function (pIdLinea, pIdDepto, pColor) {
            try {
                Ex.load(true);
                vm.principal = [];
                vm.principal_ = angular.copy(vm.principal);
                var datos = { Depto: pIdDepto, Linea: pIdLinea , Color: pColor || '' };
                debugger;
                service.Execute('GetInformacion', datos, function (response) {
                    if (response.d) {
                        vm.principal = response.d.InformacionPrincipal;
                        vm.resultado = response.d.Resultado;
                        vm.principal_ = angular.copy(vm.principal);

                        vm.rojo = vm.resultado[0].Critico;

                        vm.amarillo = vm.resultado[0].Medio;

                        vm.verde = vm.resultado[0].Warning;


                    }
                    Ex.load(false);
                })
            }
            catch (ex) {
                Ex.mensajes(ex.message, 4);
                Ex.load(false);
            }
        }

        vm.consultar = function (pIdLinea, pIdDepto, pColor) {
            consultar(pIdLinea, pIdDepto, pColor);
        }


        var init = function () {
            debugger;
            if (vm.hasLogin === 1) {
                vm.DeptoId = vm.hasDepto;
                vm.LineaId = vm.hasLinea;
                consultar(vm.hasLinea, vm.hasDepto);
            }
            else
            {
                consultar('', 'MATR');
            }
            vm.linea = vm.lineaAll;
        }


        init();


    }
})();