import { X } from "lucide-react";
import React from "react";

interface RoleRestrictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: string;
  attemptedPlanType: string;
}

const RoleRestrictionModal: React.FC<RoleRestrictionModalProps> = ({
  isOpen,
  onClose,
  userRole,
  attemptedPlanType,
}) => {
  if (!isOpen) return null;

  const isTeacher = userRole === "teacher";
  const restrictedPlanType = isTeacher ? "student" : "teacher";

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
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Plan Not Available
          </h3>
          <p className="text-gray-600 mb-6">
            You are registered as a{" "}
            <span className="font-semibold text-brand capitalize">
              {userRole}
            </span>
            . You cannot purchase {restrictedPlanType} plans.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Please select a plan from the{" "}
            <span className="font-medium capitalize">{userRole}</span> tab that
            matches your account type.
          </p>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-brand text-white font-medium rounded-xl hover:bg-brand/90 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleRestrictionModal;
