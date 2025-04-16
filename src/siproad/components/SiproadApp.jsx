import React from 'react'
import { SiproadProvider } from '../context/SiproadContext'
import { SiproadRouter } from '../routes/SiproadRouter'

import '../../index.css'

export const SiproadApp = () => {

  return (
    <SiproadProvider>
      <SiproadRouter/>
    </SiproadProvider>
  )
}
