import { Document, Page } from '@react-pdf/renderer';
import type { ReactNode } from 'react';
import { nceStyles } from './styles';

export interface NCEDocumentProps {
  children: ReactNode;
}

/** Root `@react-pdf/renderer` document wrapper for NCE layouts (single A4 page by default). */
export const NCEDocument = ({ children }: NCEDocumentProps) => <Document>{children}</Document>;

export interface NCEPageProps {
  children: ReactNode;
}

export const NCEPage = ({ children }: NCEPageProps) => (
  <Page size="A4" style={nceStyles.page}>
    {children}
  </Page>
);
