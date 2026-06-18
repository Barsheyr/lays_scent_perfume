import React from "react";

const page = () => {
  return (
    <div className="min-h-screen text-gray-800 px-6 md:px-16 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          About Daily Wrist
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          At Daily Wrist, we believe a watch is more than just a timepiece —
          it’s a statement of style, precision, and personality.
        </p>
      </div>

      {/* Our Story Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-4 text-gray-900">Our Story</h2>
        <p className="text-gray-700 leading-relaxed max-w-3xl">
          Daily Wrist was founded with a passion for timeless craftsmanship and
          modern design. We started with a simple idea — to make premium watches
          accessible to everyone who values elegance and reliability. Each piece
          we offer reflects our dedication to detail, blending luxury with
          everyday wearability. Whether you're dressing for a business meeting
          or a casual outing, our collection ensures you make a lasting
          impression, every time.
        </p>
      </section>

      {/* Why Choose Us Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-4 text-gray-900">
          Why Choose Us
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700">
          <li>
            <strong>Premium Quality:</strong> We handpick our watches for
            superior craftsmanship and durability.
          </li>
          <li>
            <strong>Affordable Luxury:</strong> Enjoy elegant designs without
            the heavy price tag.
          </li>
          <li>
            <strong>Secure Shopping:</strong> Your comfort and data security are
            our top priorities.
          </li>
          <li>
            <strong>Fast Delivery:</strong> We ensure your timepiece reaches you
            quickly and safely.
          </li>
          <li>
            <strong>Customer First:</strong> Our support team is always ready to
            assist with care and expertise.
          </li>
        </ul>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-3xl font-semibold mb-6 text-gray-900 text-center">
          What Our Customers Say
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <p className="italic text-gray-700">
              “I’ve bought two watches from Daily Wrist, and both exceeded my
              expectations! The design, feel, and packaging were all top-notch.”
            </p>
            <p className="mt-4 font-semibold text-gray-900">— Michael Ade</p>
          </div>

          {/* Testimonial 2 */}
          <div className="p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
            <p className="italic text-gray-700">
              “Excellent customer service and super fast delivery. The watch
              looks even better in person — I wear it every day!”
            </p>
            <p className="mt-4 font-semibold text-gray-900">— Tola Benson</p>
          </div>

          {/* Testimonial 3 */}
          <div className="p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
            <p className="italic text-gray-700">
              “Daily Wrist is my go-to store for gifts. Their watches are
              stylish, reliable, and always impress my friends.”
            </p>
            <p className="mt-4 font-semibold text-gray-900">— Chiamaka O.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default page;
