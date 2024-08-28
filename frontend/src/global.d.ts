/********************************************************************************
 * This file includes code from the shiroa (https://github.com/Myriad-Dreamin/shiroa),
 * which is licensed under the Apache License, Version 2.0.
 *
 * Original code by:
 * Myriad-Dreamin  (https://github.com/Myriad-Dreamin)
 *
 * Copyright (c) 2023 shiroa Developers
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ********************************************************************************/

import { TypstSvgRenderer } from '@myriaddreamin/typst.ts/dist/esm/renderer';

declare global {
  interface Window {
    layoutText: any;
    typstPathToRoot: string | undefined;
    typstGetRelatedElements: any;
    handleTypstLocation: any;
    getTypstTheme(): string;
    captureStack(): any;
    typstRerender?: (responsive?: boolean) => void;
    typstCheckAndRerender?: (responsive: boolean, stack?: any) => Promise<void>;
    typstChangeTheme?: () => Promise<void>;
    debounce<T extends { (...args: any[]): void }>(fn: T, delay?: number): T;
    assignSemaHash: (u: number, x: number, y: number) => void;
    typstProcessSvg: any;
    typstBookRenderPage(
      plugin: TypstSvgRenderer,
      relPath: string,
      appContainer: HTMLDivElement | undefined,
    ): void;
    typstBindSvgDom(elem: HTMLDivElement, dom: SVGSVGElement): void;
    TypstRenderModule: any;
    updateScale: () => void;
    calcScale: (appWidth: number) => number;
  }
}
