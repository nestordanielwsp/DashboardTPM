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
    public partial class Inicio : BasePage
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

            this.FillCmb("sp_SelLinea", "LineaInfo");
            this.FillCmb("sp_SelDepto", "DeptoInfo");
            this.FillCmb("sp_SelEstatus", "EstatusInfo");

            // FIX:  controla el afectar la BD
            int esModificar = HttpContext.Current.Session["esCrearModificarInfo"] == null ? 0
                              : (HttpContext.Current.Session["esCrearModificarInfo"].ToString() == "False" ? 0 : 1);
            this.LoadJs("esCrearModificarInfo", esModificar.ToString());

            // FIX:  controla el afectar la BD
            int esAprobador = HttpContext.Current.Session["esAprobador"] == null ? 0
                              : (HttpContext.Current.Session["esAprobador"].ToString() == "False" ? 0 : 1);
            this.LoadJs("esAprobadorInfo", esAprobador.ToString());

            if (HttpContext.Current.Session["UsuarioId"] == null)
            {
                this.LoadJs("hasLogin", "0");
                this.LoadJs("tieneLinea", "'init'");
                this.LoadJs("tieneDepto", "'MATR'");
                this.LoadJs("tieneEstatus", "0");
            }
            else
            {
                this.LoadJs("hasLogin", "1");
                this.LoadJs("tieneLinea", "'"+ HttpContext.Current.Session["tieneLinea"].ToString() + "'" );
                this.LoadJs("tieneDepto", "'" + HttpContext.Current.Session["tieneDepto"].ToString() + "'"); 
                this.LoadJs("tieneEstatus", "0");
            }
        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod]
        static public Dictionary<string, object> GetInformacion(Dictionary<string, object> datos)
        {
            var page = new logic.BasePage();
            var a = new logic_acces(ConexionDB);
            var response = new Dictionary<string, object>();

            if(datos.ContainsKey("Depto"))
            {
                HttpContext.Current.Session["tieneDepto"] = datos["Depto"].ToString();
                if (datos["Linea"] == null || datos["Linea"].ToString() == "init")
                {
                    datos["Linea"] = "";
                }
                else
                {
                    HttpContext.Current.Session["tieneLinea"] = datos["Linea"].ToString();
                }
            }
            else
            {
                datos.Add("Depto", HttpContext.Current.Session["tieneDepto"].ToString() != "" ? HttpContext.Current.Session["tieneDepto"].ToString() : "MATR");
                if (!datos.ContainsKey("Linea"))
                {
                    datos.Add("Linea", HttpContext.Current.Session["tieneLinea"].ToString() == "init" ? "" : HttpContext.Current.Session["tieneLinea"].ToString());
                } 
                datos.Add("Estatus", HttpContext.Current.Session["tieneLinea"].ToString());
            }

            DataTable Dt1 = a.ExecuteQuery("sp_SelMonitorTPM_JE", datos).Tables[0];            
            //Response
            response["InformacionPrincipal"] = page.DataTableToMap(Dt1);

            datos["IdEquipo"] = 99999;

            DataTable Dt2 = a.ExecuteQuery("sp_SelMonitorTPM_JE", datos).Tables[0];
            //Response
            response["Resultado"] = page.DataTableToMap(Dt2);

            return response;

        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod]
        static public Dictionary<string, object> GetLinea(Dictionary<string, object> datos)
        {
            var page = new logic.BasePage();
            var a = new logic_acces(ConexionDB);
            var response = new Dictionary<string, object>();

            DataTable Dt1 = a.ExecuteQuery("sp_SelLinea", datos).Tables[0];
            //Response
            response["Linea"] = page.DataTableToMap(Dt1);

            return response;

        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod]
        static public Dictionary<string, object> GetCheckListxEqEnc(Dictionary<string, object> datos)
        {
            var page = new logic.BasePage();
            var a = new logic_acces(ConexionDB);
            var response = new Dictionary<string, object>();

            DataTable Dt1 = a.ExecuteQuery("sp_SelCheckListxEqEnc_JE", datos).Tables[0];
            //Response
            response["Resultado"] = page.DataTableToMap(Dt1);

            return response;

        }


        [WebMethod(EnableSession = true)]
        [ScriptMethod]
        static public Dictionary<string, object> GetCheckListxEqDet(Dictionary<string, object> datos)
        {
            var page = new logic.BasePage();
            var a = new logic_acces(ConexionDB);
            var response = new Dictionary<string, object>();

            DataTable Dt1 = a.ExecuteQuery("sp_SelCheckListxEqDet_JE", datos).Tables[0];
            //Response
            response["Resultado"] = page.DataTableToMap(Dt1);

            return response;

        }
         
        [WebMethod(EnableSession = true)]
        [ScriptMethod]
        public static Dictionary<string, object> Rechazar(Dictionary<string, object> datos)
        {
            var page = new Inicio();
            var response = new Dictionary<string, object>();
            response.Add("Error", "");

            datos.Add("NombreUser", HttpContext.Current.Session["Usuario"].ToString());
            datos.Add("User", HttpContext.Current.Session["CveUsuario"].ToString());

            var a = new logic_acces(ConexionDB); 
             
            if (response["Error"].ToString() == "")
            {
                using (TransactionScope scope = new TransactionScope())
                { 
                    a.ExecuteNonQuery("sp_RechazarMonitorTPM_JE", datos);
                    scope.Complete();
                }
            }

            return response;
        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod]
        public static Dictionary<string, object> Aprobar(Dictionary<string, object> datos)
        {
            var page = new Inicio();
            var response = new Dictionary<string, object>();
            response.Add("Error", "");

            datos.Add("NombreUser", HttpContext.Current.Session["Usuario"].ToString());
            datos.Add("User", HttpContext.Current.Session["CveUsuario"].ToString());

            var a = new logic_acces(ConexionDB);

            if (response["Error"].ToString() == "")
            {
                using (TransactionScope scope = new TransactionScope())
                {
                    a.ExecuteNonQuery("sp_AprobarMonitorTPM_JE", datos);
                    scope.Complete();
                }
            }

            return response;
        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod]
        public static Dictionary<string, object> Guardar(Dictionary<string, object> datos)
        {
            var page = new Inicio();
            var response = new Dictionary<string, object>();
            response.Add("Error", "");

            datos.Add("NombreUser", HttpContext.Current.Session["Usuario"].ToString());
            datos.Add("User", HttpContext.Current.Session["CveUsuario"].ToString());
            datos.Add("EsPreCaptura", "0");

            var IdChkEquipoOutput = "0";
            var a = new logic_acces(ConexionDB); 
            var tipoApoyoEvidencia = Utilities.StringToList(datos["tipoApoyoEvidencia"]); 

            foreach (var item in tipoApoyoEvidencia)
            {
                if(!item.ContainsKey("ResultVisual"))
                {
                    response["Error"]= "Favor de indicar el resultado para cada fila."; break;
                }
            }

            if (response["Error"].ToString() == "")
            {
                using (TransactionScope scope = new TransactionScope())
                {
                    datos.Add("IdChkEquipoOutput", 0);
                    a.ExecuteNonQuery("sp_InsCheckListCapEnc_JE", datos);
                    IdChkEquipoOutput = datos["IdChkEquipoOutput"].ToString();
                    foreach (var tipoApoyo in tipoApoyoEvidencia)
                    {
                        tipoApoyo["IdChkEquipo"] = IdChkEquipoOutput;
                        a.ExecuteNonQuery("sp_InsCheckListxEqDet_JE", tipoApoyo);
                    }
                    if(!datos.ContainsKey("IdChkEquipo"))
                    {
                        datos.Add("IdChkEquipo", IdChkEquipoOutput);
                    }
                    else
                    {
                        datos["IdChkEquipo"] = IdChkEquipoOutput;
                    }
                    a.ExecuteNonQuery("sp_UpdMonitorTPM_JE", datos);
                    scope.Complete();
                } 
            }
            
            return response; 
        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod]
        public static Dictionary<string, object> Previo(Dictionary<string, object> datos)
        {
            var page = new Inicio();
            var response = new Dictionary<string, object>();
            response.Add("Error", "");

            datos.Add("NombreUser", HttpContext.Current.Session["Usuario"].ToString());
            datos.Add("User", HttpContext.Current.Session["CveUsuario"].ToString());
            datos.Add("EsPreCaptura", "1");

            var IdChkEquipoOutput = "0";
            var a = new logic_acces(ConexionDB);
            var tipoApoyoEvidencia = Utilities.StringToList(datos["tipoApoyoEvidencia"]);
             
            if (response["Error"].ToString() == "")
            {
                using (TransactionScope scope = new TransactionScope())
                {
                    datos.Add("IdChkEquipoOutput", 0);
                    a.ExecuteNonQuery("sp_InsCheckListCapEnc_JE", datos);
                    IdChkEquipoOutput = datos["IdChkEquipoOutput"].ToString();
                    foreach (var tipoApoyo in tipoApoyoEvidencia)
                    {
                        tipoApoyo["IdChkEquipo"] = IdChkEquipoOutput;
                        a.ExecuteNonQuery("sp_InsCheckListxEqDet_JE", tipoApoyo);
                    }
                    if (!datos.ContainsKey("IdChkEquipo"))
                    {
                        datos.Add("IdChkEquipo", IdChkEquipoOutput);
                    }
                    else
                    {
                        datos["IdChkEquipo"] = IdChkEquipoOutput;
                    }
                    a.ExecuteNonQuery("sp_UpdMonitorPreCapturaTPM_JE", datos);
                    scope.Complete();
                }
            }

            return response;
        }
        [WebMethod(EnableSession = true)]
        [ScriptMethod]
        static public Dictionary<string, object> Salir(Dictionary<string, string> datos)
        {
            var page = new logic.BasePage();
            var a = new logic_acces(ConfigurationManager.ConnectionStrings["ConexionDB"].ToString());
            var response = new Dictionary<string, object>();
            HttpContext.Current.Session.Abandon();
            response["Data"] = true;
            return response;
        }



        [WebMethod(EnableSession = true)]
        [ScriptMethod]
        static public Dictionary<string, object> GetCheckListxEqEncPreCaptura(Dictionary<string, object> datos)
        {
            var page = new logic.BasePage();
            var a = new logic_acces(ConexionDB);
            var response = new Dictionary<string, object>();

            DataTable Dt1 = a.ExecuteQuery("sp_SelCheckListxEqEncPreCaptura_JE", datos).Tables[0];
            //Response
            response["Resultado"] = page.DataTableToMap(Dt1);

            return response;

        }


        [WebMethod(EnableSession = true)]
        [ScriptMethod]
        static public Dictionary<string, object> GetCheckListxEqDetPreCaptura(Dictionary<string, object> datos)
        {
            var page = new logic.BasePage();
            var a = new logic_acces(ConexionDB);
            var response = new Dictionary<string, object>();

            DataTable Dt1 = a.ExecuteQuery("sp_SelCheckListxEqDetPreCaptura_JE", datos).Tables[0];
            //Response
            response["Resultado"] = page.DataTableToMap(Dt1);

            return response;

        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod]
        static public Dictionary<string, object> GetCheckListxCapEncHistorico(Dictionary<string, object> datos)
        {
            var page = new logic.BasePage();
            var a = new logic_acces(ConexionDB);
            var response = new Dictionary<string, object>();

            DataTable Dt1 = a.ExecuteQuery("sp_HistoricoCheckListCapEnc_JE", datos).Tables[0];
            //Response
            response["Resultado"] = page.DataTableToMap(Dt1);

            return response;

        }


        [WebMethod(EnableSession = true)]
        [ScriptMethod]
        static public Dictionary<string, object> GetCheckListxEqEncNotasHistorico(Dictionary<string, object> datos)
        {
            var page = new logic.BasePage();
            var a = new logic_acces(ConexionDB);
            var response = new Dictionary<string, object>();

            DataTable Dt1 = a.ExecuteQuery("sp_SelCheckListxEqEncNotasHistorico_JE", datos).Tables[0];
            //Response
            response["Resultado"] = page.DataTableToMap(Dt1);

            return response;

        }
         
        [WebMethod(EnableSession = true)]
        [ScriptMethod]
        static public Dictionary<string, object> GetCheckListxEqDetNotasHistorico(Dictionary<string, object> datos)
        {
            var page = new logic.BasePage();
            var a = new logic_acces(ConexionDB);
            var response = new Dictionary<string, object>();

            DataTable Dt1 = a.ExecuteQuery("sp_SelCheckListxEqDetNotasHistorico_JE", datos).Tables[0];
            //Response
            response["Resultado"] = page.DataTableToMap(Dt1);

            return response;

        }

    }
}