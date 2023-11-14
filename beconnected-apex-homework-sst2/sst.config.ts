import type { SSTConfig } from 'sst'
import { MyStack } from './stacks/MyStack'
import ConfigStack from './stacks/ConfigStack'

export default {
  config: () => ({
    name: 'apex-homework',
    region: 'eu-central-1',
  }),
  stacks: (app) => {
    app.setDefaultFunctionProps({
      runtime: 'nodejs18.x',
      nodejs: {
        format: 'esm',
      },
    })
    app.stack(ConfigStack).stack(MyStack)
  },
} satisfies SSTConfig
