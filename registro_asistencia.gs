CODIGOS DE REGISTROS POR SEMESTRE UNIREGISTER QR

9NO DIURNO

const MATERIAS = {
  lunes: {
    '0-0': {				//HORA DE LA CLASE
      name: 'NOMBRE DE LA MATERIA',
      teacher: 'NOMBRE DEL DOCENTE'
    }
  },
  martes: {
    '0-0': {
      name: 'NOMBRE DE LA MATERIA',
      teacher: 'NOMBRE DEL DOCENTE'
    }
  },
  miercoles: {
    '0-0': {
      name: 'NOMBRE DE LA MATERIA',
      teacher: 'NOMBRE DEL DOCENTE'
    }      
  },
  jueves: {
    '0-0': {
      name: 'NOMBRE DE LA MATERIA',
      teacher: 'NOMBRE DEL DOCENTE'
    }
  },
  viernes: {
    '0-0': {
      name: 'NOMBRE DE LA MATERIA',
      teacher: 'NOMBRE DEL DOCENTE'
    }
  }
}

function doGet(e) {
  // Registramos la asistencia usando el correo y los parámetros que vienen en la URL
  registrarAsistencia(e.parameter.id, e.parameter.apellido, e.parameter.nombre, e.parameter.tdocumento, e.parameter.documento, e.parameter.correo,e.parameter.semestre, e.parameter.jornada, e.parameter.programa, e.parameter.ocupacion);

  var mail = e.parameter.correo;
  var asunto = "Registro de Asistencia UNIREGISTER QR";
  var mensaje = "Su asistencia ha sido registrada correctamente"; 
  GmailApp.sendEmail(mail, asunto, mensaje);
  
  // Damos retroalimentación sobre lo que sucedió con un HTML:
  return HtmlService.createHtmlOutput(`
   Asistencia registrada correctamente. <br><br>
   Fecha: ${new Date()}<br>
   Documento: ${e.parameter.documento}<br>
   Apellido: ${e.parameter.apellido}<br>
   Nombre: ${e.parameter.nombre}<br>
   Semestre: ${e.parameter.semestre}<br>
   Jornada: ${e.parameter.jornada}`);
}

const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

//Registrar docente y materia dependiendo del dia del registro
function getDayAndMatter(date) {
  if (!date) return;

  const options = { weekday: 'long' }
  let isValid = false;

  const day = new Intl.DateTimeFormat('es-ES', options).format(date)
  const dayFormat = removeAccents(day);
  const hours = date.getHours();

  let materia = 'REGISTRO NO AUTORIZADO'
  let teacher = 'PROFESOR NO ASIGNADO'

  if (MATERIAS[dayFormat]) {
    const ranges = Object.entries(MATERIAS[dayFormat])
    ranges.forEach(range => {
      const numRanges = range[0].split('-')
      const num1 = parseInt(numRanges[0])
      const num2 = parseInt(numRanges[1])

      if (hours >= num1 && hours <= (num2 - 1)) {
        isValid = true;

        materia = MATERIAS[dayFormat][range[0]].name
        teacher = MATERIAS[dayFormat][range[0]].teacher
      }
    })
  }

  return {
    isValid,
    day,
    materia,
    teacher
  }
}

function registrarAsistencia(id, apellido, nombre, tdocumento, documento, correo, semestre, jornada, programa, ocupacion) {
  // Se coloca el identificador del documento de hoja de cálculo
  const sheet = SpreadsheetApp.openById("IDENTIFICADOR DE LA HOJA DE ASISTENCIA");
  const asistencia = sheet.getSheetByName("NOMBRE DE LA HOJA DE ASISTENCIA");
  const lastRow = asistencia.getLastRow() + 1;
  const {isValid, day, materia, teacher} = getDayAndMatter(new Date())

  if (!isValid) return;

  // Se registran los datos de almacenados en la hoja de calculo en la plantilla de asistencia
  asistencia.getRange(lastRow, 1).setValue(id);
  asistencia.getRange(lastRow, 2).setValue(apellido);
  asistencia.getRange(lastRow, 3).setValue(nombre);
  asistencia.getRange(lastRow, 4).setValue(tdocumento);
  asistencia.getRange(lastRow, 5).setValue(documento);
  asistencia.getRange(lastRow, 6).setValue(correo);
  asistencia.getRange(lastRow, 7).setValue(semestre);
  asistencia.getRange(lastRow, 8).setValue(jornada);
  asistencia.getRange(lastRow, 9).setValue(programa);
  asistencia.getRange(lastRow, 10).setValue(ocupacion);
  asistencia.getRange(lastRow, 11).setValue(materia);
  asistencia.getRange(lastRow, 12).setValue(teacher);
  asistencia.getRange(lastRow, 13).setValue(day);
  asistencia.getRange(lastRow, 14).setValue(new Date());
  asistencia.getRange(lastRow, 15).setValue(new Date());
}

