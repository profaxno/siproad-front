import React, { useEffect } from 'react'
import { useState } from 'react'

const localCache = {};

export const useFetch = (url) => {

  const initObj = {
    data: null,
    isLoading: true,
    hasError: false,
    error: null
  }

  const [state, setState] = useState(initObj)

  useEffect(() => {
    getFetch();
  }, [url])
  

  const setLoadingState = () => {
    setState({
      data: null,
      isLoading: true,
      hasError: false,
      error: null
    });
  }

  const getFetch = async () => {

    if (localCache[url]) {
      console.log('data from cache');
      setState({
        data: localCache[url],
        isLoading: false,
        hasError: false,
        error: null
      });

      return;
    }

    setLoadingState();

    const response = await fetch(url);

    // * sleep
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (!response.ok) {
      setState({
        data: null,
        isLoading: false,
        hasError: true,
        error: {
          status: response.status,
          statusText: response.statusText
        }
      });

      return;
    }

    const data = await response.json();

    setState({
      data,
      isLoading: false,
      hasError: false,
      error: null
    });
    
    localCache[url] = data;
  }

  return {
    data: state.data,
    isLoading: state.isLoading,
    hasError: state.hasError
  }
}
