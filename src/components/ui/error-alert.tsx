interface ErrorAlertProps {
  message: string;
  onClose: () => void;
}

/**
 * Error alert component
 * @param {ErrorAlertProps} props - Props for the error alert component
 * @returns {React.FC} Error alert component
 */
export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onClose }) => {
  return (
    <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 shadow-lg max-w-md">
      <button
        onClick={onClose}
        className="absolute top-1 right-2 text-red-700 hover:text-red-900 text-xl font-bold leading-none"
      >
        ×
      </button>
      <p className="font-bold pr-6">Error</p>
      <p className="text-sm mt-1">{message}</p>
    </div>
  );
};
