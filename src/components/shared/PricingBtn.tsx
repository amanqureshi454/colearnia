import Link from "next/link";
import BtnLoader from "@/components/ui/btn-loader";
import { useTranslations } from "next-intl";

export type PlanType =
  | "Student Free"
  | "Teacher Free"
  | "Guest"
  | "Trial Pass"
  | "Basic"
  | "Plus"
  | "Teacher Plus"
  | "Institution";

export type DurationType = "monthly" | "yearly";

export interface PlanCTAProps {
  plan: {
    type: string;
    maxCircle?: number;
    buttonText?: string;
  };
  isActive: boolean;
  hasSubscription: boolean;
  loading: boolean;
  loadingPlan: string | null;
  setLoadingPlan: (plan: string) => void;
  durationTab: DurationType;
  handleSubscribe: (
    plan: string,
    duration: string,
    priceId?: string,
    maxCircle?: number
  ) => void;
  handleFreePlan: () => void;
  isInstitutionPlan: boolean;
}

const PLAN_KEY_MAP: Record<string, string> = {
  Basic: "student_basic",
  Plus: "student_plus",
  Guest: "student_trial",
  "Trial Pass": "student_trial",
  "Teacher Plus": "teacher_plus",
};

const PlanCTA: React.FC<PlanCTAProps> = ({
  plan,
  isActive,
  hasSubscription,
  loading,
  loadingPlan,
  setLoadingPlan,
  durationTab,
  handleSubscribe,
  handleFreePlan,
  isInstitutionPlan,
}) => {
  const locale = useTranslations();
  const isGuestPlan = plan.type === "Guest";

  // ✅ Check if subscription is cancelled but still has access
  // This will be passed from parent or checked here

  return (
    <>
      {/* ✅ 1. ACTIVE PLAN → DASHBOARD */}
      {isActive ? (
        <Link
          href="https://uat.studycircleapp.com/"
          className="mt-8 py-4 w-full flex cursor-pointer justify-center items-center
          rounded-2xl text-sm font-medium border border-[#727272]
          text-[#3D3B3B] hover:scale-105 transition-all duration-200"
        >
          Go to Dashboard
        </Link>
      ) : isGuestPlan && hasSubscription ? (
        /* ✅ 2. GUEST + HAS PAID PLAN → DOWNGRADE BUTTON */
        <button
          onClick={() => {
            handleFreePlan();
          }}
          disabled={loadingPlan === plan.type}
          className="mt-8 py-4 w-full rounded-2xl cursor-pointer text-sm font-medium
          flex items-center justify-center gap-2 border border-red-300
          text-red-600 hover:bg-red-50 hover:scale-105
          transition-all duration-200 disabled:opacity-50"
        >
          Cancel & Switch to Free
        </button>
      ) : isGuestPlan && !hasSubscription ? (
        /* ✅ 3. GUEST + NO SUBSCRIPTION → SIGNUP FREE */
        <button
          onClick={() => {
            setLoadingPlan(plan.type);
            handleFreePlan();
          }}
          disabled={loadingPlan === plan.type}
          className="mt-8 py-4 w-full rounded-2xl cursor-pointer text-sm font-normal
          flex items-center justify-center gap-2 border border-[#727272]
          hover:scale-105 transition-all duration-200 disabled:opacity-50"
        >
          {plan.buttonText || "Signup for free"}
        </button>
      ) : isInstitutionPlan ? (
        /* ✅ 4. INSTITUTION → CONTACT */
        <button
          onClick={() => (window.location.href = `${locale}/contact`)}
          className="mt-8 py-4 w-full rounded-2xl cursor-pointer text-sm font-normal
          flex items-center justify-center gap-2 border border-[#727272]
          hover:scale-105 transition-all duration-200"
        >
          {plan.buttonText || "Contact Us"}
        </button>
      ) : (
        /* ✅ 5. DEFAULT → SUBSCRIBE */
        <button
          onClick={async () => {
            setLoadingPlan(plan.type);

            const backendPlan = PLAN_KEY_MAP[plan.type];
            const durationToSend =
              backendPlan === "student_trial" ? "week" : durationTab;

            await new Promise((res) => setTimeout(res, 50));

            handleSubscribe(
              backendPlan,
              durationToSend,
              undefined,
              plan.maxCircle
            );
          }}
          disabled={loadingPlan === plan.type}
          className="mt-8 py-4 w-full flex cursor-pointer justify-center items-center
          rounded-2xl text-sm font-medium border border-[#727272]
          text-[#3D3B3B] hover:bg-gray-50 hover:scale-105
          transition-all duration-200 disabled:opacity-50
          disabled:cursor-not-allowed"
        >
          {loadingPlan === plan.type ? (
            <>
              <BtnLoader size={22} color="#000000" />
              <span className="ml-1">Redirecting...</span>
            </>
          ) : (
            plan.buttonText
          )}
        </button>
      )}
    </>
  );
};

export default PlanCTA;
