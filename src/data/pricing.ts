type UserType = "I'm Student" | "I'm Teacher";
export const pricingData: {
  plans: Record<
    UserType,
    {
      type: string;
      price: {
        monthly: string;
        yearly: string;
      };
      priceID?: {
        monthly?: string;
        yearly?: string;
      };
      time: string;
      description: string;
      benefits: string[];
      buttonText: string;
    }[]
  >;
} = {
  plans: {
    "I'm Student": [
      {
        type: "Free",
        price: {
          monthly: "",
          yearly: "",
        },
        time: "month",
        description: "For individuals who need basic forms.",
        benefits: [
          "Unlimited Join Study Circles",
          "Create Circles (Up to 3)",
          "Access Quizzes & Leaderboard",
          "Earn Achievement Badges",
          "Progress Analytics",
        ],
        buttonText: "Purchase now",
      },
      {
        type: "Student Plus",
        price: {
          monthly: "99 QAR",
          yearly: "999 QAR",
        },
        time: "month",
        description: "For individuals who need more features.",
        benefits: [
          "Join Study Circles",
          "Create Circles",
          "Access Quizzes & Leaderboard",
          "Earn Achievement Badges",
          "Progress Analytics",
          "Pro Member Badge",
          "Custom Profile Styling",
          "Advanced Progress Tracking",
          "Priority Support",
        ],
        priceID: {
          monthly: process.env.STRIPE_PRICE_ID_STUDENT_PLUS_MONTHLY,
          yearly: process.env.STRIPE_PRICE_ID_STUDENT_PLUS_YEARLY,
        },
        buttonText: "Purchase now",
      },
    ],
    "I'm Teacher": [
      {
        type: "Free",
        price: {
          monthly: "",
          yearly: "",
        },
        time: "month",
        description: "Basic features for teachers.",
        benefits: [
          "Create Classes (up to 2)",
          "Add Quizzes",
          "Student Analytics (Basic)",
        ],
        buttonText: "Purchase now",
      },
      {
        type: "Teacher Plus",
        price: {
          monthly: "99 QAR",
          yearly: "999 QAR",
        },
        time: "month",
        description: "Advanced features for teachers.",
        benefits: [
          "Unlimited Classes",
          "Add Quizzes",
          "Student Analytics + Heatmaps",
          "Branded Certificates",
        ],
        priceID: {
          monthly: process.env.STRIPE_PRICE_ID_TEACHER_PLUS_MONTHLY,
          yearly: process.env.STRIPE_PRICE_ID_TEACHER_PLUS_YEARLY,
        },
        buttonText: "Purchase now",
      },
      {
        type: "Institution",
        price: {
          monthly: "",
          yearly: "",
        },
        time: "",
        description: "For schools and institutions.",
        benefits: [
          "Unlimited Classes",
          "Org-wide Student Analytics",
          "Branded Certificates",
          "Upload Custom Logo",
          "Custom Domain",
          "LMS/API Integration",
          "Priority Support & Training",
        ],
        buttonText: "Contact Sales",
      },
    ],
  },
};
