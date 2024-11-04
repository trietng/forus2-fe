import { CustomFlowbiteTheme } from "flowbite-react";

export const customTheme: CustomFlowbiteTheme = {
    button: {
        color: {
            secondary: "text-white bg-secondary hover:brightness-90"
        }
    },
    modal: {
        header: {
            title: "text-xl font-medium text-white",
            close: {
                base: "ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-white hover:bg-black/10"
            }
        },
        content: {
            inner: "relative flex max-h-[90dvh] flex-col rounded-lg shadow bg-body-secondary"
        }
    },
    spinner: {
        color: {
            secondary: "fill-secondary"
        }
    },
    label: {
        root: {
            colors: {
                default: "text-white"
            }
        }
    }
}
