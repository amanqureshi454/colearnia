"use client";

import { useState } from "react";
import { toast } from "react-hot-toast"; // or your toast library
import BtnLoader from "@/components/ui/btn-loader";

interface VerifiedPromo {
  code: string;
  discountPercentage: number;
  description?: string;
}

interface PromoCodeSectionProps {
  onPromoApplied?: (promo: VerifiedPromo | null) => void;
}

const PromoCodeSection = ({ onPromoApplied }: PromoCodeSectionProps) => {
  const [promoCode, setPromoCode] = useState("");
  const [verifiedPromo, setVerifiedPromo] = useState<VerifiedPromo | null>(
    null
  );
  const [promoLoading, setPromoLoading] = useState(false);

  const handleVerifyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }

    try {
      setPromoLoading(true);
      const res = await fetch("/api/promocode/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promoCode: promoCode.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        const promoData = {
          code: data.code,
          discountPercentage: data.discountPercentage,
          description: data.description,
        };
        setVerifiedPromo(promoData);
        onPromoApplied?.(promoData); // Notify parent component
        toast.success(
          data.message || `${data.discountPercentage}% discount applied!`
        );
      } else {
        setVerifiedPromo(null);
        onPromoApplied?.(null);
        toast.error(data.message || "Invalid promo code");
      }
    } catch (err) {
      console.error(err);
      setVerifiedPromo(null);
      onPromoApplied?.(null);
      toast.error("Failed to verify promo code");
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromoCode = () => {
    setPromoCode("");
    setVerifiedPromo(null);
    onPromoApplied?.(null);
    toast.success("Promo code removed");
  };

  return (
    <div className="max-w-[440px] mx-auto mt-8 px-4">
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-lg font-melodyB text-gray-800 mb-4">
          Have a Promo Code?
        </h3>

        {verifiedPromo ? (
          <div className="space-y-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-800 font-melodyB text-sm">
                    ✅ {verifiedPromo.code} Applied
                  </p>
                  <p className="text-green-600 text-sm font-melodyM mt-1">
                    {verifiedPromo.discountPercentage}% discount on your
                    purchase
                  </p>
                  {verifiedPromo.description && (
                    <p className="text-green-500 text-xs font-melodyM mt-1">
                      {verifiedPromo.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleRemovePromoCode}
                  className="text-red-500 hover:text-red-700 text-sm font-melodyM underline transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === "Enter" && promoCode.trim() && !promoLoading) {
                  handleVerifyPromoCode();
                }
              }}
              placeholder="Enter promo code"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-melodyM transition-all"
              disabled={promoLoading}
            />
            <button
              onClick={handleVerifyPromoCode}
              disabled={promoLoading || !promoCode.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-melodyM disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
            >
              {promoLoading ? (
                <>
                  <BtnLoader size={20} color="#ffffff" />
                  <span className="hidden sm:inline">Verifying...</span>
                </>
              ) : (
                "Apply"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromoCodeSection;
