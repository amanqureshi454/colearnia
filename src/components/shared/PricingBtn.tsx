import Link from "next/link";
import BtnLoader from "@/components/ui/btn-loader";

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
    priceID?: {
      monthly?: string;
      yearly?: string;
    };
    buttonText?: string;
  };

  // Subscription State
  isActive: boolean;
  hasSubscription: boolean;

  // Loading State
  loading: boolean;
  loadingPlan: string | null;
  setLoadingPlan: (plan: string) => void;

  // Duration
  durationTab: DurationType;

  // Action Handlers
  handleSubscribe: (plan: string, duration: string, priceId?: string) => void;
  handleFreePlan: () => void;

  // Contact Button
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
  const isFreeStudentPlan = plan.type === "Student Free";
  const isFreeTeacherPlan = plan.type === "Teacher Free";
  const isFreePlan = isFreeStudentPlan || isFreeTeacherPlan;

  return (
    <>
      {/* ✅ 1. ACTIVE PLAN → DASHBOARD */}
      {isActive ? (
        <Link
          href={
            process.env.NEXT_PUBLIC_DASHBOARD_URL ||
            "https://uat.studycircleapp.com/"
          }
          className="mt-8 py-4 w-full flex cursor-pointer justify-center items-center
          rounded-2xl text-sm font-medium border border-[#727272]
          text-[#3D3B3B] hover:scale-105 transition-all duration-200"
        >
          Go to Dashboard
        </Link>
      ) : isFreePlan && hasSubscription ? (
        /* ✅ 2. SWITCH TO FREE */
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
          {loadingPlan === plan.type ? (
            <>
              <BtnLoader size={24} color="#000000" />
              <span className="ml-2">Switching to {plan.type}...</span>
            </>
          ) : (
            `Switch to ${plan.type}`
          )}
        </button>
      ) : isInstitutionPlan ? (
        /* ✅ 3. INSTITUTION → CONTACT */
        <button
          onClick={() => (window.location.href = "/contact")}
          className="mt-8 py-4 w-full rounded-2xl cursor-pointer text-sm font-normal
          flex items-center justify-center gap-2 border border-[#727272]
          hover:scale-105 transition-all duration-200"
        >
          {plan.buttonText || "Contact Us"}
        </button>
      ) : (
        /* ✅ 4. DEFAULT → SUBSCRIBE / TRIAL / PLUS / BASIC */
        <button
          onClick={async () => {
            setLoadingPlan(plan.type);

            const backendPlan = PLAN_KEY_MAP[plan.type];
            const durationToSend =
              backendPlan === "student_trial" ? "week" : durationTab;

            const priceIdToSend =
              durationToSend === "week"
                ? process.env.NEXT_PUBLIC_STRIPE_TRIAL_PRICE_ID
                : plan.priceID?.[durationTab];

            // ✅ FORCE LOADER TO RENDER BEFORE REDIRECT
            await new Promise((res) => setTimeout(res, 50));

            handleSubscribe(backendPlan, durationToSend, priceIdToSend);
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
