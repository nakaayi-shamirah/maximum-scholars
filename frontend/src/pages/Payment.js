import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Payment() {
  const navigate = useNavigate();

  const user =
    JSON.parse(
      localStorage.getItem("user")
    ) || {};

  const subjects =
    JSON.parse(
      localStorage.getItem("subjects")
    ) || [];

  const plan =
    localStorage.getItem("plan");

  const prices = {
    A: 100000,
    B: 70000,
    C: 40000
  };

  const amount =
    prices[plan] || 0;

  const [method, setMethod] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [reference, setReference] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit =
    async () => {
      if (!method) {
        alert(
          "Select payment method."
        );
        return;
      }

      if (!phone || !reference) {
        alert(
          "Fill all payment details."
        );
        return;
      }

      try {
        setLoading(true);

        const res =
          await fetch(
            "http://127.0.0.1:5000/api/payment/request",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json"
              },
              body: JSON.stringify({
                userId:
                  user.id,
                email:
                  user.email,
                plan,
                amount,
                subjects,
                method,
                phone,
                reference
              })
            }
          );

        const data =
          await res.json();

        if (res.ok) {
          alert(
            "Payment submitted successfully. Await admin approval."
          );

          navigate("/login");

        } else {
          alert(
            data.message ||
              "Payment failed."
          );
        }

      } catch (error) {
        alert(
          "Server connection failed."
        );

      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">

        {/* LEFT SIDE */}
        <div>

          <h1 className="text-4xl font-bold text-blue-700 mb-3">
            Secure Payment
          </h1>

          <p className="text-gray-600 mb-8">
            Complete payment to activate your learning access.
          </p>

          {/* SUMMARY */}
          <div className="bg-white rounded-3xl shadow p-6 mb-6">

            <h2 className="text-2xl font-bold mb-5">
              Order Summary
            </h2>

            <div className="space-y-3 text-gray-700">

              <p>
                <strong>Plan:</strong>{" "}
                {plan}
              </p>

              <p>
                <strong>Amount:</strong>{" "}
                UGX{" "}
                {amount.toLocaleString()}
              </p>

              <div>
                <strong>Subjects:</strong>

                <div className="flex flex-wrap gap-2 mt-3">
                  {subjects.map(
                    (item) => (
                      <span
                        key={item}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        {item}
                      </span>
                    )
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* PAYMENT DETAILS */}
          <div className="bg-white rounded-3xl shadow p-6">

            <h2 className="text-2xl font-bold mb-5">
              Pay To
            </h2>

            <div className="space-y-5">

              <div className="border rounded-2xl p-4">
                <p className="font-semibold text-yellow-600">
                  MTN 
                </p>

                <p>
                  0762027171
                </p>

                <p className="text-sm text-gray-500">
                  SSENDIWALA JOSHUA
                </p>
              </div>

              <div className="border rounded-2xl p-4">
                <p className="font-semibold text-red-500">
                  Airtel Money
                </p>

                <p>
                  0709634560
                </p>

                <p className="text-sm text-gray-500">
                  SSENDIWALA JOSHUA
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white rounded-3xl shadow p-8">

          <h2 className="text-3xl font-bold mb-6">
            Submit Proof
          </h2>

          {/* METHOD */}
          <div className="grid grid-cols-2 gap-4 mb-6">

            <button
              onClick={() =>
                setMethod(
                  "MTN "
                )
              }
              className={`p-4 rounded-2xl border font-semibold ${
                method ===
                "MTN"
                  ? "bg-yellow-400"
                  : ""
              }`}
            >
              MTN
            </button>

            <button
              onClick={() =>
                setMethod(
                  "Airtel Money"
                )
              }
              className={`p-4 rounded-2xl border font-semibold ${
                method ===
                "Airtel Money"
                  ? "bg-red-500 text-white"
                  : ""
              }`}
            >
              Airtel
            </button>

          </div>

          <input
            type="text"
            placeholder="Phone number used"
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value
              )
            }
            className="w-full border p-4 rounded-2xl mb-5"
          />

          <input
            type="text"
            placeholder="Transaction ID / SMS Reference"
            value={reference}
            onChange={(e) =>
              setReference(
                e.target.value
              )
            }
            className="w-full border p-4 rounded-2xl mb-3"
          />

          <p className="text-sm text-gray-500 mb-6">
            Example:
            PP24091XYZ
          </p>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-bold text-lg"
          >
            {loading
              ? "Submitting..."
              : "Submit Payment"}
          </button>

          <button
            onClick={() =>
              navigate(
                "/subjects"
              )
            }
            className="w-full mt-4 border py-4 rounded-2xl"
          >
            Back
          </button>

        </div>

      </div>

    </div>
  );
}