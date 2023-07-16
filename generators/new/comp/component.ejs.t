---
to: "src/components/<%= type %>/<%= h.inflection.camelize(name) %>/<%= h.inflection.camelize(name) %>.tsx"
---
import { ReactNode } from 'react'
import styles from './<%= h.inflection.camelize(name) %>.module.css'

export interface <%= h.inflection.camelize(name) %>Props {
  children: ReactNode
}

export default function <%= h.inflection.camelize(name) %>(props: <%= h.inflection.camelize(name) %>Props) {
  return <div className={styles.base}>Component</div>
}
