import { FloatingLabelColor } from "flowbite-react";
import { FormValidationData } from "../../models/form-validation-data";

export function colorFromValidation(formValidationData: FormValidationData): FloatingLabelColor | undefined {
    return formValidationData.status ? 'default' : 'error';
}