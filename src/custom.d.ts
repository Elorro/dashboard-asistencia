// src/custom.d.ts

// ✅ SVG como imagen (por defecto)
declare module "*.svg" {
  const content: string;
  export default content;
}

// ✅ SVG como componente React (opcional)
declare module "*.svg?react" {
  import * as React from "react";
  const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  export default ReactComponent;
}

// ✅ Otros tipos de imágenes
declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.jpeg" {
  const content: string;
  export default content;
}

declare module "*.gif" {
  const content: string;
  export default content;
}
