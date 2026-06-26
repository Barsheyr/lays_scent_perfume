import React from "react";

const page = () => {
  return (
    <div className="min-h-screen bg-[#0e0a0b] text-white/50 px-6 md:px-16 py-16">
      {/* Header */}
      <div className="text-center mb-20 max-w-2xl mx-auto">
        <p className="text-[11px] tracking-[4px] uppercase text-[#c97b63] mb-4">
          Our story
        </p>
        <h1 className="text-4xl md:text-5xl font-serif italic text-white mb-5">
          More than a scent,
          <br />
          it's a signature.
        </h1>
        <p className="text-white/35 leading-relaxed">
          At Layah's Scent, we believe fragrance is the most intimate form of
          self-expression — invisible, yet unforgettable.
        </p>
      </div>

      {/* Our Story */}
      <section className="mb-20 max-w-3xl mx-auto border border-white/8 bg-white/3 rounded-2xl p-8">
        <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-3">
          Background
        </p>
        <h2 className="text-2xl font-serif italic text-white mb-5">
          How it started
        </h2>
        <p className="text-white/40 leading-relaxed">
          Layah's Scent was born from a deep love for the art of perfumery. What
          started as a personal obsession with rare and beautiful fragrances
          grew into a curated collection for people who understand that scent is
          memory, mood, and identity all at once. We source premium fragrances
          for her, him, and everyone in between — because great scent has no
          boundaries. Every bottle we carry is handpicked for its depth,
          longevity, and the story it tells.
        </p>
      </section>

      {/* Why choose us */}
      <section className="mb-20 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-3">
            Why us
          </p>
          <h2 className="text-2xl font-serif italic text-white">
            What sets us apart
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              title: "Curated Selection",
              text: "Every fragrance is personally tested and chosen for its quality, uniqueness, and staying power.",
            },
            {
              title: "Authentic Only",
              text: "We stock 100% authentic fragrances. No imitations, no compromises — ever.",
            },
            {
              title: "For Everyone",
              text: "Male, female, unisex — our collection celebrates scent without boundaries.",
            },
            {
              title: "Fast Delivery",
              text: "Your fragrance reaches you quickly and safely, packaged with care.",
            },
            {
              title: "Secure Shopping",
              text: "Shop with confidence. Your data and comfort are always our top priority.",
            },
            {
              title: "Expert Guidance",
              text: "Not sure what to pick? Our team helps you find the perfect scent for any mood or occasion.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="border border-white/8 bg-white/3 hover:border-[#c97b63]/30 rounded-2xl p-6 transition-all duration-300"
            >
              <div className="w-8 h-px bg-[#c97b63] mb-4" />
              <h3 className="text-white/70 font-medium mb-2">{item.title}</h3>
              <p className="text-white/35 text-sm leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-3">
            Reviews
          </p>
          <h2 className="text-2xl font-serif italic text-white">
            What our customers say
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              text: "I've never gotten so many compliments on a scent before. Layah's Scent knows exactly how to curate. My go-to store now.",
              name: "Amara O.",
            },
            {
              text: "The packaging was beautiful and the delivery was fast. The perfume smells even better than described. 10/10 experience.",
              name: "Tola Benson",
            },
            {
              text: "I ordered a unisex fragrance as a couple's gift and we both love it. Will definitely be back for more.",
              name: "Chiamaka & Emeka",
            },
          ].map((review, i) => (
            <div
              key={i}
              className="border border-white/8 bg-white/3 hover:border-[#c97b63]/20 rounded-2xl p-6 transition-all duration-300"
            >
              <p className="text-[#c97b63] text-2xl font-serif mb-3">"</p>
              <p className="italic text-white/35 text-sm leading-relaxed mb-5">
                {review.text}
              </p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-px bg-[#c97b63]/50" />
                <p className="text-white/40 text-xs font-medium">
                  {review.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="text-center mt-20">
        <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-4">
          Ready to find your scent?
        </p>
        <h2 className="text-3xl font-serif italic text-white mb-6">
          Wear your story.
        </h2>
        <a
          href="/shop"
          className="inline-flex items-center gap-2 bg-[#c97b63] hover:bg-[#b56d55] text-white rounded-full px-8 py-3 text-sm transition-all duration-300"
        >
          Shop now →
        </a>
      </div>
    </div>
  );
};

export default page;
