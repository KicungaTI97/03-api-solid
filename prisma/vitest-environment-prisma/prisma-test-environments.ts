import { prisma } from '@/lib/prisma';
import 'dotenv/config';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import type { Environment } from 'vitest/environments';

function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.');
  }

  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set('schema', schema);

  return url.toString();
}

export default (<Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    const schema = randomUUID();
    const databaseUrl = generateDatabaseUrl(schema);
    console.log('✅ Environment carregado com sucesso!');

    process.env.DATABASE_URL = databaseUrl;

    const prismaBinary = './node_modules/prisma/build/index.js';

    try {
      execSync(`${process.execPath} ${prismaBinary} migrate deploy`, {
        env: {
          ...process.env,
          DATABASE_URL: databaseUrl,
        },
      });
    } catch (err: any) {
      console.error('Erro ao executar migrations', err);
      if (err.stdout) console.error(err.stdout.toString());
      if (err.stderr) console.error(err.stderr.toString());
      throw err;
    }

    return {
      async teardown() {
        try {
          //Deletar o schema criado
          await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
        } catch (err) {
          console.error('Erro ao deletar o schema', err);
        } finally {
          //Desconectar sempre, mesmo que houver erro
          await prisma.$disconnect();
        }
      },
    };
  },
});
