const fs = require('fs');
const path = require('path');

const apps = ['menu', 'credito', 'venta', 'inventario', 'nomina', 'proveedores', 'api-gateway'];

// 1. Root Files
const turboJson = {
    "$schema": "https://turbo.build/schema.json",
    "pipeline": {
        "build": {
            "outputs": [".next/**", "!.next/cache/**"]
        },
        "lint": {},
        "dev": {
            "cache": false,
            "persistent": true
        }
    }
};
fs.writeFileSync('turbo.json', JSON.stringify(turboJson, null, 2));

fs.writeFileSync('.gitignore', 'node_modules\n.turbo\n.next\ndist\n.env\n');

// 2. Apps
apps.forEach(app => {
    const dir = path.join('apps', app);
    const appDir = path.join(dir, 'app');

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(appDir)) fs.mkdirSync(appDir, { recursive: true });

    // package.json
    const appPackageJson = {
        "name": app,
        "version": "0.1.0",
        "private": true,
        "scripts": {
            "dev": "next dev",
            "build": "next build",
            "start": "next start"
        },
        "dependencies": {
            "next": "14.1.0",
            "react": "^18",
            "react-dom": "^18"
        },
        "devDependencies": {
            "@types/node": "^20",
            "@types/react": "^18",
            "@types/react-dom": "^18",
            "typescript": "^5"
        }
    };
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(appPackageJson, null, 2));

    // next.config.js
    fs.writeFileSync(path.join(dir, 'next.config.js'), '/** @type {import(\'next\').NextConfig} */\nconst nextConfig = {};\n\nmodule.exports = nextConfig;\n');

    // app/layout.tsx
    const layoutContent = `export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
`;
    fs.writeFileSync(path.join(appDir, 'layout.tsx'), layoutContent);

    // app/page.tsx
    const pageContent = `export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Hola Mundo</h1>
      <p>Servicio: <strong>${app}</strong></p>
      <p>Plataforma de despegue: <strong>Vercel</strong></p>
    </main>
  );
}
`;
    fs.writeFileSync(path.join(appDir, 'page.tsx'), pageContent);

    console.log(`Created ${app}`);
});

console.log('Setup complete!');
