import { X, AlertTriangle } from "lucide-react";
import React from "react";

interface DowngradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentPlan: string;
  endDate: string;
  isLoading: boolean;
}

// Format the end date
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

// Calculate remaining days
const getRemainingDays = (dateString: string) => {
  try {
    const endDate = new Date(dateString);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  } catch {
    return 0;
  }
};

// Get plan display name
const getPlanDisplayName = (plan: string) => {
  const planNames: Record<string, string> = {
    student_trial: "Trial Pass",
    student_basic: "Basic",
    student_plus: "Plus",
    teacher_plus: "Teacher Plus",
  };
  return planNames[plan] || plan;
};

const DowngradeModal: React.FC<DowngradeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentPlan,
  endDate,
  isLoading,
}) => {
  if (!isOpen) return null;

  const remainingDays = getRemainingDays(endDate);
  const formattedEndDate = formatDate(endDate);

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Downgrade to Free Plan?
          </h3>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <p className="text-blue-800 font-medium text-sm">
              ✓ Good news! You&apos;ll keep your{" "}
              <span className="font-bold">
                {getPlanDisplayName(currentPlan)}
              </span>{" "}
              benefits until:
            </p>
            <p className="text-blue-900 font-bold text-lg mt-1">
              {formattedEndDate}
            </p>
            <p className="text-blue-600 text-sm mt-1">
              ({remainingDays} days remaining)
            </p>
          </div>

          <p className="text-gray-600 mb-4 text-sm">
            After this date, your account will automatically switch to the Free
            plan with limited features.
          </p>

          <div className="bg-gray-50 rounded-xl p-3 mb-6">
            <p className="text-gray-500 text-xs">
              <strong>Free plan includes:</strong>
              <br />• Access one invited Circle only
              <br />• View results
              <br />• No creation or editing
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
            >
              Keep My Plan
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Confirm Downgrade"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DowngradeModal;
