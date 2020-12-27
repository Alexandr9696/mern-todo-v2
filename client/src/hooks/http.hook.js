import {useCallback, useState} from 'react'

export const useHttp = () => {
  // загрузка
  const [loading, setLoading] = useState(false)
  // запрос
  const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
    setLoading(true)
    try {
      if (body) {
        // пребразование в строку JSON
        body = JSON.stringify(body)
        // header для работы с json
        headers['Content-Type'] = 'application/json'
      }
      // запрос на сервер
      const response = await fetch(url, {method, body, headers})
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'В запросе ошибка')
      }

      setLoading(false)


      return data
    } catch (e) {
      setLoading(false)
      throw e
    }
  }, [])


  return {loading, request}
}