import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vite.dev/config/
export default defineConfig({

    server: {
      port: 5173, // specify the port explicitly
      host: true,  // binds to all interfaces (useful for deployment)
    },
  
  plugins: [    
    react()],
})
