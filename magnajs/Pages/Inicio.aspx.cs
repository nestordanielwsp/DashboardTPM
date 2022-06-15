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


        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod]
        static public Dictionary<string, object> GetInformacion(Dictionary<string, object> datos)
        {
            var page = new logic.BasePage();
            var a = new logic_acces(ConexionDB);
            var response = new Dictionary<string, object>();          

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
        public static Dictionary<string, object> Guardar(Dictionary<string, object> datos)
        {
            var page = new Inicio();
            var rutaArchivos = ConfigurationManager.AppSettings["CarpetaArchivos"] +
                                   page.GetMessage("folderArchivos") + "/";

            var a = new logic_acces(ConexionDB);

            Utilities.DeleteFiles(rutaArchivos, 2);

            using (TransactionScope scope = new TransactionScope())
            {

                var informacionPrincipal = Utilities.StringToList(datos["InformacionPrincipal"]);

                foreach (var dato in informacionPrincipal)
                {

                    if (dato.ContainsKey("cve_alerta_calidad"))
                    {
                        dato["Usuario"] =  HttpContext.Current.Session["CveUsuario"].ToString();

                        a.ExecuteNonQuery("sp_FR_AlertaCalidadArchivos_IU", dato);

                        //var archivo = new Dictionary<string, object>();
                        //archivo.Add("RutaArchivo", dato["ra_acciones_correctivas"]);
                        //archivo.Add("UID", dato["UID_acciones_correctivas"]);
                        //archivo.Add("EsArchivoNuevo", dato["EsArchivoNuevo_acciones_correctivas"]);

                        //if (Utilities.GetBool(archivo, "EsArchivoNuevo"))
                        //{                            
                        //Cambia el archivo a la carpeta definitiva   
                        // Utilities.MoveFiles(nombrearchivo, path2, archivo, "RutaArchivo");
                        //Utilities.MoveFileToDateDirectory(rutaArchivos, archivo, "ArchivoId", "Archivos");
                        //}


                    }
                }

                scope.Complete();
            }

            var response = new Dictionary<string, object>();
            DataTable Dt1 = a.ExecuteQuery("sp_FR_GetList_AlertaCalidad", datos).Tables[0];

            //Response
            response["InformacionPrincipal"] = page.DataTableToMap(Dt1);
            return response;
            //return datos;
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

       


    }
}