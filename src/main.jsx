import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

import { SiproadApp } from './siproad/components/SiproadApp';

createRoot(document.getElementById('root')).render(
  
  <BrowserRouter>
    <SiproadApp/>    
  </BrowserRouter>
)