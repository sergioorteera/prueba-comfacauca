import { Skeleton } from "./skeleton";

interface PageLoaderProps {
  fullScreen?: boolean;
}

interface SpinnerProps {
  message?: string;
}

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

interface CardSkeletonProps {
  lines?: number;
}

/**
 * Page loader component - Displays a full-page skeleton
 * @param {PageLoaderProps} props - Props for the page loader
 * @returns {JSX.Element} Page loader component
 */
export const PageLoader: React.FC<PageLoaderProps> = ({
  fullScreen = true,
}) => {
  const containerClass = fullScreen
    ? "w-full min-h-auto flex justify-center items-center"
    : "w-full min-h-[400px] flex justify-center items-center";

  return (
    <div className={containerClass}>
      <div className="w-full max-w-6xl space-y-2 px-6 py-8 relative z-10">
        {/* Stats cards skeleton */}
        <div className="rounded-lg border bg-white p-16 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>

        {/* Table skeleton */}
        <div className="rounded-lg border bg-white p-6 space-y-4">
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Spinner component - Traditional spinner with a message
 * @param {SpinnerProps} props - Props for the spinner
 * @returns {JSX.Element} Spinner component
 */
export const Spinner: React.FC<SpinnerProps> = ({
  message = "Cargando...",
}) => {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="text-center relative z-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
};

/**
 * Table skeleton component - For tables
 * @param {TableSkeletonProps} props - Props for the table skeleton
 * @returns {JSX.Element} Table skeleton component
 */
export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 5,
}) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex gap-4 items-center border-b pb-3 last:border-b-0"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className={`h-4 ${
                colIndex === 0
                  ? "w-32"
                  : colIndex === columns - 1
                  ? "w-20 ml-auto"
                  : "flex-1"
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * Card skeleton component - For content cards animations
 * @param {CardSkeletonProps} props - Props for the card skeleton
 * @returns {JSX.Element} Card skeleton component
 */
export const CardSkeleton: React.FC<CardSkeletonProps> = ({ lines = 3 }) => {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            className={`h-4 ${index === lines - 1 ? "w-2/3" : "w-full"}`}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Modal loading skeleton - For modal loading animations
 * @returns {JSX.Element} Modal loading skeleton
 */
export const ModalLoadingSkeleton: React.FC = () => {
  return (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-sm text-gray-600">Cargando...</p>
    </div>
  );
};
