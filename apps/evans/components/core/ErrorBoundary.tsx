import React from 'react';
import EvansClient, { type T } from '@friends-library/pairql/evans';
import Dual from './Dual';
import { NODE_ENV } from '@/lib/env';

interface State {
  hasError: boolean;
}

interface Props {
  location: string;
  children: React.ReactNode;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  override state = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public override componentDidCatch(error: unknown, errorInfo: unknown): void {
    if (NODE_ENV === `development`) {
      // eslint-disable-next-line no-console
      console.error(`ErrorBoundary`, error, JSON.stringify(errorInfo));
      return;
    }

    const data: T.LogJsError.Input = {
      errorMessage: String(error),
      additionalInfo: errorInfo === undefined ? undefined : String(errorInfo),
      location: this.props.location,
      url: window.location.href,
      userAgent: navigator.userAgent,
      colNumber: undefined,
      errorName: undefined,
      errorStack: undefined,
      event: undefined,
      lineNumber: undefined,
      source: undefined,
    };

    if (error instanceof Error) {
      data.errorMessage = error.message;
      data.errorName = error.name;
      data.errorStack = error.stack ?? undefined;
    }

    EvansClient.web(window.location.href, () => undefined).logJsError(data);
  }

  override render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <Dual.H1 className="p-6 text-center text-white bg-red-700">
          <>
            Sorry, an unexpected error occurred. We&rsquo;ve been notified of the problem
            and will look into it as soon as possible. Please refresh the page and try
            again. We&rsquo;re very sorry for any inconvenience.
          </>
          <>
            Lo siento, ha ocurrido un error inesperado. Hemos sido notificados sobre el
            problema y lo investigaremos lo antes posible. Actualiza la página e inténtalo
            de nuevo. Lamentamos cualquier inconveniente.
          </>
        </Dual.H1>
      );
    }

    return this.props.children;
  }
}
