import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API está funcionando!' });
});

/**TO-DO:
 * criar controller para sites
 * criar service para sites
 * criar DTO para sites
 * e remover o código abaixo
 */

// Rota para listar sites
app.get('/api/sites', async (req, res) => {
  try {
    const sites = await prisma.site.findMany();
    res.json(sites);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar sites' });
  }
});


// Iniciar o servidor
app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
}); 