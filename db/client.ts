import { MikroORM } from '@mikro-orm/mongodb';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

let orm: MikroORM | null = null;

export async function initORM() {
    if (orm) return orm;
    if (!process.env.MONGODB_URI)
        throw new Error('MONGODB_URI environment variable is not set');

    const prefix = process.env.VERCEL_ENV === 'production' ? 'prod' : 'dev';

    orm = await MikroORM.init({
        entities: ['./dist/'],
        clientUrl: process.env.MONGODB_URI,
        dbName: `${prefix}_next_web`,
        metadataProvider: TsMorphMetadataProvider,
        debug: process.env.VERCEL_ENV !== 'production',
    });
    return orm;
}

/**
 * Use `getEm()` inside server code (API routes, server components) to get a forked EntityManager.
 */
export async function getEm() {
    const ormInstance = await initORM();
    return ormInstance.em.fork();
}

export async function closeORM() {
    if (!orm) return;
    await orm.close(true);
    orm = null;
}
