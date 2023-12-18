import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import qs from 'qs'
import merge from 'lodash/merge'
import { clearLoginInfo } from '@/utils'

const http = axios.create({
  timeout: 1000 * 30,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

/**
 * request interception
 */
http.interceptors.request.use(config => {
  config.headers['token'] = Vue.cookie.get('token') // request header with token
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * response interception
 */
http.interceptors.response.use(response => {
  if (response.data && response.data.code === 401) { // 401, token failure
    clearLoginInfo()
    router.push({ name: 'login' })
  }
  return response
}, error => {
  return Promise.reject(error)
})

/**
 * Request address processing
 * @param {*} actionName action method name
 */
http.adornUrl = (actionName) => {
  // In a non-production environment with proxy enabled, the unified prefix for interfaces will use [/proxyApi/] for proxy interception.
  return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi/' : window.SITE_CONFIG.baseUrl) + actionName
}

/**
 * get request parameter processing
 * @param {*} params parameter object
 * @param {*} openDefultParams Do you want to enable default parameters?
 */
http.adornParams = (params = {}, openDefultParams = true) => {
  var defaults = {
    't': new Date().getTime()
  }
  return openDefultParams ? merge(defaults, params) : params
}

/**
 * post request data processing
 * @param {*} data data object
 * @param {*} openDefultdata Do you want to enable default data?
 * @param {*} contentType Data Format
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http.adornData = (data = {}, openDefultdata = true, contentType = 'json') => {
  var defaults = {
    't': new Date().getTime()
  }
  data = openDefultdata ? merge(defaults, data) : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

export default http
