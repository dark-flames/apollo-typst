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

// This is important for shiroa to produce a responsive layout
// and multiple targets.
#import "@preview/shiroa:0.1.0": get-page-width, target, is-web-target, is-pdf-target, plain-text
#import "theme.typ": *

#let page-width = get-page-width()
#let is-pdf-target = is-pdf-target()
#let is-web-target = is-web-target()

#let make-unique-label(it, disambiguator: 1) = label({
  let k = plain-text(it).trim()
  if disambiguator > 1 {
    k + "_d" + str(disambiguator)
  } else {
    k
  }
})

#let heading-reference(it, d: 1) = make-unique-label(it.body, disambiguator: d)

// The project function defines how your document looks.
// It takes your content and some metadata and formats it.
// Go ahead and customize it to your liking!
#let project(title: "Typst Book", authors: (), show-title: false, show-authors: false, body) = {

  // set basic document metadata
  set document(author: authors.map(a => a.name), title: title) if not is-pdf-target

  // set web/pdf page properties
  set page(
    numbering: none,
    number-align: center,
    width: page-width,
  )

  // remove margins for web target
  set page(
    margin: (
      // reserved beautiful top margin
      top: 20pt,
      // reserved for our heading style.
      // If you apply a different heading style, you may remove it.
      left: 20pt,
      // Typst is setting the page's bottom to the baseline of the last line of text. So bad :(.
      bottom: 0.5em,
      // remove rest margins.
      rest: 0pt,
    ),
    // for a website, we don't need pagination.
    height: auto,
  ) if is-web-target

  // set text and line style
  set text(font: main-font, size: 16pt, fill: main-color, lang: "en")
  set line(stroke: main-color)
  set table(stroke: main-color)

  let ld = state("label-disambiguator", (:))
  let update-ld(k) = ld.update(it => {
    it.insert(k, it.at(k, default: 0) + 1)
    it
  })
  let get-ld(loc, k) = make-unique-label(k, disambiguator: ld.at(loc).at(k))

  // render a dash to hint headings instead of bolding it.
  show heading: set text(weight: "regular") if is-web-target
  show heading: it => {
    block({
      if is-web-target {
        let title = plain-text(it.body).trim()
        update-ld(title)
        context (
          {
            let loc = here()
            let dest = get-ld(loc, title)
            let h = measure(it.body).height
            place(
              left,
              dx: -20pt,
              [
                #set text(fill: dash-color)
                #link(loc)[\#] #dest
              ],
            )
          }
        )
      }
      it
    })
  }

  // link setting
  show link: set text(fill: dash-color)

  // math setting
  show math.equation: set text(weight: 400)

  // code block setting
  show raw: it => {
    set text(font: code-font)
    if "block" in it.fields() and it.block {
      rect(
        width: 100%,
        inset: (x: 4pt, y: 5pt),
        radius: 4pt,
        fill: code-extra-colors.at("bg"),
        [
          #set text(fill: code-extra-colors.at("fg")) if code-extra-colors.at("fg") != none
          #set par(justify: false)
          #place(right, text(luma(110), it.lang))
          #it
        ],
      )
    } else {
      it
    }
  }

  if show-title {
    align(center)[ #block(text(weight: 700, 1.75em, title)) ]
  }

  if show-authors and authors.len() > 0 {
    // Author information.
    pad(
      top: 0.5em,
      bottom: 0.5em,
      x: 2em,
      grid(
        columns: (1fr,) * calc.min(3, authors.len()),
        gutter: 1em,
        ..authors.map(author => align(center)[
          *#author.name* \
          #author.email
        ]),
      ),
    )
  }

  // Main body.
  set par(justify: true)

  body
}

#let part-style = heading