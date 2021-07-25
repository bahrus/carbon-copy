import {PropAction} from 'xtal-element/types.d.js';

export interface CCProps extends HTMLElement{
    /**
     * Id of template (with an optional context path in front of the id).  
     * If "from" starts with "./", the search for the matching template is done within the shadow DOM of the c-c element 
     * (or outside any ShadowDOM if the (b-)c-c element is outside any ShadowDOM).  If from starts with "../" then the search is done one level up, etc.
     */
    from: string | undefined;

    /**
    * Get template from previous sibling.
    */
    fromPrevSibling: boolean | undefined;
    /**
     * Must be set for anything to happen.
     */
    copy: boolean | undefined;
    /** No shadow DOM */
    noshadow: boolean | undefined;
    /** @private */
    templateToClone: HTMLTemplateElement | undefined;
    /** @private */
    clonedTemplate: DocumentFragment | undefined;
    /**
     * List of string properties to add to web component.
     */
    stringProps: string[] | undefined;
    /**
     * List of boolean properties to add to web component.
     */   
    boolProps: string[] | undefined;
    /**
     * List of numeric properties to add to web component.
     */
    numProps: string[] | undefined;
    /**
     * List of object properties to add to web component.
     */
    objProps: string[] | undefined;

    propActionsProp: PropAction[];

    styleTemplate: HTMLTemplateElement | undefined;

    ceName: string | undefined;
}