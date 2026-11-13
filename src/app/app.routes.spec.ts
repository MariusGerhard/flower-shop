import { authGuard } from './auth/auth.guard';
import { routes } from './app.routes';

describe('routes', () => {
  const protectedGroup = routes.find((r) => r.canActivate?.includes(authGuard));
  const publicPaths = routes.filter((r) => r !== protectedGroup).map((r) => r.path);

  it('protects all shop, profile and admin pages with the auth guard', () => {
    const paths = protectedGroup?.children?.map((r) => r.path);
    expect(paths).toEqual(['shop', 'flowers', 'bouquets', 'orders', 'profile', 'control']);
  });

  it('keeps login, registration and legal pages public', () => {
    expect(publicPaths).toEqual(expect.arrayContaining(['', 'register', 'login', 'reset', 'notice', 'terms']));
  });

  it('redirects unknown paths to the home page', () => {
    expect(routes.at(-1)).toEqual({ path: '**', redirectTo: '' });
  });

  it('lazy loads every page except home', async () => {
    const lazy = [...routes, ...(protectedGroup?.children ?? [])].filter((r) => r.loadComponent);
    expect(lazy).toHaveLength(11);

    const components = await Promise.all(lazy.map((r) => r.loadComponent!()));
    components.forEach((c) => expect(c).toBeTypeOf('function'));
  });
});
