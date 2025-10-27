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
          monthly: "0",
          yearly: "0",
        },
        time: "month",
        description: "Have a go and test your superpowers",
        benefits: [
          "2 Users",
          "2 Files",
          "Public Share & Comments",
          "Chat Support",
          "New income apps",
        ],
        buttonText: "Signup for free",
      },
      {
        type: "Pro",
        price: {
          monthly: "8",
          yearly: "92",
        },
        time: "month",
        description: "Experiment the power of infinite possibilities",
        benefits: [
          "4 Users",
          "All apps",
          "Unlimited editable exports",
          "Folders and collaboration",
          "All incoming apps",
        ],
        priceID: {
          monthly: process.env.STRIPE_PRICE_ID_STUDENT_PLUS_MONTHLY,
          yearly: process.env.STRIPE_PRICE_ID_STUDENT_PLUS_YEARLY,
        },
        buttonText: "Go to pro",
      },
      {
        type: "Business",
        price: {
          monthly: "16",
          yearly: "192",
        },
        time: "month",
        description: "Unveil new superpowers and join the Design League.",
        benefits: [
          "4 Users",
          "All apps",
          "Unlimited editable exports",
          "Folders and collaboration",
          "All incoming apps",
        ],
        priceID: {
          monthly: process.env.STRIPE_PRICE_ID_STUDENT_PLUS_MONTHLY,
          yearly: process.env.STRIPE_PRICE_ID_STUDENT_PLUS_YEARLY,
        },
        buttonText: "Go to Business",
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
