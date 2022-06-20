(function () {
    'use strict';

    angular.module(appName)
        .controller('dashboardController', dashboardController);

    dashboardController.$inject = ['$scope', '$http', '$rootScope'];

    function dashboardController($scope, $http, $rootScope) {
        var service = $Ex;
        service.Http = $http;
        var vm = this;
        vm.viewDetail = false;
        vm.titulo = Ex.GetResourceValue("Titulo") || '';
        vm.isValid = true;
        vm.grafica1 = [];
        vm.grafica2 = [];
        vm.grafica3 = [];        
        vm.usuario = {};        
        vm.usuario.Loggeado = LoggeadoInfo;
      
        var date = new Date();
        var dd = date.getDate();
        var mm = date.getMonth();
        var aaaa = date.getFullYear();
        vm.diaHoy = new Date(aaaa, mm, dd);

        var grafica1 = function () {
            try {
                Ex.load(true);
                var datos = {};
                service.Execute('GetGrafica1', datos, function (response) {
                    if (response.d) {
                        var data = response.d.InformacionPrincipal;
                        var dataarr = [];
                        var Labelarr = [];
                        var Colorarr = [];

                        for (var i = 0; i < data.length; i++) {
                            dataarr.push(data[i].Critico);
                            Labelarr.push('Rojo');
                            Colorarr.push('red');

                            dataarr.push(data[i].Medio);
                            Labelarr.push('Amarillo');
                            Colorarr.push('yellow');

                            dataarr.push(data[i].Warning);
                            Labelarr.push('Verde');
                            Colorarr.push('greenyellow');
                        }

                        var ctx = document.getElementById("myChart").getContext("2d");

                        var config = {
                            type: 'bar',

                            data: {
                                datasets: [{
                                    label: '',
                                    data: dataarr,
                                    backgroundColor: Colorarr
                                }],
                                labels: Labelarr,
                                //backgroundColor: Colorarr
                            },
                            responsive: true,
                            options: {
                                locale: 'en-US',
                                scales: {
                                    yAxes: [{
                                        stacked: true
                                    }]

                                },
                                tooltips: {
                                    enabled: true
                                },
                                responsive: true,
                                legend: {
                                    display: false
                                },
                                title: {
                                    display: true,
                                    text: 'Cantidad de Equipos por Estatus',
                                    fontSize: 25
                                },
                                animation: {
                                    //                      duration: 1,
                                    onComplete: function () {
                                        var chartInstance = this.chart,
                                            ctx = chartInstance.ctx;
                                        //ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                                        ctx.textAlign = 'center';
                                        ctx.font = "14Pt Arial";
                                        // ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                                        ctx.fillStyle = "black";
                                        ctx.textBaseline = 'bottom';

                                        this.data.datasets.forEach(function (dataset, i) {
                                            var meta = chartInstance.controller.getDatasetMeta(i);
                                            meta.data.forEach(function (bar, index) {
                                                var data = dataset.data[index];
                                                ctx.fillText(data, bar._model.x + 5, bar._model.y + 1);

                                            });
                                        });


                                    }
                                }
                            }

                        };

                        myChart = new Chart(ctx, config);
                        myChart.update();

                    }
                    Ex.load(false)
                })

            }
            catch (ex) {
                Ex.mensajes(ex.message, 4);
                Ex.load(false);
            }
        }

        var grafica2 = function () {
            try {
                Ex.load(true);
                var datos = {};
                service.Execute('GetGrafica2', datos, function (response) {
                    if (response.d) {
                        var data = response.d.InformacionPrincipal;
                        var dataarrC = [];
                        var dataarrM = [];
                        var dataarrW = [];
                        var Labelarr = [];

                        for (var i = 0; i < data.length; i++) {
                            dataarrC.push(data[i].Critico);
                            dataarrM.push(data[i].Medio);
                            dataarrW.push(data[i].Warning);
                            Labelarr.push(data[i].WorkCenter);
                        }

                        var ctx = document.getElementById("myChart2").getContext("2d");


                        var config = {
                            type: 'bar',

                            data: {
                                datasets: [
                                    {
                                        label: 'Rojo',
                                        data: dataarrC,
                                        backgroundColor: 'red'
                                    },
                                    {
                                        label: 'Amarillo',
                                        data: dataarrM,
                                        backgroundColor: 'yellow'
                                    },
                                    {
                                        label: 'Verde',
                                        data: dataarrW,
                                        backgroundColor: 'greenyellow'
                                    }
                                ],
                                labels: Labelarr,
                                //backgroundColor: Colorarr
                            },
                            responsive: true,
                            options: {
                                locale: 'en-US',
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            beginAtZero: true
                                        }
                                    }],
                                },
                                tooltips: {
                                    enabled: true
                                },
                                responsive: true,
                                legend: {
                                    display: false
                                },
                                title: {
                                    display: true,
                                    text: 'Cantidad de Equipos en Estatus por Linea',
                                    fontSize: 25
                                },
                                animation: {
                                    //                      duration: 1,
                                    onComplete: function () {
                                        var chartInstance = this.chart,
                                            ctx = chartInstance.ctx;
                                        //ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                                        ctx.textAlign = 'center';
                                        ctx.font = "14Pt Arial";
                                        // ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                                        ctx.fillStyle = "black";
                                        ctx.textBaseline = 'bottom';

                                        this.data.datasets.forEach(function (dataset, i) {
                                            var meta = chartInstance.controller.getDatasetMeta(i);
                                            meta.data.forEach(function (bar, index) {
                                                var data = dataset.data[index];
                                                ctx.fillText(data, bar._model.x + 5, bar._model.y + 1);

                                            });
                                        });


                                    }
                                }
                            }

                        };

                        myChart2 = new Chart(ctx, config);
                        myChart2.update();
                       
                    }
                    Ex.load(false)
                })

            }
            catch (ex) {
                Ex.mensajes(ex.message, 4);
                Ex.load(false);
            }
        }


        var grafica3 = function () {
            try {
                Ex.load(true);
                var datos = {};
                service.Execute('GetGrafica3', datos, function (response) {
                    if (response.d) {
                        var data = response.d.InformacionPrincipal;

                        var dataarrC = [];
                        var Labelarr = [];

                        for (var i = 0; i < data.length; i++) {
                            dataarrC.push(data[i].Critico);
                            Labelarr.push(data[i].WorkCenter);
                        }

                        var ctx = document.getElementById("myChart3").getContext("2d");


                        var config = {
                            type: 'bar',

                            data: {
                                datasets: [
                                    {
                                        label: 'Rojo',
                                        data: dataarrC,
                                        backgroundColor: 'red'
                                    }
                                ],
                                labels: Labelarr,
                                //backgroundColor: Colorarr
                            },
                            responsive: true,
                            options: {
                                locale: 'en-US',
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            beginAtZero: true
                                        }
                                    }],
                                },
                                tooltips: {
                                    enabled: true
                                },
                                responsive: true,
                                legend: {
                                    display: false
                                },
                                title: {
                                    display: true,
                                    text: 'Top 10 de WorkCenter en Estado Critico',
                                    fontSize: 25
                                },
                                animation: {
                                    //                      duration: 1,
                                    onComplete: function () {
                                        var chartInstance = this.chart,
                                            ctx = chartInstance.ctx;
                                        //ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                                        ctx.textAlign = 'center';
                                        ctx.font = "14Pt Arial";
                                        // ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                                        ctx.fillStyle = "black";
                                        ctx.textBaseline = 'bottom';

                                        this.data.datasets.forEach(function (dataset, i) {
                                            var meta = chartInstance.controller.getDatasetMeta(i);
                                            meta.data.forEach(function (bar, index) {
                                                var data = dataset.data[index];
                                                ctx.fillText(data, bar._model.x + 5, bar._model.y + 1);

                                            });
                                        });


                                    }
                                }
                            }

                        };

                        myChart3 = new Chart(ctx, config);
                        myChart3.update();
                        
                    }
                    Ex.load(false)
                })

            }
            catch (ex) {
                Ex.mensajes(ex.message, 4);
                Ex.load(false);
            }
        }

        vm.graficas = function () {
            grafica1();
            grafica2();
            grafica3();
        }

        


        var init = function () {
            vm.graficas();
        }




        init();


    }
})();