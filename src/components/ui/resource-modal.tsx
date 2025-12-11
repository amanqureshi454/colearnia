"use client";

import { createPortal } from "react-dom";
import { useEffect, useState, FormEvent } from "react";
import Dropdown from "@/components/ui/dropdown";
import CountryDropdown from "@/components/ui/country-dropdown";
import { getLevels } from "@/services/locationService";
import toast, { Toaster } from "react-hot-toast";
import BtnLoader from "./btn-loader";

type Level = {
  _id: string;
  name: string;
};

type ResourceSummary = {
  title: string;
  id: number;
};

type ResourceModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedResource: ResourceSummary | null;
};

type LevelOption = {
  label: string;
  value: string;
};

export default function ResourceModal({
  isOpen,
  setIsOpen,
  selectedResource,
}: ResourceModalProps) {
  const [selectedLevelLabel, setSelectedLevelLabel] = useState("");
  const [country, setCountry] = useState<string>("");
  const [consent, setConsent] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const [levelOptions, setLevelOptions] = useState<LevelOption[]>([]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    school: "",
  });

  const portalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;
  const formGuid = process.env.NEXT_PUBLIC_HUBSPOT_FORM_GUID;

  useEffect(() => {
    async function fetchLevels() {
      try {
        const levels = await getLevels();

        // We send LEVEL NAME to HubSpot — not ID
        setLevelOptions(
          levels.map((lvl: Level) => ({
            label: lvl.name, // UI label
            value: lvl.name, // Value sent to HubSpot
          }))
        );
      } catch (err: unknown) {
        console.error("Error fetching levels:", err);
      }
    }
    fetchLevels();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !country) {
      toast.error("Please fill all fields");
      return;
    }
    if (!consent) {
      toast.error("Please agree to receive communications.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      fields: [
        { name: "full_name", value: formData.fullName.trim() },
        { name: "email", value: formData.email.trim() },
        { name: "country_name", value: country },
        { name: "school", value: formData.school.trim() || "" },
        { name: "school_level", value: selectedLevelLabel || "" },
        { name: "resource_name", value: selectedResource?.title || "Unknown" },
      ],

      context: {
        pageUri: window.location.href,
        pageName: document.title,
      },

      legalConsentOptions: {
        consent: {
          consentToProcess: true,
          text: "I agree to allow Colearnia to store and process my personal data.",
          communications: [
            {
              // LEGAL_CONSENT.subscription_type_1321138204
              value: consent, // true/false
              subscriptionTypeId: 1321138204, // <-- REPLACE with your real ID
              text: "I agree to receive other communications from Colearnia.",
            },
          ],
        },
      },
    };

    console.log("Sending payload:", JSON.stringify(payload, null, 2));

    try {
      const res = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const raw = await res.text();
      console.log("HubSpot response:", raw);

      if (res.status === 204 || res.status === 200) {
        setShowThankYou(true);
      } else {
        throw new Error(raw || "Submission failed");
      }
    } catch (err: unknown) {
      console.error("Error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Thank You Modal
  if (showThankYou) {
    return createPortal(
      <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[9999] px-4">
        <div className="bg-white rounded-2xl p-10 max-w-lg w-full text-center shadow-2xl animate-in fade-in zoom-in duration-200">
          <div className="text-5xl mb-4">You&apos;re all set!</div>
          <p className="text-gray-500 mb-8 leading-relaxed">
            The download link is on its way to your inbox.
            <br />
            Enjoy your free resource!
          </p>
          <button
            onClick={() => {
              setShowThankYou(false);
              setIsOpen(false);
            }}
            className="bg-[#FF9E0C] cursor-pointer text-white font-semibold py-3 px-10 rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[9999] px-4">
        <div className="bg-white relative rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-2xl">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-6 text-3xl text-gray-400 hover:text-gray-700"
          >
            ×
          </button>

          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
            {selectedResource?.title || "Get Your Free Resource"}
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Fill in your details to receive free resources by email.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="flex justify-between gap-3 items-center">
              <div className="tab:w-1/2 sm:w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Email */}
              <div className="tab:w-1/2 sm:w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  required
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select your country
              </label>
              <CountryDropdown
                value={country}
                onChange={(label: string) => setCountry(label)}
                placeholder="Select your country"
              />
            </div>

            {/* School */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School Name
                <span className=" text-gray-400 mx-1">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="Your school name"
                value={formData.school}
                onChange={(e) =>
                  setFormData({ ...formData, school: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select your level{" "}
                <span className=" text-gray-400 mx-1">(Optional)</span>
              </label>
              <Dropdown
                placeholder="Choose level"
                options={levelOptions.map((o) => o.label)}
                onChange={(label: string) => setSelectedLevelLabel(label)}
                value={selectedLevelLabel}
              />
            </div>
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-5 w-5 accent-background cursor-pointer"
              />

              <label className="text-sm text-gray-700 cursor-pointer">
                I agree to receive other communications from Colearnia.
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#FF9E0C] cursor-pointer disabled:opacity-70 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <BtnLoader size={24} color="#ffffff" />
                  Sending...
                </>
              ) : (
                "Get my free resources"
              )}
            </button>
          </form>
        </div>
      </div>

      <Toaster position="top-center" />
    </>,
    document.body
  );
}
