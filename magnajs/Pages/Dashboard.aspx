<%@ Page Title="" Language="C#" MasterPageFile="~/includes/magnajs.Master" AutoEventWireup="true" CodeBehind="Dashboard.aspx.cs" Inherits="magnajs.Pages.Dashboard" %>

<asp:Content ID="Content1" ContentPlaceHolderID="main" runat="server">
    <div class="view dashboard" ng-controller="dashboardController as vm" style="margin-top: 0px;">
        <h1>{{vm.titulo}}</h1>
        <div id="Home" class="mail-box padding-10 wrapper border-bottom" style="margin-top: 0px;">           
            <br />
            <div class="table-responsive" style="overflow-x: hidden; overflow-y: hidden; margin-top: 50px;">
                <!-- table start -->
                <div class="row">
                    <div class="col-sm-1"></div>
                    <div class="col-sm-4">
                        <canvas id="myChart" style="width: 100px; height: 100px"></canvas>
                    </div>
                    <div class="col-sm-1"></div>
                    <div class="col-sm-5">
                        <canvas id="myChart2" style="width: 200px; height: 160px"></canvas>
                    </div>
                </div>
                <br />
                <div class="row">
                    <div class="col-sm-1"></div>
                    <div class="col-sm-4">
                        <canvas id="myChart3" width="150" height="160"></canvas>
                    </div>
                    <div class="col-sm-1"></div>
                    <div class="col-sm-5">
                        <!--Grafica 4-->
                    </div>
                </div>
                <br />
                <!-- table ends -->
            </div>
        </div>
        <br />
        <script type="text/javascript" src="../Scripts/pages/dashBoardController.js?v=1.1<%=DateTime.Now.Millisecond %>"></script>
    </div>    
</asp:Content>
