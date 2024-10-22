import { FormValidationData } from "../../models/form-validation-data";

interface ValidationMessageProps {
    formValidationData: FormValidationData;
    className?: string;
}

export function ValidationMessage(props: ValidationMessageProps) {
    return (
        <div className={'text-red-500 text-xs' + (props.className ? ' ' + props.className : '')}>
            {props.formValidationData.status ? '\u00A0' : props.formValidationData.message}
        </div>
    );
}