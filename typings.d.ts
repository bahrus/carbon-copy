import { RenderContext } from "../trans-render/init.d.js";

export interface BCC_WC{
    noclear: boolean;
    noshadow: boolean;
    from: string;
    viewModel: object;
    copy: boolean;
    renderContext: RenderContext
}