#import "@preview/shiroa:0.1.0": target


// Theme (Colors)
#let theme-target = if target.contains("-") { target.split("-").at(1) } else { "light" }
#let theme-style = toml("theme-style.toml").at(theme-target)

#let is-dark-theme = theme-style.at("color-scheme") == "dark"
#let is-light-theme = not is-dark-theme

#let main-color = rgb(theme-style.at("main-color"))
#let dash-color = rgb(theme-style.at("dash-color"))


#let main-font = (
  "Charter",
  "Source Han Serif SC",
  "Source Han Serif TC",
  "Linux Libertine",
)

#let code-font = (
  "BlexMono Nerd Font Mono",
  "DejaVu Sans Mono",
)

#let code-theme-file = theme-style.at("code-theme")

#let code-extra-colors = if code-theme-file.len() > 0 {
  let data = xml(theme-style.at("code-theme")).at(1)

  let find-child(elem, tag) = {
    elem.children.find(e => "tag" in e and e.tag == tag)
  }

  let find-kv(elem, key, tag) = {
    let idx = elem.children.position(e => "tag" in e and e.tag == "key" and e.children.first() == key)
    elem.children.slice(idx).find(e => "tag" in e and e.tag == tag)
  }

  let plist-dict = find-child(data, "dict")
  let plist-array = find-child(plist-dict, "array")
  let theme-setting = find-child(plist-array, "dict")
  let theme-setting-items = find-kv(theme-setting, "settings", "dict")
  let background-setting = find-kv(theme-setting-items, "background", "string")
  let foreground-setting = find-kv(theme-setting-items, "foreground", "string")
  (
    bg: rgb(background-setting.children.first()),
    fg: rgb(foreground-setting.children.first()),
  )
} else {
  (
    bg: rgb(239, 241, 243),
    fg: none,
  )
}