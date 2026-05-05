import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Payment() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const subjects = JSON.parse(localStorage.getItem("subjects")) || [];
  const plan = localStorage.getItem("plan");

  const prices = {
    A: 100000,
    B: 70000,
    C: 40000,
  };

  const amount = prices[plan] || 0;
  const paymentMethods = ["MTN", "Airtel", "Bank Transfer"];
  const bankDetails = {
    accountName: "Maximum Scholars Uganda",
    accountNumber: "1234567890",
    bankName: "Stanbic Bank",
  };
  const [method, setMethod] = useState("");
  const [phone, setPhone] = useState(user.phone || "");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");
  const supportEmail = "support@maximumscholars.com";

  const copyToClipboard = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied(""), 1500);
    } catch (error) {
      console.error("Clipboard copy failed", error);
    }
  };

  const handleSubmit = async () => {
    if (!user?.id || !user.email) {
      alert("Please login again before submitting payment.");
      navigate("/login");
      return;
    }

    if (!plan || subjects.length === 0 || amount <= 0) {
      alert("Please choose a study plan and select subjects before submitting payment.");
      navigate("/subjects");
      return;
    }

    if (!method) {
      alert("Select payment method.");
      return;
    }

    if (!phone || !reference) {
      alert("Fill all payment details.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("https://maximum-scholars-1-api.onrender.com/api/payment/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          plan,
          amount,
          subjects,
          method,
          phone,
          reference,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Payment submitted successfully. Await admin approval.");
        navigate("/login");
      } else {
        alert(data.message || "Payment failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!plan || subjects.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 md:p-10 flex items-center justify-center">
        <div className="max-w-3xl bg-white rounded-3xl shadow p-10 text-center">
          <h1 className="text-3xl font-bold text-blue-700 mb-4">Complete Your Plan Selection</h1>
          <p className="text-gray-600 mb-8">You must choose a study plan and select subjects before submitting payment.</p>
          <button
            onClick={() => navigate("/subjects")}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-2xl font-semibold"
          >
            Choose Subjects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-4xl font-bold text-blue-700 mb-3">Secure Payment</h1>
          <p className="text-gray-600 mb-8">Complete payment to activate your learning access.</p>

          <div className="bg-white rounded-3xl shadow p-6 mb-6">
            <h2 className="text-2xl font-bold mb-5">Order Summary</h2>

            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Plan:</strong> {plan}
              </p>
              <p>
                <strong>Amount:</strong> UGX {amount.toLocaleString()}
              </p>
              <div>
                <strong>Subjects:</strong>
                <div className="flex flex-wrap gap-2 mt-3">
                  {subjects.map((item) => (
                    <span key={item} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow p-6">
            <h2 className="text-2xl font-bold mb-5">Payment Options</h2>
            <div className="grid gap-4">
              {paymentMethods.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMethod(item)}
                  className={`w-full rounded-2xl border px-5 py-4 text-left text-lg font-semibold ${method === item ? 'border-blue-700 bg-blue-50' : 'border-slate-200 bg-white'}`}
                >
                  {item}
                </button>
              ))}
            </div>

            {method === "Bank Transfer" && (
              <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="font-semibold text-slate-700">Bank transfer details</p>
                <p className="text-sm text-slate-500">Account: {bankDetails.accountName}</p>
                <p className="text-sm text-slate-500">Bank: {bankDetails.bankName}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-2 text-sm text-slate-700 border border-slate-200">{bankDetails.accountNumber}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(bankDetails.accountNumber)}
                    className="rounded-2xl bg-blue-600 px-4 py-2 text-white"
                  >
                    {copied === bankDetails.accountNumber ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl shadow p-6">
            <h2 className="text-2xl font-bold mb-5">How to Submit Payment</h2>
            <ol className="list-decimal space-y-3 pl-5 text-gray-700">
              <li>Choose your payment method.</li>
              <li>Send the exact amount to the listed account.</li>
              <li>Enter the phone number and reference used for the transaction.</li>
              <li>Submit the form so admin can verify your payment.</li>
            </ol>
            <p className="mt-4 text-sm text-slate-500">
              Need help? Email <a className="text-blue-700" href={`mailto:${supportEmail}`}>{supportEmail}</a>.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow p-8">
          <h2 className="text-3xl font-bold mb-6">Submit Proof</h2>

          <div className="space-y-4 mb-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-700">Selected method</p>
              <p className="text-slate-500">{method || "No method selected"}</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-700">Use one of these methods</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {paymentMethods.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setMethod(item)}
                      className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${method === item ? 'bg-blue-600 text-white' : 'bg-white text-slate-700'}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {method === "Bank Transfer" && (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-700">Bank details</p>
                  <p className="text-sm text-slate-500 mt-2">{bankDetails.accountName}</p>
                  <p className="text-sm text-slate-500">{bankDetails.bankName}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white px-3 py-2 text-sm text-slate-700 border border-slate-200">{bankDetails.accountNumber}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(bankDetails.accountNumber)}
                      className="rounded-2xl bg-blue-600 px-4 py-2 text-white"
                    >
                      {copied === bankDetails.accountNumber ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <input
            type="text"
            placeholder="Phone number used"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border p-4 rounded-2xl mb-5"
          />

          <input
            type="text"
            placeholder="Transaction ID / SMS Reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="w-full border p-4 rounded-2xl mb-3"
          />

          <p className="text-sm text-gray-500 mb-6">Example: PP24091XYZ</p>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-bold text-lg"
          >
            {loading ? "Submitting..." : "Submit Payment"}
          </button>

          <button
            onClick={() => navigate("/subjects")}
            className="w-full mt-4 border py-4 rounded-2xl"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
