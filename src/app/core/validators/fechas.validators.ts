import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Fecha de hoy (hora local del usuario) como 'yyyy-MM-dd', el mismo formato de un campo de fecha.
 * Ej.: 11 de octubre de 2026 → '2026-10-11'.
 */
export function hoyISO(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // getMonth() va de 0 a 11
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

/**
 * Validador de UN campo (RN-02): la fecha no puede ser anterior a hoy.
 * Error: { fechaPasada: true }. Si el campo está vacío no opina (de eso se encarga Validators.required).
 */
export function fechaNoPasada(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const fecha: string = control.value;
    if (!fecha) {
      return null;
    }
    // Con el formato 'yyyy-MM-dd' las fechas se pueden comparar como texto.
    return fecha < hoyISO() ? { fechaPasada: true } : null;
  };
}

/**
 * Validador de GRUPO (RN-01): la salida debe ser después de la llegada.
 * Va en el FormGroup porque necesita mirar dos campos a la vez.
 * Error: { rangoInvalido: true }. Si falta alguna de las dos fechas no opina.
 */
export function rangoFechas(campoLlegada = 'llegada', campoSalida = 'salida'): ValidatorFn {
  return (grupo: AbstractControl): ValidationErrors | null => {
    const llegada: string = grupo.get(campoLlegada)?.value;
    const salida: string = grupo.get(campoSalida)?.value;
    if (!llegada || !salida) {
      return null;
    }
    return salida <= llegada ? { rangoInvalido: true } : null;
  };
}
