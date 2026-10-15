'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enquiryType: 'ORDER',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="bg-sand-50/50 min-h-screen py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            Personalized Assistance
          </span>
          <h1 className="font-editorial text-3xl md:text-5xl font-bold text-charcoal-900">
            Contact Our Concierge
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Whether you need bespoke dimension advice, fabric consultations, or delivery updates, our Marylebone interior specialists are at your service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Details Card */}
          <div className="bg-charcoal-900 text-white rounded-2xl p-6 md:p-8 space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              <h2 className="font-editorial text-2xl font-bold">
                Showroom & Enquiries
              </h2>
              <p className="text-xs text-brand-200/80 leading-relaxed">
                Experience our curated timber finishes, mattresses, and linen upholstery in person at our Central London showroom.
              </p>

              <div className="space-y-4 text-xs text-brand-200">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Flagship Showroom</strong>
                    <span>45 Regent Mews, Marylebone, London, W1B 3HH</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Phone Support</strong>
                    <span>+44 (0) 800 123 4567</span>
                    <p className="text-[11px] text-brand-300/70 mt-0.5">Freephone UK Mainland</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Email</strong>
                    <span>concierge@tbfurnitures.co.uk</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Opening Hours</strong>
                    <span>Monday – Friday: 09:00 – 18:00</span>
                    <span className="block">Saturday: 10:00 – 17:00</span>
                    <span className="block text-brand-300/70">Sunday: Closed for private consultations</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-charcoal-800 text-[11px] text-brand-300/70">
              TB Furnitures (UK) Ltd • Registered in England & Wales #14892014
            </div>
          </div>

          {/* Interactive Enquiry Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-12 h-12 bg-sage-50 text-sage-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="font-editorial text-2xl font-bold text-charcoal-900">
                  Enquiry Received
                </h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                  Thank you for contacting TB Furnitures. A dedicated interior specialist will review your request and get in touch within 2 to 4 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 bg-charcoal-900 hover:bg-brand-900 text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="font-editorial text-xl font-bold text-charcoal-900">
                  Send a Message to Our Design Concierge
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs border border-gray-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                      placeholder="e.g. Eleanor Vance"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-xs border border-gray-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                      placeholder="eleanor@example.co.uk"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                      Contact Telephone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full text-xs border border-gray-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                      placeholder="e.g. +44 7700 900123"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                      Enquiry Nature
                    </label>
                    <select
                      value={formData.enquiryType}
                      onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value })}
                      className="w-full text-xs border border-gray-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                    >
                      <option value="ORDER">Order Status / Delivery Enquiry</option>
                      <option value="PRODUCT">Product Dimensions & Custom Fabric</option>
                      <option value="SWATCH">Free Fabric Swatch Request</option>
                      <option value="TRADE">Trade & Interior Designer Account</option>
                      <option value="GENERAL">General Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                    Your Message or Room Requirements *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full text-xs border border-gray-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                    placeholder="Tell us about your room measurements, preferred wood finishes, or existing order number..."
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {loading ? 'Sending Enquiry...' : 'Submit Message'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
