export type UserType = "student" | "teacher";

interface PlanItem {
  type: string;
  price: {
    monthly: string;
    yearly: string;
  };
  maxCircle: number;
  time: string;
  description: string;
  benefits: string[];
  buttonText: string;
}

interface PricingData {
  plans: Record<UserType, PlanItem[]>;
}

export const pricingData: PricingData = {
  plans: {
    student: [
      {
        type: "Guest",
        price: {
          monthly: "0",
          yearly: "0",
        },
        maxCircle: 0,
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
        maxCircle: 1,
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
        maxCircle: 3,
        time: "month",
        description: "Experiment the power of infinite possibilities",
        benefits: [
          "Join Unlimited Circles",
          "Create up to 3 Circles",
          "Only in Circles you created",
          "Active only in your own Circles",
          "Personal & your own Circles",
          "In your own Circles",
          "Circle Leader badge",
          "Standard",
        ],
        buttonText: "Go with basic",
      },
      {
        type: "Plus",
        price: {
          monthly: "99",
          yearly: "990",
        },
        maxCircle: 10,
        time: "month",
        description: "Unveil new superpowers and join the Design League.",
        benefits: [
          "Join Unlimited Circles",
          "Create up to 10 Circles",
          "Only in Circles you created",
          "Active in all Circles you join or create",
          "Personal + all Circles joined or created",
          "In any Circle where allowed",
          "Circle Captain badge",
          "Priority support",
        ],
        buttonText: "Go with Plus",
      },
    ],
    teacher: [
      {
        type: "Free",
        price: {
          monthly: "",
          yearly: "",
        },
        maxCircle: 2,
        time: "month",
        description: "Basic features for teachers.",
        benefits: [
          "Create Classes (up to 2)",
          "Add Quizzes",
          "Student Analytics (Basic)",
        ],
        buttonText: "Sign up for free",
      },
      {
        type: "Teacher Plus",
        price: {
          monthly: "99",
          yearly: "999",
        },
        maxCircle: 0,
        time: "month",
        description: "Advanced features for teachers.",
        benefits: [
          "All the features of pro plan",
          "Account success Manager",
          "Single Sign-On (SSO)",
          "Co-conception program",
          "Collaboration-Soon",
        ],
        buttonText: "Go with Teacher Plus",
      },
      {
        type: "Institution",
        price: {
          monthly: "",
          yearly: "",
        },
        maxCircle: 0,
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
        buttonText: "Contact Us",
      },
    ],
  },
};
