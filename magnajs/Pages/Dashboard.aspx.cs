using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using System.Configuration;
using System.Data;
using System.Drawing;
using System.IO;
using logic;
using magnajs.Codes;
using logic.Class;
using System.Transactions;
using Infraestructura.Archivos;
using Newtonsoft.Json;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Text;
using System.Threading.Tasks;

namespace magnajs.Pages
{
    public partial class Dashboard : BasePage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            this.LoadJs("LoggeadoInfo", "false");

            if (HttpContext.Current.Session["UsuarioId"] != null)
            {
                this.LoadJs("UsuarioIdInfo", HttpContext.Current.Session["UsuarioId"].ToString());

                if (HttpContext.Current.Session["UsuarioId"].ToString() != "")
                {
                    this.LoadJs("LoggeadoInfo", "true");
                }
            }

        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod]
        static public Dictionary<string, object> GetGrafica1(Dictionary<string, object> datos)
        {
            var page = new logic.BasePage();
            var a = new logic_acces(ConexionDB);
            var response = new Dictionary<string, object>();

            datos["IdEquipo"] = 1;
            DataTable Dt1 = a.ExecuteQuery("sp_SelMonitorTPM_JE", datos).Tables[0];
            response["InformacionPrincipal"] = page.DataTableToMap(Dt1);

            return response;

        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod]
        static public Dictionary<string, object> GetGrafica2(Dictionary<string, object> datos)
        {
            var page = new logic.BasePage();
            var a = new logic_acces(ConexionDB);
            var response = new Dictionary<string, object>();

            //if (pIdEquipo != 0) BD.CreateParameter("@IdEquipo", pIdEquipo);
            //if (pIdLinea != "") BD.CreateParameter("@Linea", pIdLinea, 8000);
            //if (pDepto != "") BD.CreateParameter("@Depto", pDepto, 10);

            datos["IdEquipo"] = 2;
            DataTable Dt1 = a.ExecuteQuery("sp_SelMonitorxLineaTPM_JE", datos).Tables[0];
            response["InformacionPrincipal"] = page.DataTableToMap(Dt1);

            return response;

        }


        [WebMethod(EnableSession = true)]
        [ScriptMethod]
        static public Dictionary<string, object> GetGrafica3(Dictionary<string, object> datos)
        {
            var page = new logic.BasePage();
            var a = new logic_acces(ConexionDB);
            var response = new Dictionary<string, object>();

            datos["IdEquipo"] = 3;
            DataTable Dt1 = a.ExecuteQuery("sp_SelMonitorTPM_JE", datos).Tables[0];
            response["InformacionPrincipal"] = page.DataTableToMap(Dt1);

            return response;

        }


    }
}