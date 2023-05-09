import { describe, it, expect, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'

import { mount } from '@vue/test-utils'
import SpaceLayout from '../SpaceLayout.vue'

describe('SpaceLayout', () => {
  it('renders properly', () => {
    const wrapper = mount(SpaceLayout, {
      shallow: true,
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          })
        ],
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
