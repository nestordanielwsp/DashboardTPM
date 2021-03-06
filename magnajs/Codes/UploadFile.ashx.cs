using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Transactions;
using System.Web;
using logic;
using System.Web.Script.Serialization;
using Infraestructura.Archivos;
using System.Text.RegularExpressions;
using RestSharp.Extensions;

namespace magnajs.Codes
{
    /// <summary>
    /// Summary description for UploadFile
    /// </summary>
    public class UploadFile : IHttpHandler, System.Web.SessionState.IRequiresSessionState
    {
        public void ProcessRequest(HttpContext context)
        {
            var datos = new Dictionary<string, object>();
            var serializer = new JavaScriptSerializer { MaxJsonLength = 2147483644 };
            var storage = new AlmacenamientoAzureServicio();
            context.Response.ContentType = "text/json";
            try
            {
                HttpPostedFile archivo = context.Request.Files[0];
                var nombreArchivo = archivo.FileName;
                var folder = context.Request["Folder"];
                var rutaArchivo = ConfigurationManager.AppSettings["CarpetaArchivos"] + folder + "/";

                datos["UID"] = Guid.NewGuid().ToString().Substring(1, 7) + "_";
                datos["NombreArchivo"] = datos["UID"] + nombreArchivo;

                datos["EsNuevo"] = true;

                rutaArchivo += datos["NombreArchivo"];

                string folderName = AppDomain.CurrentDomain.BaseDirectory;
                var root = Path.Combine(folderName, rutaArchivo);

                File.WriteAllBytes(root, archivo.InputStream.ReadAsBytes());
                // storage.Guardar(archivo.InputStream, rutaArchivo);


            }
            catch (Exception ex)
            {
                datos["Error"] = ex.Message;
            }
            context.Response.Write(serializer.Serialize(datos));
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}