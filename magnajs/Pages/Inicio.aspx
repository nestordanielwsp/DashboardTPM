<%@ Page Title="" Language="C#" MasterPageFile="~/includes/magnajs.Master" AutoEventWireup="true" CodeBehind="Inicio.aspx.cs" Inherits="magnajs.Pages.Inicio" %>


<asp:Content ID="Content1" ContentPlaceHolderID="main" runat="server">
    <div class="view dashboard" ng-controller="inicioController as vm" style="margin-top: 0px;">
        <h1>{{vm.titulo}}</h1>
        <div class="row" style="margin-top: 0px;">
            <div class="col-12 col-lg-8 col-md-6"></div>
            <div class="col-12 col-lg-4 col-md-6">
                <div class="summary-boxes" layout="row" layout-align="space-between center" style="margin-top: 0px; margin-bottom: 8px;">
                    <div class="summary-box summary-pending">
                        <div class="summary-box-main">
                            <div class="summary-value">{{vm.rojo}}</div>
                        </div>
                        <div class="summary-box-footer"><%= this.GetMessage("Rojo") %></div>
                    </div>
                    <div class="summary-box summary-total">
                        <div class="summary-box-main">
                            <div class="summary-value">{{vm.amarillo}}</div>
                        </div>
                        <div class="summary-box-footer"><%= this.GetMessage("Amarillo") %></div>
                    </div>
                    <div class="summary-box summary-amount">
                        <div class="summary-box-main">
                            <div class="summary-value">{{vm.verde}}</div>
                        </div>
                        <div class="summary-box-footer"><%= this.GetMessage("Verde") %></div>
                    </div>
                </div>
            </div>
        </div>
        <div id="Home" class="mail-box padding-10 wrapper border-bottom" style="margin-top: 0px;">
            <br />
            <div class="content-top clearfix">
                <div class="row">
                    <div class="col-sm-6">
                    </div>
                    <div class="col-sm-2">
                        <select class="form-control form-control-select" ng-model="vm.DeptoId" ng-change="llenarLinea(vm.DeptoId)"
                            ng-options="item.DeptoId as item.NombreDepto for item in vm.depto">
                            <option value="">[ TODOS LOS DEPARTAMENTOS ]</option>
                        </select>
                    </div>
                    <div class="col-sm-1">
                    </div>
                    <div class="col-sm-2">
                        <select class="form-control form-control-select" ng-model="vm.LineaId" ng-change="vm.consultar(vm.LineaId, vm.DeptoId)"
                            ng-options="item.WorkCenterId as item.WorkCenter for item in vm.linea">
                            <option value="">[ TODAS LAS LINEAS ]</option>
                        </select>
                    </div>
                    <div class="btn-tpm col-sm-1">
                        <div class="padding-7">
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <div ui-table="vm.principal" st-fixed style="width: 100%">
                <table class="jsgrid-table" style="width: 880px; min-width: 880px"
                    st-table="vm.principal" st-safe-src="vm.principal_">
                    <thead>
                        <tr>
                            <th id="primero" ui-field width="100" class="titulo3 text-center" style="font-weight: bold;"><%= this.GetMessage("gvGeneral-WorkCenter") %></th>
                            <th ui-field width="300" class="titulo3 text-center" style="font-weight: bold;"><%= this.GetMessage("gvGeneral-Descripcion") %></th>
                            <th ui-field width="80" class="titulo3 text-center" style="font-weight: bold;"><%= this.GetMessage("gvGeneral-Equipo") %></th>
                            <th ui-field width="80" class="titulo3 text-center" style="font-weight: bold;"><%= this.GetMessage("gvGeneral-Frecuencia") %></th>
                            <th ui-field width="80" class="titulo3 text-center" style="font-weight: bold;"><%= this.GetMessage("gvGeneral-PiezasProducidas") %></th>
                            <th ui-field width="80" class="titulo3 text-center" style="font-weight: bold;"><%= this.GetMessage("gvGeneral-Porcentaje") %></th>
                            <th id="ultimo" ui-field width="80" class="titulo3 text-center" style="font-weight: bold;"><%= this.GetMessage("gvGeneral-UltimaEjecucion") %></th>
                            <th ui-field  width="60"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="item in vm.principal">
                            <td st-ratio="100" class="text-center">{{item.WorkCenter}}</td>
                            <td st-ratio="300" class="text-center">{{item.DescripTechnical}}</td>
                            <td st-ratio="80" class="text-center">{{item.CodEquipo}}</td>
                            <td st-ratio="80" class="text-center">{{item.Frecuencia}}</td>
                            <td st-ratio="80" class="text-center">{{item.PzsProduc}}</td>
                            <td st-ratio="80" class="text-center">{{item.Porcentaje}}</td>
                            <td st-ratio="80" class="text-center">{{item.UltimaEjec}}</td>
                            <td st-ratio="60" class="text-center">
                                <button type="button" class="btn btn-link" ng-click="openModalNotas(item)">
                                   <i class="fa fa-eye"></i>
                                </button>
                            </td>
                        </tr>
                        <tr ng-if="vm.principal.length == 0" class="nodata-row">
                            <td colspan="8" class="text-center">
                                <%=  this.GetCommonMessage("msgGridSinInformacion") %>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <br />
        <ui-modal modal="modalNotas">
            <div class="modal-dialog modal-lg" form="modalForm" style="width:1200px;">
              <div class="modal-content" ng-form="FormaActualizacion">
                <div class="modal-header">
                    <h4 style="color:#0069af;font-weight:600;opacity:.9;" class="al-title">{{tituloModal}}</h4>
                </div>

                <div class="modal-body" ng-class="{'submitted': submitted}" style="overflow:hidden">
                    <div class="row mb">
                        <div class="col-sm-3">                            
                            <h5 style="color:#0069af;font-weight:600;opacity:.9;" class="al-title">{{tituloDetalle}}</h5>
                        </div>
                    </div>
                    <div class="row mb">
                        <div class="col-sm-3">
                            <span style="color:#0069af"><%= this.GetMessage("TipoApoyo") %></span>
                        </div>
                    </div>
                    <div class="row mb">
                        <div class="col-sm-8">
                            <input type="text" ng-model="evidencia.NombreTipoEvidencia" class="control-label" style="width:500px" disabled />
                        </div>
                    </div>
                    <div class="row mb">
                        <div class="col-sm-3">
                            <span style="color:#0069af"><%= this.GetMessage("NombreEvidencia") %></span>
                        </div>
                    </div>
                    <div class="row mb">
                        <div class="col-sm-8">
                            <input type="text" ng-model="evidencia.NombreTipoApoyo" class="control-label" style="width:300px" disabled />
                        </div>
                    </div>                                   
                    <div class="row mb">
                        <div class="col-sm-3">
                            <h5 style="color:#0069af;font-weight:600;opacity:.9;" class="al-title">{{tituloEvidencias}}</h5>
                        </div>
                    </div>   
                    <div class="row mb">
                        <div class="col-sm-1"></div>
                        <div class="col-sm-10">
                            <div ui-table="vm.tipoApoyoEvidencia" st-fixed style="width: 100%;background-color:white;">
                                <table class="jsgrid-table"
                                    st-table="vm.tipoApoyoEvidencia" st-safe-src="vm.tipoApoyoEvidencia_">
                                    <thead>
                                        <tr style="background-color:white;">
                                            <th  style="background-color:white;"></th>
                                            <th ng-repeat="item in vm.tipoApoyoEvidencia"  style="background-color:white;"  ui-field width="30" ng-bind="item.NombreEvidencia"></th>                                          
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td width="30">Requerido:</td>
                                            <td ng-repeat="item in vm.tipoApoyoEvidencia" width="30" align="center">
                                                <input type="checkbox" ng-model="item.Requerido" ng-disabled ="item.Requerido" />
                                            </td>                                            
                                        </tr>
                                        <tr>
                                            <td width="30">Plantilla:</td>
                                            <td ng-repeat="item in vm.tipoApoyoEvidencia" width="30"  align="center">
                                                  <ex-fileupload ng-model="item.NombreArchivo" image-button="fa-upload"
                                                     download-button="fa-paperclip" on-success="setParametrosArchivo(response, item)"
                                                     options="fileOptionsDetalle" parameters="fileParameters" open-file="abrirDocumento(item)">
                                                  </ex-fileupload>                           
                                            </td>                                            
                                        </tr>
                                        <tr>
                                            <td width="30">Archivo:</td>
                                            <td ng-repeat="item in vm.tipoApoyoEvidencia" width="30" align="center">
                                                 {{item.NombreArchivo}}
                                            </td>                                      
                                        </tr>
                                        <tr ng-if="vm.tipoApoyoEvidencia.length == 0" class="nodata-row">
                                            <td colspan="3" class="text-center">
                                                <%=  this.GetCommonMessage("msgGridSinInformacion") %>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>     
                    </div>
                </div>

                <div class="modal-footer">                
                  <button type="button" class="btn btn-success" ng-click="guardar(FormaActualizacion)">
                      <%= this.GetCommonMessage("lblTooltipGuardar") %>
                  </button>
                  <button type="button" class="btn btn-red" data-dismiss="modal">
                       <%= this.GetMessage("lblTooltipCerrar") %>
                  </button>
                </div>
              </div>
            </div>
        </ui-modal>
        <script type="text/javascript" src="../Scripts/pages/inicioController.js?v=1.1<%=DateTime.Now.Millisecond %>"></script>
    </div>
</asp:Content>

