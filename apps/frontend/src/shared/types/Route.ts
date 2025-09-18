import type { RouteRecordRaw } from 'vue-router'

export interface Route extends Omit<RouteRecordRaw, never> {
  icon?: string
  bottom?: boolean
}
