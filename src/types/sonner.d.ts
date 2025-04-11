
// This ensures TypeScript recognizes the toast module from sonner
declare module "sonner" {
  export const toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
    warning: (message: string) => void;
    custom: (message: React.ReactNode) => void;
    promise: <T>(
      promise: Promise<T>,
      options: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((error: unknown) => string);
      }
    ) => Promise<T>;
  };
  
  export interface ToasterProps {
    theme?: "light" | "dark" | "system";
    className?: string;
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center";
    duration?: number;
    toastOptions?: {
      classNames?: {
        toast?: string;
        description?: string;
        actionButton?: string;
        cancelButton?: string;
      };
    };
  }
  
  export function Toaster(props?: ToasterProps): JSX.Element;
}
