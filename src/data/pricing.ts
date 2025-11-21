export type UserType = "student" | "teacher";
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
    student: [
      {
        type: "Guest",
        price: {
          monthly: "0",
          yearly: "0",
        },
        time: "month",
        description: "For invited students exploring a single Circle.",
        benefits: [
          "Access one invited Circle only",
          "View results",
          "No creation or editing",
        ],
        buttonText: "Signup for free",
      },
      {
        type: "Trial Pass",
        price: {
          monthly: "7",
          yearly: "0",
        },
        time: "Week",
        description: "Try all features for 14 days at a symbolic price.",
        benefits: [
          "Full access for 14 days",
          "Explore all features",
          "Create 1 Circle",
          "Cancel anytime",
        ],
        buttonText: "Signup for Trial",
      },
      {
        type: "Basic",
        price: {
          monthly: "49",
          yearly: "490",
        },
        time: "month",
        description: "Experiment the power of infinite possibilities",
        benefits: [
          "Join unlimited Circles",
          "Create up to 10 Circles",
          "Leader benefits active in all Circles you join or create",
          "Full analytics: Personal + all Circles joined or created",
          "Add Quests & Missions in any Circle where allowed",
          "Circle Captain badge",
          "Priority support",
        ],
        priceID: {
          monthly: process.env.STRIPE_PRICE_ID_STUDENT_BASIC_MONTHLY,
          yearly: process.env.STRIPE_PRICE_ID_STUDENT_BASIC_YEARLY,
        },
        buttonText: "Go with basic",
      },
      {
        type: "Pro",
        price: {
          monthly: "99",
          yearly: "990",
        },
        time: "month",
        description: "Unveil new superpowers and join the Design League.",
        benefits: [
          "Join unlimited Circles",
          "Create up to 3 Circles",
          "Leader benefits active only in your own Circles",
          "Personal & your own Circle analytics",
          "Add Quests & Missions in your own Circles",
          "Circle Leader badge",
          "Standard support",
        ],
        priceID: {
          monthly: process.env.STRIPE_PRICE_ID_STUDENT_PLUS_MONTHLY,
          yearly: process.env.STRIPE_PRICE_ID_STUDENT_PLUS_YEARLY,
        },
        buttonText: "Go with Pro",
      },
    ],
    teacher: [
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
          monthly: "99",
          yearly: "999",
        },
        time: "month",
        description: "Advanced features for teachers.",
        benefits: [
          "All the features of pro plan",
          "Account success Manager",
          "Single Sign-On (SSO)",
          "Co-conception program",
          "Collaboration-Soon",
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
