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
    },
    breadcrumb: {
        item: {
            href: {
                off: "flex items-center text-sm font-medium text-gray-400",
                on: "flex items-center text-sm font-medium text-gray-400 hover:text-white"
            },
        }
    },
    tabs: {
        tablist: {
            variant: {
                underline: "border-b-0 gap-x-4 px-4"
            },
            tabitem: {
                variant: {
                    underline: {
                        active: {
                            off: "text-primary hover:text-secondary rounded-t-none border-b-2 border-primary hover:border-secondary",
                            on: "text-secondary hover:text-secondary/80 rounded-t-none border-b-2 border-secondary hover:border-secondary/80",
                        }
                    }
                }
            }
        },
        tabpanel: "py-3 min-h-80"
    }
}
