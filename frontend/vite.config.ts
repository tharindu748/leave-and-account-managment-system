// // // import path from "path";
// // // import tailwindcss from "@tailwindcss/vite";
// // // import react from "@vitejs/plugin-react";
// // // import { defineConfig } from "vite";

// // // // https://vite.dev/config/
// // // export default defineConfig({
// // //   plugins: [react(), tailwindcss()],
// // //   resolve: {
// // //     alias: {
// // //       "@": path.resolve(__dirname, "./src"),
// // //     },
// // //   },
// // // });
// // import path from "path";
// // import tailwindcss from "@tailwindcss/vite";
// // import react from "@vitejs/plugin-react";
// // import { defineConfig } from "vite";

// // export default defineConfig({
// //   plugins: [react(), tailwindcss()],
// //   resolve: {
// //     alias: {
// //       "@": path.resolve(__dirname, "./src"),
// //     },
// //   },
// //   server: {
// //     proxy: {
// //       '/api': {
// //         target: 'http://localhost:3000',
// //         changeOrigin: true,
// //         secure: false,
// //       },
// //       '/salary': {  // ✅ Add this to handle /salary routes
// //         target: 'http://localhost:3000',
// //         changeOrigin: true,
// //         secure: false,
// //       },
// //     },
// //   },
// // });

// import path from "path";
// import tailwindcss from "@tailwindcss/vite";
// import react from "@vitejs/plugin-react";
// import { defineConfig } from "vite";

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   base: './',  // ← ADD THIS LINE
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:3000',
//         changeOrigin: true,
//         secure: false,
//       },
//       '/salary': {
//         target: 'http://localhost:3000',
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
//   build: {
//     outDir: 'dist',
//     assetsDir: 'assets'
//   }
// });
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react(), tailwindcss()],
    base: '/',
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
        '/auth': {
          target: env.VITE_API_BASE_URL || 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
        '/salary': {
          target: env.VITE_API_BASE_URL || 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets'
    }
  };
});