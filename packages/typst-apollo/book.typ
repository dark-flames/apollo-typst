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
 
#import "@preview/shiroa:0.1.0": *
#import "./pages.typ": project, part-style

#let _page-project = project

#let _resolve-inclusion-state = state("_resolve-inclusion", none)

#let resolve-inclusion(inc) = _resolve-inclusion-state.update(it => inc)

#let project(title: "", authors: (), spec: "", content) = {
  // Set document metadata early
  set document(
    author: authors,
    title: title,
  )

  // Inherit from gh-pages
  show: _page-project

  if title != "" {
    heading(title)
  }

  locate(loc => {
    let inc = _resolve-inclusion-state.final(loc)
    external-book(spec: inc(spec))

    let mt = book-meta-state.final(loc)
    let styles = (inc: inc, part: part-style, chapter: it => it)

    if mt != none {
      mt.summary.map(it => visit-summary(it, styles)).sum()
    }
  })

  content
}