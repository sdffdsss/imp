import { createWebService } from 'oss-web-common'
import { useEnvironmentModel } from '@Src/hox'
import { _ } from 'oss-web-toolkits'

const requestTransforms = []
const responseTransforms = []
const {
  environment: env,
  environmentLoaded: envLoaded,
} = useEnvironmentModel.data
const { serviceDiscovery: baseUrl, timeout = 20000 } = env

requestTransforms.push((res) => {
  try {
    const { url, baseUrlType = '' } = res
    if (envLoaded && env && baseUrlType) {
      const {
        [baseUrlType]: { mode = '', direct: realurl = '', discover = '' },
        serviceDiscovery,
      } = env
      if (mode === 'direct') {
        res.url = `${realurl}${url}`
      } else if (mode === 'discover') {
        res.url = `${serviceDiscovery}/${discover}${url}`
      }
    }
    return res
  } catch (e) {
    return Promise.reject(e)
  }
})
responseTransforms.push(
  (response) => {
    if (
      response.ok &&
      response.data &&
      /.*\/sqlm.*?apply\/execute$/.test(response.config && response.config.url)
    ) {
      // sql下沉且包含数据
      const { data } = response.data && response.data.data
      if (Array.isArray(data)) {
        const updateData = data.map((item) => {
          const updateItem = {}
          for (const key of Object.keys(item)) {
            updateItem[_.camelCase(key)] = item[key]
          }
          return updateItem
        })
        response.data.data.data = updateData
      }
    }
    return response
  },
  (response) => {
    if (
      response.ok &&
      response.data &&
      /.*\/sqlm.*?apply\/executeIdList$/.test(
        response.config && response.config.url,
      )
    ) {
      // sql下沉且包含数据
      const data = response.data && JSON.parse(response.data.data)
      const sqlkeys = Object.keys(data)
      if (sqlkeys) {
        sqlkeys.forEach((value, index) => {
          let crrData = data[value].data.data
          crrData = crrData.map((item) => {
            const updateItem = {}
            for (const key of Object.keys(item)) {
              updateItem[_.camelCase(key)] = item[key]
            }
            return updateItem
          })
          data[value].data.data = crrData
        })
        response.data.data = JSON.stringify(data)
      }
    }
    return response
  },
)
const config = {
  timeout: timeout || '',
  contentType: 'application/json',
  withCredentials: false,
  responseTransforms: [],
  requestTransforms,
  baseUrl: '',
}
export default createWebService(config)
