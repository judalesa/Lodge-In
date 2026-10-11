import { Component, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResenaService } from '../../../core/services/resena.service';

/** Formulario para que el huésped deje una reseña con calificación de 1 a 5 estrellas. */
@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-resena-form',
  styleUrl: './resena-form.css',
  templateUrl: './resena-form.html',
})
export class ResenaForm {
  private readonly resenaService = inject(ResenaService);

  /** Id del alojamiento al que pertenece la reseña (lo pasa el detalle). */
  readonly alojamientoId = input.required<number>();

  /** Límite de caracteres del comentario (se usa en el validador y en el contador). */
  protected readonly MAX_COMENTARIO = 500;

  /** Para dibujar las 5 estrellas con @for. */
  protected readonly estrellas = [1, 2, 3, 4, 5];

  /** Cada campo con sus validadores: si alguno falla, el formulario queda inválido. */
  protected readonly form = new FormGroup({
    usuario: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(40)],
    }),
    calificacion: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(5),
    ]),
    comentario: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10), Validators.maxLength(this.MAX_COMENTARIO)],
    }),
  });

  /** Texto del comentario como signal, para el contador "120 / 500". */
  protected readonly comentario = toSignal(this.form.controls.comentario.valueChanges, { initialValue: '' });

  /** Muestra el mensaje "¡Gracias por tu reseña!" después de publicar. */
  protected readonly enviada = signal(false);

  constructor() {
    // Si el usuario empieza a escribir otra reseña, se oculta el mensaje de gracias.
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.enviada.set(false));
  }

  /** Clic en una estrella: guarda esa calificación en el formulario. */
  protected calificar(n: number): void {
    this.form.controls.calificacion.setValue(n);
    this.form.controls.calificacion.markAsTouched();
  }

  /** ¿Mostrar el error de este campo? Solo si es inválido y el usuario ya pasó por él. */
  protected tieneError(campo: 'usuario' | 'calificacion' | 'comentario'): boolean {
    const control = this.form.controls[campo];
    return control.invalid && control.touched;
  }

  /** Publica la reseña. El ResenaService la guarda y el detalle la muestra de primera. */
  protected publicar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // muestra todos los errores de una vez
      return;
    }
    const { usuario, calificacion, comentario } = this.form.getRawValue();
    this.resenaService.agregar(this.alojamientoId(), usuario, calificacion!, comentario);
    this.form.reset();
    this.enviada.set(true);
  }
}
