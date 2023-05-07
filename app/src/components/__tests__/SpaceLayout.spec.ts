import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import SpaceLayout from '../SpaceLayout.vue'

describe('SpaceLayout', () => {
  it('renders properly', () => {
    const wrapper = mount(SpaceLayout)
    expect(wrapper.exists()).toBe(true)
  })
})
