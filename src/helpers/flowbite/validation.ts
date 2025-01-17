import { FormValidationData } from "../../models/form-validation-data";

export function colorFromValidation(formValidationData: FormValidationData): string | undefined {
    return formValidationData.status ? 'default' : 'danger';
}