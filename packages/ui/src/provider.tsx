'use client';

import { SidebarProvider } from 'fumadocs-core/sidebar';
import { ThemeProvider } from 'next-themes';
import { type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { DirectionProvider } from '@radix-ui/react-direction';
import { SidebarCollapseProvider } from '@/contexts/sidebar';
import { DefaultSearchDialogProps } from '@/components/dialog/search-default';
import { SearchProvider, type SearchProviderProps } from './contexts/search';
import type { ThemeProviderProps } from 'next-themes/dist/types';

interface SearchOptions
  extends Omit<SearchProviderProps, 'options' | 'children'> {
  options?: Partial<DefaultSearchDialogProps> | SearchProviderProps['options'];
  /**
   * Enable search functionality
   *
   * @defaultValue `true`
   */
  enabled?: boolean;
}

export interface RootProviderProps {
  /**
   * `dir` option for Radix UI
   */
  dir?: 'rtl' | 'ltr';

  /**
   * @remarks `SearchProviderProps`
   */
  search?: Partial<SearchOptions>;

  /**
   * Wrap the body in `ThemeProvider` (next-themes)
   *
   * @defaultValue true
   * @deprecated Use `theme.enable` instead
   */
  enableThemeProvider?: boolean;

  /**
   * Customise options of `next-themes`
   */
  theme?: Partial<ThemeProviderProps> & {
    /**
     * Enable `next-themes`
     *
     * @defaultValue true
     */
    enabled?: boolean;
  };

  children: ReactNode;
}

const DefaultSearchDialog = dynamic(
  () => import('@/components/dialog/search-default'),
  { ssr: false },
);

export function RootProvider({
  children,
  dir,
  enableThemeProvider = true,
  theme: { enabled = true, ...theme } = {},
  search,
}: RootProviderProps): React.ReactElement {
  let body = (
    <SidebarProvider>
      <SidebarCollapseProvider>{children}</SidebarCollapseProvider>
    </SidebarProvider>
  );

  if (search?.enabled !== false)
    body = (
      <SearchProvider SearchDialog={DefaultSearchDialog} {...search}>
        {body}
      </SearchProvider>
    );

  if (enabled && enableThemeProvider)
    body = (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        {...theme}
      >
        {body}
      </ThemeProvider>
    );

  if (dir) body = <DirectionProvider dir={dir}>{body}</DirectionProvider>;

  return body;
}

export { useI18n } from './contexts/i18n';
export { useSearchContext } from './contexts/search';
export { useSidebarCollapse } from './contexts/sidebar';
export { useTreeContext } from './contexts/tree';
