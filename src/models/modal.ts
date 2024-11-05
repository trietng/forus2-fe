export type ModalMode = "create" | "update" | "delete" | null;

export interface ModalData {
    open: boolean;
    mode: ModalMode;
    keys?: {
        header: string;
        submitButton: string;
    }
}