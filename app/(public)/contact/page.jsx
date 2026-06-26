"use client";
import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  Check,
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: "general",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitted(true);
      console.log("Form submitted:", formData);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          inquiryType: "general",
        });
      }, 3000);
    }
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Visit Us",
      details: ["Idumota, Lagos Island", "Lagos, Nigeria"],
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Call Us",
      details: ["+234 9050229003", "Mon-Sat: 9AM-8PM"],
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email Us",
      details: ["hello@laysscent.com", "Response within 24hrs"],
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Business Hours",
      details: ["Mon-Fri: 9AM - 8PM", "Sat: 10AM - 6PM", "Sun: 12PM - 5PM"],
    },
  ];

  const inquiryTypes = [
    { value: "general", label: "General Inquiry" },
    { value: "product", label: "Product Information" },
    { value: "order", label: "Order Support" },
    { value: "wholesale", label: "Wholesale / Partnership" },
    { value: "other", label: "Other" },
  ];

  const inputClass =
    "w-full bg-white/4 border border-white/10 focus:border-[#c97b63]/50 outline-none text-white/70 placeholder-white/20 p-3 rounded-xl text-sm transition-colors";
  const errorClass = "text-red-400/70 text-xs mt-1";

  return (
    <div className="min-h-screen bg-[#0e0a0b]">
      {/* Hero */}
      <div className="border-b border-white/8 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[11px] tracking-[4px] uppercase text-[#c97b63] mb-4">
            Contact us
          </p>
          <h1 className="text-4xl md:text-5xl font-serif italic text-white mb-5">
            Let's talk fragrance.
          </h1>
          <p className="text-white/35 max-w-xl mx-auto leading-relaxed">
            Have a question about a scent? Looking for a gift recommendation?
            We're here to help you find the perfect fragrance.
          </p>
        </div>
      </div>

      {/* Contact info cards */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="border border-white/8 bg-white/3 hover:border-[#c97b63]/30 rounded-2xl p-6 transition-all duration-300"
            >
              <div className="w-9 h-9 rounded-full bg-[#c97b63]/10 border border-[#c97b63]/20 flex items-center justify-center text-[#c97b63] mb-4">
                {info.icon}
              </div>
              <h3 className="text-white/60 font-medium mb-2">{info.title}</h3>
              {info.details.map((detail, idx) => (
                <p key={idx} className="text-white/30 text-sm mb-0.5">
                  {detail}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Form + WhatsApp */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact form */}
          <div className="lg:col-span-2 border border-white/8 bg-white/3 rounded-2xl p-8">
            <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-1">
              Send a message
            </p>
            <h2 className="text-2xl font-serif italic text-white mb-7">
              We'd love to hear from you
            </h2>

            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div className="w-14 h-14 rounded-full bg-[#c97b63]/10 border border-[#c97b63]/30 flex items-center justify-center">
                  <Check className="text-[#c97b63]" size={24} />
                </div>
                <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63]">
                  Sent
                </p>
                <p className="text-xl font-serif italic text-white/40">
                  Message received!
                </p>
                <p className="text-white/25 text-sm">
                  We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name *"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={inputClass}
                    />
                    {errors.name && <p className={errorClass}>{errors.name}</p>}
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={inputClass}
                    />
                    {errors.email && (
                      <p className={errorClass}>{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInputChange}
                    className={inputClass}
                  >
                    {inquiryTypes.map((type) => (
                      <option
                        key={type.value}
                        value={type.value}
                        className="bg-[#0e0a0b]"
                      >
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={inputClass}
                />

                <div>
                  <textarea
                    name="message"
                    placeholder="Your message *"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className={`${inputClass} resize-none`}
                  />
                  {errors.message && (
                    <p className={errorClass}>{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 bg-[#c97b63] hover:bg-[#b56d55] text-white rounded-full px-8 py-3 text-sm transition-all duration-300 active:scale-95"
                >
                  <Send size={14} />
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Right side */}
          <div className="flex flex-col gap-5">
            {/* WhatsApp */}
            <div className="border border-[#c97b63]/20 bg-[#c97b63]/5 rounded-2xl p-6">
              <div className="w-9 h-9 rounded-full bg-[#c97b63]/10 border border-[#c97b63]/20 flex items-center justify-center text-[#c97b63] mb-4">
                <MessageCircle size={18} />
              </div>
              <h3 className="text-white/60 font-medium mb-2">
                Prefer WhatsApp?
              </h3>
              <p className="text-white/30 text-sm leading-relaxed mb-5">
                Chat with us directly for faster responses on orders, product
                questions, or anything else.
              </p>

              <a
                href="https://wa.me/2349050229003"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#c97b63] hover:bg-[#b56d55] text-white rounded-full px-5 py-2.5 text-sm transition-all duration-300 w-fit"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>

            {/* Scent finder CTA */}
            <div className="border border-white/8 bg-white/3 rounded-2xl p-6">
              <p className="text-[10px] tracking-[2px] uppercase text-[#c97b63] mb-2">
                Not sure what to buy?
              </p>
              <h3 className="text-white/60 font-medium mb-2">
                Find your signature scent
              </h3>
              <p className="text-white/30 text-sm leading-relaxed mb-5">
                Tell us your mood, personality, or occasion and we'll recommend
                the perfect fragrance for you.
              </p>

              <a href="/shop">
                className="text-sm text-[#c97b63] hover:underline
                underline-offset-4" Browse collection →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
