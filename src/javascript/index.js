$(document).ready(function () {

  function refrescarTabla() {
  
     $("#tablaSolicitudes").hide();
     $("#loadingMessage").show();
    $.ajax({
      url: "https://my-json-server.typicode.com/desarrollo-seguro/dato/solicitudes",
      method: "GET",
      success: function (datos) {
        const tabla = $("table tbody");
        tabla.empty(); // Limpiar la tabla

        datos.forEach((item) => {
          tabla.append(`
                          <tr data-id="${item.id}">
                              <td><span class="editItem">${item.nombre}</span></td>
                              <td><span class="editItem">${item.apellido}</span></td>
                              <td><button type="button" class="btn btn-default borrarBtn">Borrar</button></td>
                          </tr>
                      `);
        });
        $("#tablaSolicitudes").show();
        $("#loadingMessage").hide();
      },
      error: function(err) {
        console.error("Error al cargar los datos:", err);
        $("#loadingMessage").html("<h3>Error al cargar los datos</h3>");
      }
    });
  }

  $("#nombre, #apellido").on("input", function () {
    actualizarBotonGuardar();
  });

  $("#refrescarBtn").click(function () {
    refrescarTabla();
  });

  $("#nuevoBtn").click(function () {
    $("#formContainer").show();
    $("#id").val(0);
    $("#nombre").val('');
    $("#apellido").val('');
    $("#enviar").prop("disabled", true);
  });

  $(document).on("click", ".editItem", function () {

    const fila = $(this).closest("tr");
    const id = fila.data("id");
    const nombre = fila.find("td:eq(0)").text();
    const apellido = fila.find("td:eq(1)").text();

    // Rellenar el formulario 
    $("#id").val(id);
    $("#nombre").val(nombre);
    $("#apellido").val(apellido);

    $("#formContainer").show();
  });

  $("#enviar").click(function (event) {
    event.preventDefault();

    let envio = {};
    envio.id = $("#id").val();
    envio.nombre = $("#nombre").val();
    envio.apellido = $("#apellido").val();

    if (envio.id == 0) {
      $.ajax({
        url: "https://my-json-server.typicode.com/desarrollo-seguro/dato/solicitudes",
        method: "POST",
        data: JSON.stringify(envio),
        contentType: "application/json",
        success: function (data) {
          refrescarTabla();
        },
        error: function (err) {
          console.error("Error al guardar:", err);
        }
      });
    } else {
    
      $.ajax({
        url: "https://my-json-server.typicode.com/desarrollo-seguro/dato/solicitudes/" + envio.id, 
        method: "PUT",
        data: JSON.stringify(envio),
        contentType: "application/json",
        success: function (data) {
          refrescarTabla();
        },
        error: function (err) {
          console.error("Error al actualizar:", err);
        }
      });
    }
  
    $("#formContainer").hide();
  });

  $("#cancelar").on("click", function () {
    $("#formContainer").hide();
    refrescarTabla();
  });

  $(document).on("click", ".borrarBtn", function () {
    const id = $(this).closest("tr").data("id");

    $.ajax({
      url: "https://my-json-server.typicode.com/desarrollo-seguro/dato/solicitudes/" + id,
      method: "DELETE",
      success: function () {
        refrescarTabla();
      },
      error: function (err) {
        console.error("Error al eliminar:", err);
      }
    });
  });
});

function actualizarBotonGuardar() {
  const nombre = $("#nombre").val();
  const apellido = $("#apellido").val();

  // Si ambos campos tienen al menos 2 caracteres, habilitar el botón
  if (nombre.length >= 2 && apellido.length >= 2) {
    $("#enviar").prop("disabled", false);
  } else {
    $("#enviar").prop("disabled", true);
  }
}
