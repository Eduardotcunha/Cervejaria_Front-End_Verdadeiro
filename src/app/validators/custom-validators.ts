// src/app/validators/custom-validators.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador Customizado para CPF.
 * Garante que o CPF tem 11 dígitos e é matematicamente válido.
 */
export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cpf = control.value;

    if (!cpf) {
      return null; // Não valida se o campo estiver vazio (deixamos o Validators.required cuidar disso)
    }

    // Remove caracteres não numéricos
    const cleanedCpf = cpf.replace(/[^\d]/g, '');

    if (cleanedCpf.length !== 11) {
      return { cpfInvalid: true, message: 'O CPF deve conter 11 dígitos.' };
    }

    // Verifica se todos os dígitos são iguais (inválido por padrão do CPF)
    if (/^(\d)\1{10}$/.test(cleanedCpf)) {
      return { cpfInvalid: true, message: 'CPF com dígitos repetidos é inválido.' };
    }

    let sum;
    let remainder;
    
    // **1º Dígito Verificador**
    sum = 0;
    for (let i = 1; i <= 9; i++) {
      sum = sum + parseInt(cleanedCpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cleanedCpf.substring(9, 10))) {
      return { cpfInvalid: true, message: 'CPF inválido (primeiro dígito verificador).' };
    }

    // **2º Dígito Verificador**
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum = sum + parseInt(cleanedCpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cleanedCpf.substring(10, 11))) {
      return { cpfInvalid: true, message: 'CPF inválido (segundo dígito verificador).' };
    }

    return null; // CPF é válido
  };
}