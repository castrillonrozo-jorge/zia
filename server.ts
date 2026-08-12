import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;
  const distPath = path.join(process.cwd(), 'dist');
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json());

  console.log(`Starting server in ${isProduction ? 'production' : 'development'} mode...`);

  // API routes FIRST
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', mode: isProduction ? 'production' : 'development' });
  });

  // Tools configuration matches what was in App.tsx
  const getExchangeRateTool: FunctionDeclaration = {
    name: "getExchangeRate",
    description: "Obtiene la tasa de cambio actual del BCV (USD a VED).",
    parameters: {
      type: Type.OBJECT,
      properties: {
        currency: { type: Type.STRING, description: "La moneda a consultar, por defecto USD." }
      }
    }
  };

  const getProcedureStatusTool: FunctionDeclaration = {
    name: "getProcedureStatus",
    description: "Consulta el estado actual de un trámite gubernamental (SAIME, INTT, etc).",
    parameters: {
      type: Type.OBJECT,
      properties: {
        procedureId: { type: Type.STRING, description: "El ID del trámite a consultar." }
      },
      required: ["procedureId"]
    }
  };

  const navigateAppTool: FunctionDeclaration = {
    name: "navigateApp",
    description: "Navega a una sección específica de la aplicación.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        view: { type: Type.STRING, description: "El nombre de la vista a la que navegar." }
      },
      required: ["view"]
    }
  };

  const calculateTaxTool: FunctionDeclaration = {
    name: "calculateTax",
    description: "Calcula el impuesto (ISLR/IVA) para un monto dado.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        amount: { type: Type.NUMBER, description: "El monto base para el cálculo." },
        taxType: { type: Type.STRING, description: "El tipo de impuesto (IVA o ISLR)." }
      },
      required: ["amount", "taxType"]
    }
  };


  if (isProduction) {
    // Serve static files from the dist directory
    app.use(express.static(distPath));

    // Handle SPA routing: serve index.html for all non-static requests
    // In Express 5, use *all to match everything
    app.get('*all', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Build artifacts not found. Please run build first.');
      }
    });
  } else {
    // Vite middleware for development
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.error('Vite not found, falling back to static serving if possible');
      // If we can't start Vite and dist doesn't exist, we're in trouble
      if (!fs.existsSync(distPath)) {
        throw new Error('Vite not found and no build artifacts available.');
      }
    }
  }

}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
