import { TaroPlatformBase } from '@tarojs/shared'
import { Template } from './template'
import { components } from './components'

const PROJECT_JSON = 'project.swan.json'

export default class Swan extends TaroPlatformBase {
  platform = 'swan'
  globalObject = 'swan'
  projectConfigJson = PROJECT_JSON
  fileType = {
    templ: '.swan',
    style: '.css',
    config: '.json',
    script: '.js',
    xs: '.sjs'
  }

  template = new Template()

  /**
   * 调用 mini-runner 开启编译
   */
  async start () {
    this.setup()
    this.generateProjectConfig(this.projectConfigJson, PROJECT_JSON)
    this.modifyComponents()
    this.modifyWebpackChain()

    const runner = await this.getRunner()
    const options = this.getBaseOptions()
    runner(options)
  }

  /**
   * 增加组件或修改组件属性
   */
  modifyComponents () {
    const { internalComponents } = this.template
    const { recursiveMerge } = this.ctx.helper

    recursiveMerge(internalComponents, components)
  }

  /**
   * 修改 webpack 配置
   */
  modifyWebpackChain () {
    this.ctx.modifyWebpackChain(({ chain }) => {
      const { taroJsComponents } = this.helper
      chain.resolve.alias.set(taroJsComponents + '$', '@tarojs/plugin-platform-swan/dist/components-react.js')
    })
  }
}